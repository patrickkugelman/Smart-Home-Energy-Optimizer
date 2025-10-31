package com.smarthome.optimizer.server2.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents the 'notification_history' table in the database.
 */
@Entity
@Table(name = "notification_history")
@Data
public class NotificationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id")
    private Device device;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Owner owner;

    @Column(name = "notification_type")
    private String notification_type; // e.g., BUDGET_ALERT

    @Column(name = "usage_percentage")
    private BigDecimal usage_percentage;

    @Column(name = "total_consumed")
    private BigDecimal total_consumed;

    @Column(name = "budget_limit")
    private BigDecimal budget_limit;

    @Column(name = "email_sent_to")
    private String email_sent_to;

    @Column(name = "sent_at")
    private LocalDateTime sent_at;

    @Column(name = "email_status")
    private String email_status; // SENT/FAILED/NONE

    @Column(name = "error_message")
    private String error_message;
}
