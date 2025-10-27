package com.fashion.leon.fashionshopfrontend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/shop")
public class ShopController {

    @GetMapping
    public String shop() {
        return "shop";
    }

    @GetMapping("/sidebar")
    public String shopSidebar() {
        return "shop-sidebar";
    }

    @GetMapping("/product")
    public String productSingle() {
        return "product-single";
    }

    @GetMapping("/cart")
    public String cart() {
        return "cart";
    }

    @GetMapping("/empty-cart")
    public String emptyCart() {
        return "empty-cart";
    }

    @GetMapping("/checkout")
    public String checkout() {
        return "checkout";
    }

    @GetMapping("/confirmation")
    public String confirmation() {
        return "confirmation";
    }

    @GetMapping("/purchase-confirmation")
    public String purchaseConfirmation() {
        return "purchase-confirmation";
    }
}

