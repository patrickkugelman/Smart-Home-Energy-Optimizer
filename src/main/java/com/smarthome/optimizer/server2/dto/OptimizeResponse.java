package com.smarthome.optimizer.server2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Data Transfer Object for the optimization results.
 */
@Data
@AllArgsConstructor
public class OptimizeResponse {
    private Long deviceId;
    private double usagePercentage;
    private String suggestion;
}
