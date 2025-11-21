package com.smarthome.optimizer.server2.repository;

import com.smarthome.optimizer.server2.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repository for Device CRUD operations. Includes custom finder by Owner ID.
 */
public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByOwnerId(Long ownerId);
}
