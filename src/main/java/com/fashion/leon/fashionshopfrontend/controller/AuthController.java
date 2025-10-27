package com.fashion.leon.fashionshopfrontend.controller;

import com.fashion.leon.fashionshopfrontend.dto.AuthResponse;
import com.fashion.leon.fashionshopfrontend.dto.RegisterRequest;
import com.fashion.leon.fashionshopfrontend.service.AuthService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final ObjectMapper objectMapper;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
        this.objectMapper = new ObjectMapper();
    }

    @GetMapping("/login")
    public String showLoginPage(Model model) {
        return "login";
    }

    @GetMapping("/register")
    public String showRegisterPage(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "signin";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute("registerRequest") RegisterRequest request,
                          BindingResult bindingResult,
                          Model model,
                          HttpServletResponse response,
                          RedirectAttributes redirectAttributes) {

        // Check for validation errors
        if (bindingResult.hasErrors()) {
            model.addAttribute("error", "Please fill in all fields correctly");
            return "signin";
        }

        try {
            // Call API to register
            AuthResponse authResponse = authService.register(request);

            // Create cookies for token and user info
            Cookie tokenCookie = new Cookie("token", authResponse.getToken());
            tokenCookie.setHttpOnly(true);
            tokenCookie.setSecure(false); // Set to true in production with HTTPS
            tokenCookie.setPath("/");
            tokenCookie.setMaxAge(24 * 60 * 60); // 24 hours
            response.addCookie(tokenCookie);

            // Add success message
            redirectAttributes.addFlashAttribute("success", authResponse.getMessage());

            // Redirect to dashboard
            return "redirect:/user/dashboard";

        } catch (HttpClientErrorException e) {
            String errorMessage = "Registration failed";
            try {
                // Parse JSON error response
                String responseBody = e.getResponseBodyAsString();
                JsonNode jsonNode = objectMapper.readTree(responseBody);

                // Try to get "error" field from JSON
                if (jsonNode.has("error")) {
                    errorMessage = jsonNode.get("error").asText();
                } else if (jsonNode.has("message")) {
                    errorMessage = jsonNode.get("message").asText();
                } else {
                    errorMessage = responseBody;
                }
            } catch (Exception ex) {
                errorMessage = e.getMessage();
            }
            model.addAttribute("error", errorMessage);
            return "signin";

        } catch (RestClientException e) {
            model.addAttribute("error", "Unable to connect to authentication server. Please try again later.");
            return "signin";

        } catch (Exception e) {
            model.addAttribute("error", "An unexpected error occurred: " + e.getMessage());
            return "signin";
        }
    }

    @GetMapping("/forget-password")
    public String forgetPassword() {
        return "forget-password";
    }
}
