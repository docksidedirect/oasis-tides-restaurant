"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { menuAPI } from "@/lib/api";
import type { MenuItem } from "@/lib/api";

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardHover = {
    scale: 1.05,
    boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
  };
  const cardTransition = {
    type: "spring",
    stiffness: 300,
  };

  useEffect(() => {
    console.log("useEffect: fetching menu...");

    menuAPI
      .getAll()
      .then((response) => {
        setMenuItems(response.data.menu_items || []);
      })
      .catch((err) => {
        console.error("Error fetching menu:", err);
        setError(err.message ?? "Failed to fetch menu");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center ocean-gradient text-white">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif">
            Welcome to Oasis Tides
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Where Culinary Excellence Meets Ocean Serenity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="btn btn-primary text-lg px-8 py-4 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              Explore Menu
            </Link>
            <Link
              href="/reservations"
              className="btn btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-ocean-600 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              Make Reservation
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
              Experience the Ocean Finest
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our commitment to exceptional dining, fresh ingredients,
              and unforgettable experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: "🌊",
                title: "Fresh Ocean Cuisine",
                text: "Daily catch from local fishermen, prepared with passion and expertise",
              },
              {
                emoji: "👨‍🍳",
                title: "Master Chefs",
                text: "Award-winning culinary team creating innovative dishes with traditional techniques",
              },
              {
                emoji: "🏖️",
                title: "Oceanfront Dining",
                text: "Breathtaking views and serene atmosphere for the perfect dining experience",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card p-8 text-center rounded-lg bg-white shadow-md cursor-pointer"
                whileHover={cardHover}
                transition={cardTransition}
              >
                <div className="text-5xl mb-4">{feature.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Dishes - fetched from API */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
              Signature Dishes
            </h2>
            <p className="text-xl text-gray-600">
              Taste the ocean bounty in every bite
            </p>
          </div>

          {loading ? (
            <p className="text-center">Loading dishes...</p>
          ) : error ? (
            <p className="text-center text-red-600">Error: {error}</p>
          ) : menuItems.length === 0 ? (
            <p className="text-center">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="card overflow-hidden rounded-lg shadow-md cursor-pointer flex flex-col"
                  whileHover={cardHover}
                  transition={cardTransition}
                >
                  {item.image_url ? (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={`${
                          process.env.NEXT_PUBLIC_API_URL?.replace(
                            "/api",
                            ""
                          ) || "http://localhost:8001"
                        }${item.image_url}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                      <span className="text-6xl text-gray-400">🍽️</span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.name}
                      </h3>
                      <span className="text-2xl font-bold text-ocean-600">
                        ${parseFloat(item.price).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {item.description}
                    </p>
                    <button className="btn btn-primary w-full mt-auto transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 ocean-gradient text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
            Ready for an Unforgettable Experience?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your table today and dive into the finest ocean cuisine
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservations"
              className="btn bg-white text-ocean-600 hover:bg-gray-100 text-lg px-8 py-4 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              Reserve Now
            </Link>
            <Link
              href="/menu"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-ocean-600 text-lg px-8 py-4 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
