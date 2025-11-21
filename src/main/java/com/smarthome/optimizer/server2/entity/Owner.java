package com.smarthome.optimizer.server2.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Represents the 'owner' table in the database.
 */
@Entity
@Table(name = "owner")
@Data
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String first_name;

    @Column(name = "last_name")
    private String last_name;

    private String email;

    @Column(name = "monthly_budget_kwh")
    private BigDecimal monthly_budget_kwh;

    @Column(name = "registration_date")
    private LocalDate registration_date;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Device> devices;
}
