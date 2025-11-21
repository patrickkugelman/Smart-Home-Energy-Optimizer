package com.smarthome.optimizer.server2.repository;

import com.smarthome.optimizer.server2.entity.ConsumptionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

/**
 * Repository for ConsumptionLog operations. Includes a custom fetch query.
 */
public interface ConsumptionLogRepository extends JpaRepository<ConsumptionLog, Long> {

    /**
     * Finds the latest consumption logs for a given owner, fetching associated device/owner data.
     */
    @Query("""
        SELECT cl FROM ConsumptionLog cl
        JOIN FETCH cl.device d
        JOIN d.owner o
        WHERE o.id = :ownerId
        ORDER BY cl.timestamp DESC
    """)
    List<ConsumptionLog> findLatestByOwner(Long ownerId);

    /**
     * Finds all consumption logs for a specific device, sorted by timestamp descending.
     */
    List<ConsumptionLog> findByDeviceIdOrderByTimestampDesc(Long deviceId);
}
