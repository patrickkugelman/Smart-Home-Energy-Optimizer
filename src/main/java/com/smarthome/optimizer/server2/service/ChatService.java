package com.smarthome.optimizer.server2.service;

import com.smarthome.optimizer.server2.dto.OptimizeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Service to handle incoming chat/WebSocket commands.
 */
@Service
@RequiredArgsConstructor
public class ChatService {
    private final EnergyService energyService;

    /**
     * Processes a chat message and returns a text response.
     * Supports commands like "optimize device {id}".
     */
    public String handleMessage(String message) {
        String normalized = message == null ? "" : message.trim().toLowerCase();

        // expected: "optimize device 3"
        if (normalized.startsWith("optimize device")) {
            String[] parts = normalized.split("\\s+");
            if (parts.length < 3) {
                return "Invalid command format. Use: optimize device {id}";
            }
            try {
                Long deviceId = Long.parseLong(parts[2]);
                OptimizeResponse resp = energyService.optimizeDevice(deviceId);
                return String.format("Device %d: usage %.2f%% -> %s",
                        resp.getDeviceId(), resp.getUsagePercentage(), resp.getSuggestion());
            } catch (NumberFormatException e) {
                return "Invalid device ID. Must be a number.";
            } catch (IllegalArgumentException e) {
                return e.getMessage(); // Handles "Device not found"
            } catch (Exception e) {
                // Catch any other unexpected exception
                return "An unexpected error occurred during optimization.";
            }
        }

        return "Unknown command. Try: optimize device {id}";
    }
}
