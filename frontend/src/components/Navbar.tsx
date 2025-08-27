"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CartCount from "@/components/CartCount";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();

  // Calculate total items in cart
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌊</span>
              <div>
                <span className="text-xl font-bold text-ocean-600 font-serif">
                  Oasis Tides
                </span>
                <div className="text-xs text-gray-500">
                  Fine Dining Restaurant
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-ocean-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-ocean-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/menu"
              className="text-gray-700 hover:text-ocean-600 transition-colors"
            >
              Menu
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-ocean-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-600 hover:text-ocean-600 transition-colors">
              🔍
            </button>

            {/* Cart with item count */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-ocean-600 transition-colors"
            >
              🛒
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-ocean-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-ocean-600 transition-colors"
                >
                  <span className="text-lg">👤</span>
                  <span className="hidden sm:block">{user?.name}</span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center space-x-1 text-gray-700 hover:text-ocean-600 transition-colors"
              >
                <span className="text-lg">👤</span>
                <span className="hidden sm:block">Login</span>
              </Link>
            )}

            {/* Reservation Button */}
            <Link
              href="/reservations"
              className="btn btn-primary hidden sm:inline-block px-4 py-2 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              Reservation
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-ocean-600"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-50 border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-ocean-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-ocean-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/menu"
                className="block px-3 py-2 text-gray-700 hover:text-ocean-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-ocean-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/reservations"
                className="block px-3 py-2 mt-1 bg-ocean-600 text-white rounded text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Reservation
              </Link>
              <Link
                href="/cart"
                className="block px-3 py-2 mt-1 relative text-gray-700 hover:text-ocean-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 right-4 bg-ocean-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {totalQuantity}
                    
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
