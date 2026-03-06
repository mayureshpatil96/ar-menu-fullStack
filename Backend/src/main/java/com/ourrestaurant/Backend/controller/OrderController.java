package com.ourrestaurant.Backend.controller;

import com.ourrestaurant.Backend.dto.OrderRequest;
import com.ourrestaurant.Backend.model.Order;
import com.ourrestaurant.Backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // POST place new order
    // http://localhost:8080/api/orders
    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request) {
        Order order = orderService.placeOrder(request);
        return ResponseEntity.ok(order);
    }

    // GET all orders (kitchen view)
    // http://localhost:8080/api/orders
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // GET orders by table
    // http://localhost:8080/api/orders/table/5
    @GetMapping("/table/{tableNo}")
    public List<Order> getByTable(@PathVariable Integer tableNo) {
        return orderService.getOrdersByTable(tableNo);
    }

    // GET orders by status
    // http://localhost:8080/api/orders/status/PENDING
    @GetMapping("/status/{status}")
    public List<Order> getByStatus(@PathVariable String status) {
        return orderService.getOrdersByStatus(status);
    }

    // GET single order
    // http://localhost:8080/api/orders/1
    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {
        return orderService.getById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // PUT update order status
    // http://localhost:8080/api/orders/1/status
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        return orderService.updateStatus(id, status)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}