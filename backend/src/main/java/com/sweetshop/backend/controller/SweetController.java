package com.sweetshop.backend.controller;

import com.sweetshop.backend.model.Sweet;
import com.sweetshop.backend.service.SweetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {

    private final SweetService service;

    public SweetController(SweetService service) {
        this.service = service;
    }

    @GetMapping
    public List<Sweet> getAllSweets() {
        return service.getAllSweets();
    }
    
    @GetMapping("/search") // e.g., ?q=chocolate
    public List<Sweet> searchSweets(@RequestParam(required = false) String q) {
        if (q == null || q.isEmpty()) {
            return service.getAllSweets();
        }
        return service.searchSweets(q);
    }

    @PostMapping
    public ResponseEntity<Sweet> addSweet(@RequestBody Sweet sweet) {
        // Ideally verify ADMIN role here or in SecurityConfig
        return ResponseEntity.ok(service.addSweet(sweet));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sweet> updateSweet(@PathVariable Long id, @RequestBody Sweet sweet) {
         // Ideally verify ADMIN role here or in SecurityConfig
        return ResponseEntity.ok(service.updateSweet(id, sweet));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSweet(@PathVariable Long id) {
         // Ideally verify ADMIN role here or in SecurityConfig
        service.deleteSweet(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/purchase")
    public ResponseEntity<Sweet> purchaseSweet(@PathVariable Long id) {
        return ResponseEntity.ok(service.purchaseSweet(id));
    }

    @PostMapping("/{id}/restock")
    public ResponseEntity<Sweet> restockSweet(@PathVariable Long id, @RequestParam int amount) {
        // Ideally verify ADMIN role here
        return ResponseEntity.ok(service.restockSweet(id, amount));
    }
}
