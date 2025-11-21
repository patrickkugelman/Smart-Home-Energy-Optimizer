package com.smarthome.optimizer.server2.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import com.smarthome.optimizer.server2.entity.Device;


/**
 * Represents the 'budget' table in the database.
 */
@Entity
@Table(name = "budget")
@Data
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id")
    private Device device;

    @Column(name = "period_type")
    private String periodType; // e.g., DAILY, WEEKLY, MONTHLY

    @Column(name = "limit_kwh")
    private BigDecimal limitKwh;

    @Column(name = "is_active")
    private Boolean isActive;
}
