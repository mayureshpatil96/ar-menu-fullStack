package com.ourrestaurant.Backend.controller;

import com.ourrestaurant.Backend.model.MenuItem;
import com.ourrestaurant.Backend.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    @Autowired
    private MenuService menuService;

    // GET all menu items
    // http://localhost:8080/api/menu
    @GetMapping
    public List<MenuItem> getAllItems() {
        return menuService.getAllItems();
    }

    // GET items by category
    // http://localhost:8080/api/menu/category/Starters
    @GetMapping("/category/{category}")
    public List<MenuItem> getByCategory(@PathVariable String category) {
        return menuService.getByCategory(category);
    }

    // GET single item
    // http://localhost:8080/api/menu/1
    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getById(@PathVariable Long id) {
        return menuService.getById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // POST add new item
    // http://localhost:8080/api/menu
    @PostMapping
    public MenuItem addItem(@RequestBody MenuItem item) {
        return menuService.addItem(item);
    }

    // PUT update item
    // http://localhost:8080/api/menu/1
    @PutMapping("/{id}")
    public MenuItem updateItem(@PathVariable Long id, @RequestBody MenuItem item) {
        return menuService.updateItem(id, item);
    }

    // DELETE item
    // http://localhost:8080/api/menu/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        menuService.deleteItem(id);
        return ResponseEntity.ok().build();
    }
}