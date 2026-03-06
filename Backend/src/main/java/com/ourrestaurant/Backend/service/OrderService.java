package com.ourrestaurant.Backend.service;

import com.ourrestaurant.Backend.dto.OrderRequest;
import com.ourrestaurant.Backend.model.Order;
import com.ourrestaurant.Backend.model.OrderItem;
import com.ourrestaurant.Backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // Place new order
    public Order placeOrder(OrderRequest request) {
        Order order = new Order();
        order.setTableNo(request.getTableNo());
        order.setLanguage(request.getLanguage());
        order.setStatus("PENDING");

        // Build order items
        List<OrderItem> items = new ArrayList<>();
        double total = 0;

        for (OrderRequest.OrderItemRequest req : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setItemName(req.getItemName());
            item.setItemNameHindi(req.getItemNameHindi());
            item.setEmoji(req.getEmoji());
            item.setQuantity(req.getQuantity());
            item.setPrice(req.getPrice());
            item.setItemTotal(req.getPrice() * req.getQuantity());
            item.setSpecialInstructions(req.getSpecialInstructions());
            item.setOrder(order);
            items.add(item);
            total += item.getItemTotal();
        }

        double gst = Math.round(total * 0.05 * 100.0) / 100.0;
        order.setItems(items);
        order.setTotalAmount(total);
        order.setGstAmount(gst);
        order.setFinalAmount(total + gst);

        return orderRepository.save(order);
    }

    // Get all orders (for kitchen/admin)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get orders by table
    public List<Order> getOrdersByTable(Integer tableNo) {
        return orderRepository.findByTableNoOrderByCreatedAtDesc(tableNo);
    }

    // Get orders by status
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    // Update order status
    public Optional<Order> updateStatus(Long id, String status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            return orderRepository.save(order);
        });
    }

    // Get single order
    public Optional<Order> getById(Long id) {
        return orderRepository.findById(id);
    }
}