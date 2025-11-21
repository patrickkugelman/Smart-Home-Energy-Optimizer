package com.smarthome.optimizer.server2.repository;

import com.smarthome.optimizer.server2.entity.NotificationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for NotificationHistory CRUD operations.
 */
public interface NotificationHistoryRepository extends JpaRepository<NotificationHistory, Long> {}
