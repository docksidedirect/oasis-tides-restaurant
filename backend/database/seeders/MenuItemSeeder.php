<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menuItems = [
            // Appetizers
            [
                'name' => 'Grilled Shrimp Skewers',
                'description' => 'Fresh shrimp marinated in herbs and grilled to perfection, served with garlic aioli',
                'price' => 14.99,
                'category' => 'appetizers',
                'image' => 'shrimp-skewers.jpg',
                'popular' => true,
                'available' => true,
                'ingredients' => json_encode(['shrimp', 'herbs', 'garlic', 'olive oil']),
                'allergens' => json_encode(['shellfish']),
            ],
            [
                'name' => 'Calamari Rings',
                'description' => 'Crispy fried squid rings with marinara sauce and lemon wedges',
                'price' => 12.99,
                'category' => 'appetizers',
                'image' => 'calamari-rings.jpg',
                'popular' => false,
                'available' => true,
                'ingredients' => json_encode(['squid', 'flour', 'spices']),
                'allergens' => json_encode(['gluten', 'seafood']),
            ],
            [
                'name' => 'Oyster Platter',
                'description' => 'Fresh oysters on the half shell with cocktail sauce and mignonette',
                'price' => 18.99,
                'category' => 'appetizers',
                'image' => 'oyster-platter.jpg',
                'popular' => true,
                'available' => true,
                'ingredients' => json_encode(['oysters', 'cocktail sauce', 'mignonette']),
                'allergens' => json_encode(['shellfish']),
            ],

            // Main Courses
            [
                'name' => 'Grilled Salmon',
                'description' => 'Atlantic salmon fillet grilled with lemon butter sauce, served with seasonal vegetables',
                'price' => 26.99,
                'category' => 'main_courses',
                'image' => 'grilled-salmon.jpg',
                'popular' => true,
                'available' => true,
                'ingredients' => json_encode(['salmon', 'lemon', 'butter', 'vegetables']),
                'allergens' => json_encode(['fish', 'dairy']),
            ],
            [
                'name' => 'Lobster Thermidor',
                'description' => 'Classic lobster thermidor with rich cream sauce and cheese, served with rice pilaf',
                'price' => 42.99,
                'category' => 'main_courses',
                'image' => 'lobster-thermidor.jpg',
                'popular' => true,
                'available' => true,
                'ingredients' => json_encode(['lobster', 'cream', 'cheese', 'rice']),
                'allergens' => json_encode(['shellfish', 'dairy']),
            ],
            [
                'name' => 'Seafood Paella',
                'description' => 'Traditional Spanish paella with mixed seafood, saffron rice, and vegetables',
                'price' => 32.99,
                'category' => 'main_courses',
                'image' => 'seafood-paella.jpg',
                'popular' => true,
                'available' => true,
                'ingredients' => json_encode(['rice', 'seafood', 'saffron', 'vegetables']),
                'allergens' => json_encode(['shellfish', 'fish']),
            ],
            [
                'name' => 'Fish and Chips',
                'description' => 'Beer-battered cod with crispy fries and mushy peas, served with tartar sauce',
                'price' => 19.99,
                'category' => 'main_courses',
                'image' => 'fish-and-chips.jpg',
                'popular' => false,
                'available' => true,
                'ingredients' => json_encode(['cod', 'potatoes', 'peas', 'beer batter']),
                'allergens' => json_encode(['fish', 'gluten']),
            ],

            // Desserts
            [
                'name' => 'Chocolate Lava Cake',
                'description' => 'Warm chocolate cake with molten center, served with vanilla ice cream',
                'price' => 8.99,
                'category' => 'desserts',
                'image' => 'chocolate-lava-cake.jpg',
                'popular' => true,
                'available' => true,
                'ingredients' => json_encode(['chocolate', 'flour', 'eggs', 'vanilla ice cream']),
                'allergens' => json_encode(['gluten', 'dairy', 'eggs']),
            ],
            [
                'name' => 'Key Lime Pie',
                'description' => 'Classic Florida key lime pie with graham cracker crust and whipped cream',
                'price' => 7.99,
                'category' => 'desserts',
                'image' => 'key-lime-pie.jpg',
                'popular' => false,
                'available' => true,
                'ingredients' => json_encode(['key lime', 'graham crackers', 'cream']),
                'allergens' => json_encode(['gluten', 'dairy']),
            ],

            // Beverages
            [
                'name' => 'Fresh Lemonade',
                'description' => 'Freshly squeezed lemon juice with mint and sparkling water',
                'price' => 4.99,
                'category' => 'beverages',
                'image' => 'fresh-lemonade.jpg',
                'popular' => false,
                'available' => true,
                'ingredients' => json_encode(['lemon', 'mint', 'sparkling water']),
                'allergens' => json_encode([]),
            ],
            [
                'name' => 'House Wine Selection',
                'description' => 'Curated selection of red and white wines from local vineyards',
                'price' => 8.99,
                'category' => 'beverages',
                'image' => 'house-wine.jpg',
                'popular' => true,
                'available' => true,
                'ingredients' => json_encode(['grapes']),
                'allergens' => json_encode(['sulfites']),
            ],
        ];

        foreach ($menuItems as $item) {
            \App\Models\MenuItem::create($item);
        }
    }
}
