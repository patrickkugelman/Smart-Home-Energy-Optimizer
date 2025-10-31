package com.smarthome.optimizer.server2.controller;

import com.smarthome.optimizer.server2.entity.Device;
import com.smarthome.optimizer.server2.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing Device entities (CRUD operations).
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/devices")
public class DeviceController {

    private final DeviceRepository deviceRepository;

    // GET /devices - Read All
    @GetMapping
    public List<Device> getAll() {
        return deviceRepository.findAll();
    }

    // POST /devices - Create
    @PostMapping
    public Device create(@RequestBody Device device) {
        return deviceRepository.save(device);
    }

    // PUT /devices/{id} - Update
    @PutMapping("/{id}")
    public ResponseEntity<Device> update(@PathVariable Long id, @RequestBody Device updated) {
        return deviceRepository.findById(id)
                .map(existing -> {
                    // Update fields manually
                    existing.setOwner(updated.getOwner());
                    existing.setName(updated.getName());
                    existing.setType(updated.getType());
                    existing.setHourly_power_kwh(updated.getHourly_power_kwh());
                    existing.setIs_active(updated.getIs_active());
                    return ResponseEntity.ok(deviceRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /devices/{id} - Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!deviceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        deviceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
