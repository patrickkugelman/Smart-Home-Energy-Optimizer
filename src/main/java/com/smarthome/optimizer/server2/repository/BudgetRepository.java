package com.smarthome.optimizer.server2.repository;

import com.smarthome.optimizer.server2.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByDeviceIdAndIsActiveTrue(Long deviceId);
}


