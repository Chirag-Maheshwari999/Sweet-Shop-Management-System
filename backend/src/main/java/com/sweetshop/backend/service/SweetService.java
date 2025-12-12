package com.sweetshop.backend.service;

import com.sweetshop.backend.model.Sweet;
import com.sweetshop.backend.repository.SweetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SweetService {
    private final SweetRepository repository;

    public SweetService(SweetRepository repository) {
        this.repository = repository;
    }

    public List<Sweet> getAllSweets() {
        return repository.findAll();
    }
    
    public List<Sweet> searchSweets(String query) {
        // Simple search logic, assumes query is for name or description
        return repository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    public Sweet getSweetById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Sweet not found"));
    }

    public Sweet addSweet(Sweet sweet) {
        return repository.save(sweet);
    }

    public Sweet updateSweet(Long id, Sweet sweetDetails) {
        Sweet sweet = getSweetById(id);
        sweet.setName(sweetDetails.getName());
        sweet.setDescription(sweetDetails.getDescription());
        sweet.setPrice(sweetDetails.getPrice());
        sweet.setQuantity(sweetDetails.getQuantity());
        sweet.setImageUrl(sweetDetails.getImageUrl());
        return repository.save(sweet);
    }

    public void deleteSweet(Long id) {
        repository.deleteById(id);
    }

    public Sweet purchaseSweet(Long id) {
        Sweet sweet = getSweetById(id);
        if (sweet.getQuantity() > 0) {
            sweet.setQuantity(sweet.getQuantity() - 1);
            return repository.save(sweet);
        } else {
            throw new RuntimeException("Sweet is out of stock");
        }
    }

    public Sweet restockSweet(Long id, int amount) {
        Sweet sweet = getSweetById(id);
        if (amount > 0) {
            sweet.setQuantity(sweet.getQuantity() + amount);
            return repository.save(sweet);
        }
        return sweet;
    }
}
