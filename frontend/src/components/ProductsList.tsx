"use client";

import { useEffect, useState } from "react";
import { menuAPI } from "@/lib/api";
import type { MenuItem } from "@/lib/api";

export default function ProductsList() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    menuAPI
      .getAll()
      .then((response) => {
        setMenuItems(response.data.menu_items || []);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch menu");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!menuItems.length) return <p>No products found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {menuItems.map((item) => (
        <div key={item.id} className="border rounded shadow p-4 flex flex-col">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-4">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
          <p className="text-gray-700 flex-grow">
            {item.description || "No description."}
          </p>
          <p className="mt-4 font-bold text-lg">
            ${parseFloat(item.price).toFixed(2)}
          </p>
          {/* Add more details here if your MenuItem has them */}
        </div>
      ))}
    </div>
  );
}
