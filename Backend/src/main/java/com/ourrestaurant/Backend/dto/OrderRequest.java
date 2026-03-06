package com.ourrestaurant.Backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Integer tableNo;
    private String language;
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private String itemName;
        private String itemNameHindi;
        private String emoji;
        private Integer quantity;
        private Double price;
        private String specialInstructions;
    }
}