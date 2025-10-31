package com.smarthome.optimizer.server2.controller;

import com.smarthome.optimizer.server2.dto.ConsumptionRecordDTO;
import com.smarthome.optimizer.server2.dto.OptimizeResponse;
import com.smarthome.optimizer.server2.entity.ConsumptionLog;
import com.smarthome.optimizer.server2.service.EnergyService;
import com.smarthome.optimizer.server2.repository.ConsumptionLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller for custom, domain-specific endpoints (optimization, filtering).
 */
@RestController
@RequiredArgsConstructor
public class CustomController {

    private final ConsumptionLogRepository consumptionLogRepository;
    private final EnergyService energyService;

    /**
     * Custom endpoint to get the latest consumption logs for a given owner.
     * Maps the full entity to a cleaner DTO.
     * GET /consumption/filter/{ownerId}
     */
    @GetMapping("/consumption/filter/{ownerId}")
    public List<ConsumptionRecordDTO> getLatestConsumptionByOwner(@PathVariable Long ownerId) {
        List<ConsumptionLog> all = consumptionLogRepository.findLatestByOwner(ownerId);

        // Limit to 20 records and map to DTO
        return all.stream()
                .limit(20)
                .map(cl -> new ConsumptionRecordDTO(
                        cl.getDevice().getId(),
                        cl.getDevice().getName(),
                        cl.getTimestamp(),
                        cl.getActual_kwh_consumed()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Custom endpoint to run the energy optimization logic for a specific device.
     * GET /optimize/{deviceId}
     */
    @GetMapping("/optimize/{deviceId}")
    public OptimizeResponse optimize(@PathVariable Long deviceId) {
        return energyService.optimizeDevice(deviceId);
    }
}
