package com.sweetshop.backend.repository;

import com.sweetshop.backend.model.Sweet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SweetRepository extends JpaRepository<Sweet, Long> {
    List<Sweet> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
}
