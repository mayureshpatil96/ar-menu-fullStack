package com.ourrestaurant.Backend.config;

import com.ourrestaurant.Backend.model.MenuItem;
import com.ourrestaurant.Backend.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Override
    public void run(String... args) throws Exception {

        // Only seed if database is empty
        if (menuItemRepository.count() > 0) {
            System.out.println("Database already has data. Skipping seeding.");
            return;
        }

        System.out.println("Seeding menu data...");

        menuItemRepository.save(createItem(
            "Butter Chicken", "बटर चिकन",
            "Creamy tomato gravy with tender chicken",
            "मलाईदार टमाटर की ग्रेवी के साथ नरम चिकन",
            280.0, "Main Course", "🍛", "#FF6B35", 4.8, "20 min"
        ));

        menuItemRepository.save(createItem(
            "Paneer Tikka", "पनीर टिक्का",
            "Grilled cottage cheese with spices",
            "मसालों के साथ ग्रिल्ड पनीर",
            220.0, "Starters", "🧀", "#FFB347", 4.6, "15 min"
        ));

        menuItemRepository.save(createItem(
            "Dal Makhani", "दाल मखनी",
            "Slow cooked black lentils with butter",
            "मक्खन के साथ धीमी आंच पर पकी काली दाल",
            180.0, "Main Course", "🫘", "#8B4513", 4.7, "25 min"
        ));

        menuItemRepository.save(createItem(
            "Garlic Naan", "गार्लिक नान",
            "Soft bread with garlic and butter",
            "लहसुन और मक्खन के साथ मुलायम रोटी",
            60.0, "Bread", "🫓", "#DEB887", 4.5, "10 min"
        ));

        menuItemRepository.save(createItem(
            "Mango Lassi", "मैंगो लस्सी",
            "Fresh mango yogurt smoothie",
            "ताजा आम का दही स्मूदी",
            120.0, "Drinks", "🥭", "#FFA500", 4.9, "5 min"
        ));

        menuItemRepository.save(createItem(
            "Gulab Jamun", "गुलाब जामुन",
            "Soft milk dumplings in rose syrup",
            "गुलाब के शरबत में मुलायम मिल्क डम्पलिंग",
            90.0, "Desserts", "🍮", "#C0392B", 4.8, "5 min"
        ));

        menuItemRepository.save(createItem(
            "Samosa", "समोसा",
            "Crispy fried pastry with spiced potatoes",
            "मसालेदार आलू के साथ कुरकुरी तली हुई पेस्ट्री",
            40.0, "Starters", "🥟", "#F39C12", 4.5, "10 min"
        ));

        menuItemRepository.save(createItem(
            "Masala Chai", "मसाला चाय",
            "Spiced Indian tea with milk",
            "दूध के साथ मसालेदार भारतीय चाय",
            40.0, "Drinks", "🍵", "#795548", 4.7, "5 min"
        ));

        menuItemRepository.save(createItem(
            "Chicken Biryani", "चिकन बिरयानी",
            "Fragrant basmati rice with spiced chicken",
            "मसालेदार चिकन के साथ सुगंधित बासमती चावल",
            320.0, "Main Course", "🍚", "#E67E22", 4.9, "30 min"
        ));

        menuItemRepository.save(createItem(
            "Tandoori Roti", "तंदूरी रोटी",
            "Whole wheat bread baked in tandoor",
            "तंदूर में पकी साबुत गेहूं की रोटी",
            30.0, "Bread", "🫓", "#D4AC0D", 4.4, "8 min"
        ));

        menuItemRepository.save(createItem(
            "Raita", "रायता",
            "Chilled yogurt with cucumber and spices",
            "खीरे और मसालों के साथ ठंडा दही",
            60.0, "Starters", "🥣", "#85C1E9", 4.3, "5 min"
        ));

        menuItemRepository.save(createItem(
            "Kheer", "खीर",
            "Creamy rice pudding with cardamom",
            "इलायची के साथ मलाईदार चावल की खीर",
            80.0, "Desserts", "🍚", "#F8C471", 4.6, "10 min"
        ));

        System.out.println("✅ Menu data seeded successfully! " +
            menuItemRepository.count() + " items added.");
    }

    private MenuItem createItem(
        String name, String nameHindi,
        String desc, String descHindi,
        Double price, String category,
        String emoji, String color,
        Double rating, String prepTime
    ) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setNameHindi(nameHindi);
        item.setDescription(desc);
        item.setDescriptionHindi(descHindi);
        item.setPrice(price);
        item.setCategory(category);
        item.setEmoji(emoji);
        item.setColor(color);
        item.setRating(rating);
        item.setPrepTime(prepTime);
        item.setAvailable(true);
        return item;
    }
}