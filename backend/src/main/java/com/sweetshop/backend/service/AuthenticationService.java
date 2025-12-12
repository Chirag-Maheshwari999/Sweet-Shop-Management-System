package com.sweetshop.backend.service;

import com.sweetshop.backend.model.User;
import com.sweetshop.backend.repository.UserRepository;
import com.sweetshop.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository repository, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public Map<String, Object> register(User request) {
        // Default role is USER if not specified, but in our case we might want to allow
        // specifying it for demo purposes
        // Or restricted logic. For now, let's accept what's passed or default to USER.
        String role = (request.getRole() == null || request.getRole().isEmpty()) ? "USER"
                : request.getRole().toUpperCase();

        var user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                role);
        repository.save(user);

        // Return minimal info or token directly. Let's return success message.
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return response;
    }

    public Map<String, Object> authenticate(User request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));
        var user = repository.findByUsername(request.getUsername())
                .orElseThrow();

        // Create UserDetails specifically for token generation
        var userDetails = new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                java.util.Collections
                        .singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "ROLE_" + user.getRole())));

        var jwtToken = jwtService.generateToken(userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwtToken);
        response.put("user", user); // Return user info
        return response;
    }
}
