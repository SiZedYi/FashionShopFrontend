package com.fashion.leon.fashionshopfrontend.service;

import com.fashion.leon.fashionshopfrontend.dto.AuthResponse;
import com.fashion.leon.fashionshopfrontend.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AuthService {

    private final RestClient restClient;

    @Value("${api.base.url:http://localhost:8000}")
    private String apiBaseUrl;

    public AuthService() {
        this.restClient = RestClient.create();
    }

    public AuthResponse register(RegisterRequest request) {
        return restClient.post()
                .uri(apiBaseUrl + "/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(AuthResponse.class);
    }
}

