package com.smarthome.optimizer.server2.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents the 'consumption_log' table in the database.
 */
@Entity
@Table(name = "consumption_log")
@Data
public class ConsumptionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id")
    private Device device;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @Column(name = "actual_kwh_consumed")
    private BigDecimal actual_kwh_consumed;
}
