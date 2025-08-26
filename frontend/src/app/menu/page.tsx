"use client";

import { useState, useEffect } from "react";
import { menuAPI } from "@/lib/api";

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
  is_available: boolean;
  is_featured?: boolean;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterMenuItems();
  }, [selectedCategory, menuItems]);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const res = await menuAPI.getAll();
      const items: MenuItem[] = res.data;

      setMenuItems(items);

      // Extract unique categories plus 'All'
      const uniqueCategories = Array.from(
        new Set(items.map((item) => item.category || "Uncategorized"))
      );
      setCategories(["All", ...uniqueCategories]);

      setError("");
    } catch (err) {
      setError("Failed to load menu items.");
    } finally {
      setLoading(false);
    }
  };

  const filterMenuItems = () => {
    if (selectedCategory === "All") {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(
        menuItems.filter(
          (item) => (item.category || "Uncategorized") === selectedCategory
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Menu</h1>

      {/* Category Filter */}
      <div className="flex space-x-3 overflow-x-auto mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full border transition ${
              selectedCategory === category
                ? "bg-ocean-600 text-white border-ocean-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-ocean-100"
            } whitespace-nowrap`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

// MenuItemCard Component
function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold">{item.name}</h2>
        <p className="text-gray-600 flex-grow mt-2">
          {item.description || "No description."}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
          {item.is_available ? (
            <span className="text-green-600 font-medium">Available</span>
          ) : (
            <span className="text-red-600 font-medium">Unavailable</span>
          )}
        </div>

        <button
          disabled={!item.is_available}
          className={`mt-4 w-full py-2 rounded ${
            item.is_available
              ? "bg-ocean-600 text-white hover:bg-ocean-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } transition`}
          onClick={() =>
            alert(`Add "${item.name}" to cart (functionality coming soon)`)
          }
          aria-disabled={!item.is_available}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
