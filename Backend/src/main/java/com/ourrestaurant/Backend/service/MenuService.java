package com.ourrestaurant.Backend.service;

import com.ourrestaurant.Backend.model.MenuItem;
import com.ourrestaurant.Backend.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MenuService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    // Get all available menu items
    public List<MenuItem> getAllItems() {
        return menuItemRepository.findByAvailableTrue();
    }

    // Get items by category
    public List<MenuItem> getByCategory(String category) {
        return menuItemRepository.findByCategory(category);
    }

    // Get single item
    public Optional<MenuItem> getById(Long id) {
        return menuItemRepository.findById(id);
    }

    // Add new item (for admin)
    public MenuItem addItem(MenuItem item) {
        return menuItemRepository.save(item);
    }

    // Update item (for admin)
    public MenuItem updateItem(Long id, MenuItem updatedItem) {
        updatedItem.setId(id);
        return menuItemRepository.save(updatedItem);
    }

    // Delete item (for admin)
    public void deleteItem(Long id) {
        menuItemRepository.deleteById(id);
    }
}