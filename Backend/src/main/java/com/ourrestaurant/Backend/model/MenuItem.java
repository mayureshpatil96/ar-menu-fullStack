package com.ourrestaurant.Backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String nameHindi;
    private String description;
    private String descriptionHindi;
    private Double price;
    private String category;
    private String emoji;
    private String color;
    private Double rating;
    private String prepTime;
    private Boolean available = true;
    private String imageUrl;
}