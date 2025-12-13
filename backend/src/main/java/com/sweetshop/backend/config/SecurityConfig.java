package com.sweetshop.backend.config;

import com.sweetshop.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthFilter,
            AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 🔥 Disable CSRF for REST APIs
                .csrf(csrf -> csrf.disable())

                // 🔥 Enable CORS with our config
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 🔐 Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // ✅ AUTH endpoints (FIXED)
                        .requestMatchers("/api/auth/**").permitAll()

                        // ✅ H2 console (local only)
                        .requestMatchers("/h2-console/**").permitAll()

                        // ✅ Public GET access to sweets
                        .requestMatchers(HttpMethod.GET, "/api/sweets/**").permitAll()

                        // 🔐 Purchase requires login
                        .requestMatchers(HttpMethod.POST, "/api/sweets/*/purchase").authenticated()

                        // 🔐 Admin-only operations
                        .requestMatchers(HttpMethod.POST, "/api/sweets/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/sweets/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/sweets/**").hasRole("ADMIN")

                        // ✅ Explicitly allow OPTIONS for preflight checks
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 🔐 Everything else requires auth
                        .anyRequest().authenticated())

                // 🔥 Stateless JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 🔐 Auth provider
                .authenticationProvider(authenticationProvider)

                // 🔐 JWT filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                // 🧪 Allow H2 console frames
                .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    // ✅ REAL CORS CONFIG (properties alone don't work)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 🔥 Netlify frontend
        // Allow all origins (Localhost + Netlify + Render)
        config.setAllowedOriginPatterns(Collections.singletonList("*"));

        config.setAllowedMethods(
                Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow all headers to avoid preflight errors
        config.setAllowedHeaders(Collections.singletonList("*"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}