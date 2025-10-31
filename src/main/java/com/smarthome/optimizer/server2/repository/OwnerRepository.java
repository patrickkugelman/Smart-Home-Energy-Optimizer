package com.smarthome.optimizer.server2.repository;

import com.smarthome.optimizer.server2.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for Owner CRUD operations.
 */
public interface OwnerRepository extends JpaRepository<Owner, Long> {}
