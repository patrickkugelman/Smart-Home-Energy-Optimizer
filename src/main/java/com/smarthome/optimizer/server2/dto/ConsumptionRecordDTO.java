package com.smarthome.optimizer.server2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for consumption records presented to the frontend.
 */
@Data
@AllArgsConstructor
public class ConsumptionRecordDTO {
    private Long deviceId;
    private String deviceName;
    private LocalDateTime timestamp;
    private BigDecimal actualKwhConsumed;
}
