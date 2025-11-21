package com.smarthome.optimizer.server2.controller;

import com.smarthome.optimizer.server2.entity.Owner;
import com.smarthome.optimizer.server2.repository.OwnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing Owner entities (CRUD operations).
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/owners")
public class OwnerController {

    private final OwnerRepository ownerRepository;

    // GET /owners - Read All
    @GetMapping
    public List<Owner> getAll() {
        return ownerRepository.findAll();
    }

    // POST /owners - Create
    @PostMapping
    public Owner create(@RequestBody Owner owner) {
        return ownerRepository.save(owner);
    }

    // PUT /owners/{id} - Update
    @PutMapping("/{id}")
    public ResponseEntity<Owner> update(@PathVariable Long id, @RequestBody Owner updated) {
        return ownerRepository.findById(id)
                .map(existing -> {
                    // Update fields manually
                    existing.setFirst_name(updated.getFirst_name());
                    existing.setLast_name(updated.getLast_name());
                    existing.setEmail(updated.getEmail());
                    existing.setMonthly_budget_kwh(updated.getMonthly_budget_kwh());
                    existing.setRegistration_date(updated.getRegistration_date());
                    return ResponseEntity.ok(ownerRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /owners/{id} - Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!ownerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ownerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
