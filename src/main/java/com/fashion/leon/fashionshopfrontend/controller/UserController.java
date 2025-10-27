package com.fashion.leon.fashionshopfrontend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/user")
public class UserController {

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    @GetMapping("/profile")
    public String profileDetails() {
        return "profile-details";
    }

    @GetMapping("/address")
    public String address() {
        return "address";
    }

    @GetMapping("/orders")
    public String orders() {
        return "order";
    }
}
