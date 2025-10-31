package com.smarthome.optimizer.server2.service;

import com.smarthome.optimizer.server2.dto.OptimizeResponse;
import com.smarthome.optimizer.server2.entity.Budget;
import com.smarthome.optimizer.server2.entity.ConsumptionLog;
import com.smarthome.optimizer.server2.entity.Device;
import com.smarthome.optimizer.server2.entity.NotificationHistory;
import com.smarthome.optimizer.server2.repository.BudgetRepository;
import com.smarthome.optimizer.server2.repository.ConsumptionLogRepository;
import com.smarthome.optimizer.server2.repository.DeviceRepository;
import com.smarthome.optimizer.server2.repository.NotificationHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;


/**
 * Core business logic for energy optimization and budget alerts.
 */
@Service
@RequiredArgsConstructor
public class EnergyService {
    private final DeviceRepository deviceRepository;
    private final BudgetRepository budgetRepository;
    private final ConsumptionLogRepository consumptionLogRepository;
    private final NotificationHistoryRepository notificationHistoryRepository;
    private final EmailService emailService;

    /**
     * Analyzes device consumption against its budget and provides an optimization suggestion.
     * Triggers an email alert if usage is over 90%.
     */
    @Transactional(readOnly = true)
    public OptimizeResponse optimizeDevice(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new IllegalArgumentException("Device not found: " + deviceId));

        // ✅ Get active budget (numele metodei trebuie să fie fără underscore)
        List<Budget> budgets = budgetRepository.findByDeviceIdAndIsActiveTrue(deviceId);
        if (budgets.isEmpty()) {
            return new OptimizeResponse(deviceId, 0.0, "No active budget found");
        }
        Budget budget = budgets.get(0);

        // Get consumption logs for this device
        List<ConsumptionLog> logs = consumptionLogRepository.findByDeviceIdOrderByTimestampDesc(deviceId);
        BigDecimal totalConsumed = logs.stream()
                .map(ConsumptionLog::getActual_kwh_consumed)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal limit = budget.getLimitKwh() == null ? BigDecimal.ZERO : budget.getLimitKwh();


        // Calculate usage percentage
        double usagePct = limit.signum() == 0
                ? 0.0
                : totalConsumed
                .multiply(BigDecimal.valueOf(100))
                .divide(limit, 2, RoundingMode.HALF_UP)
                .doubleValue();

        String suggestion;
        if (usagePct >= 100.0) {
            suggestion = "Device exceeded budget. Turn off non-essential operations.";
        } else if (usagePct >= 90.0) {
            suggestion = "Reduce device activity by 20%";
        } else if (usagePct >= 75.0) {
            suggestion = "Consider reducing device activity by 10%";
        } else {
            suggestion = "Device usage within budget";
        }

        // Email Alert Logic: Send alert and log notification if > 90%
        if (usagePct >= 90.0 && device.getOwner() != null && device.getOwner().getEmail() != null) {
            logAndNotify(device, usagePct, totalConsumed, limit);
        }

        return new OptimizeResponse(deviceId, usagePct, suggestion);
    }

    /**
     * Logs the notification to the database and attempts to send an email.
     */
    @Transactional
    protected void logAndNotify(Device device, double usagePct, BigDecimal totalConsumed, BigDecimal limit) {
        NotificationHistory nh = new NotificationHistory();
        nh.setDevice(device);
        nh.setOwner(device.getOwner());
        nh.setNotification_type("BUDGET_ALERT");
        nh.setUsage_percentage(BigDecimal.valueOf(usagePct));
        nh.setTotal_consumed(totalConsumed);
        nh.setBudget_limit(limit);
        nh.setEmail_sent_to(device.getOwner().getEmail());
        nh.setSent_at(LocalDateTime.now());

        try {
            String subject = "SmartHome Alert: Budget usage " + usagePct + "%";
            String text = "Device '" + device.getName() + "' reached " + usagePct
                    + "% of its budget (" + totalConsumed + " / " + limit + " kWh).";
            emailService.sendSimple(device.getOwner().getEmail(), subject, text);
            nh.setEmail_status("SENT");
            nh.setError_message(null);
        } catch (Exception ex) {
            nh.setEmail_status("FAILED");
            nh.setError_message(ex.getMessage());
            // Log the error for debugging purposes
            System.err.println("Failed to send email alert: " + ex.getMessage());
        }

        notificationHistoryRepository.save(nh);
    }
}
