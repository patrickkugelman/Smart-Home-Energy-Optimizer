package com.smarthome.optimizer.server2.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * Represents the 'device' table in the database.
 */
@Entity
@Table(name = "device")
@Data
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Owner owner;

    private String name;

    private String type;

    @Column(name = "hourly_power_kwh")
    private BigDecimal hourly_power_kwh;

    @Column(name = "is_active")
    private Boolean is_active;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Budget> budgets;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ConsumptionLog> consumptionLogs;
}
