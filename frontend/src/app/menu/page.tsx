"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext"; // Import cart context

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
}

const menuItems: MenuItem[] = [
  // Appetizers
  {
    id: 1,
    name: "Tuna Tartare",
    description:
      "Fresh yellowfin tuna with avocado, cucumber, and citrus dressing",
    price: 22.99,
    category: "appetizers",
    image: "🍣",
    popular: true,
  },
  {
    id: 2,
    name: "Lobster Bisque",
    description: "Rich and creamy soup with fresh lobster meat and herbs",
    price: 16.99,
    category: "appetizers",
    image: "🦞",
  },
  // Main Courses
  {
    id: 5,
    name: "Grilled Salmon",
    description:
      "Atlantic salmon with herb crust, served with seasonal vegetables",
    price: 28.99,
    category: "mains",
    image: "🐟",
    popular: true,
  },
  {
    id: 8,
    name: "Ocean Platter",
    description:
      "Mixed seafood platter for two with lobster, shrimp, and scallops",
    price: 65.99,
    category: "mains",
    image: "🍽️",
    popular: true,
  },
  // Desserts
  {
    id: 10,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center and vanilla ice cream",
    price: 12.99,
    category: "desserts",
    image: "🍰",
  },
  // Beverages
  {
    id: 13,
    name: "Ocean Breeze",
    description: "Signature cocktail with blue curaçao and tropical fruits",
    price: 14.99,
    category: "beverages",
    image: "🍹",
  },
];

const categories = [
  { id: "all", name: "All Items", icon: "🍽️" },
  { id: "appetizers", name: "Appetizers", icon: "🍤" },
  { id: "mains", name: "Main Courses", icon: "🐟" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "beverages", name: "Beverages", icon: "🍹" },
];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { cartItems, addToCart } = useCart(); // Use global cart context

  // Filter menu items based on selected category
  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  // Get cart count from global context
  const getCartCount = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Add item by finding menu item and passing full item info
  const handleAddToCart = (itemId: number) => {
    const item = menuItems.find((i) => i.id === itemId);
    if (item) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="ocean-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4 font-serif">Our Menu</h1>
          <p className="text-xl opacity-90">
            Fresh from the ocean to your table
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
                selectedCategory === category.id
                  ? "bg-ocean-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-ocean-50 shadow-md"
              }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Cart Summary */}
        {getCartCount() > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Link
              href="/cart"
              className="bg-ocean-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-ocean-700 transition-all flex items-center space-x-2"
            >
              <span>🛒</span>
              <span className="font-medium">{getCartCount()} items</span>
            </Link>
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="card overflow-hidden hover:shadow-xl transition-all"
            >
              {item.popular && (
                <div className="bg-ocean-600 text-white px-3 py-1 text-sm font-medium inline-block">
                  ⭐ Popular
                </div>
              )}

              <div className="h-48 bg-gradient-to-br from-ocean-100 to-primary-100 flex items-center justify-center">
                <span className="text-6xl">{item.image}</span>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.name}
                  </h3>
                  <span className="text-2xl font-bold text-ocean-600">
                    ${item.price}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="btn btn-primary flex-1 mr-3"
                  >
                    Add to Cart
                  </button>

                  {cartItems.find((ci) => ci.id === item.id) && (
                    <div className="bg-ocean-100 text-ocean-800 px-3 py-2 rounded-lg font-medium">
                      {cartItems.find((ci) => ci.id === item.id)?.quantity} in
                      cart
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
              Ready to Order?
            </h2>
            <p className="text-gray-600 mb-6">
              Make a reservation to enjoy our fresh seafood in our beautiful
              oceanfront setting
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/reservations"
                className="btn btn-primary text-lg px-8 py-4"
              >
                Make Reservation
              </Link>
              <Link
                href="/cart"
                className="btn btn-secondary text-lg px-8 py-4"
              >
                View Cart ({getCartCount()})
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
