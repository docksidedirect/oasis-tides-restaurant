"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-ocean-900 text-white py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <a
              href="mailto:info@oasistides.com"
              className="hover:text-ocean-300 transition-colors"
            >
              📧 info@oasistides.com
            </a>
            <a
              href="tel:+1234567890"
              className="hover:text-ocean-300 transition-colors"
            >
              📞 +1 (234) 567-8900
            </a>
          </div>
          <div className="flex space-x-4" aria-label="Social media links">
            <a
              href="#"
              className="hover:text-ocean-300 transition-colors"
              aria-label="Facebook"
            >
              📘
            </a>
            <a
              href="#"
              className="hover:text-ocean-300 transition-colors"
              aria-label="Twitter"
            >
              🐦
            </a>
            <a
              href="#"
              className="hover:text-ocean-300 transition-colors"
              aria-label="Instagram"
            >
              📷
            </a>
            <a
              href="#"
              className="hover:text-ocean-300 transition-colors"
              aria-label="LinkedIn"
            >
              💼
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-ocean-500 to-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌊</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-ocean-900">
                  Oasis Tides
                </h1>
                <p className="text-xs text-gray-600">Fine Dining Restaurant</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {["/", "/about", "/menu", "/chefs", "/blog", "/contact"].map(
                (href, idx) => {
                  const label =
                    href === "/"
                      ? "Home"
                      : href
                          .slice(1)
                          .replace(/-/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase());
                  return (
                    <Link
                      key={idx}
                      href={href}
                      className="text-gray-700 hover:text-ocean-600 font-medium transition-colors"
                    >
                      {label}
                    </Link>
                  );
                }
              )}
            </div>

            {/* Right Side Icons */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                aria-label="Search"
                className="text-gray-700 hover:text-ocean-600 transition-colors"
              >
                🔍
              </button>
              <button
                aria-label="Cart"
                className="relative text-gray-700 hover:text-ocean-600 transition-colors"
              >
                🛒
                <span className="absolute -top-2 -right-2 bg-ocean-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-ocean-600 transition-colors"
                aria-label="User Dashboard"
              >
                👤
              </Link>
              <button className="bg-ocean-600 text-white px-6 py-2 rounded-full hover:bg-ocean-700 transition-colors font-medium">
                Reservation
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
              className="lg:hidden text-gray-700 hover:text-ocean-600 transition-colors"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                {["/", "/about", "/menu", "/chefs", "/blog", "/contact"].map(
                  (href, idx) => {
                    const label =
                      href === "/"
                        ? "Home"
                        : href
                            .slice(1)
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase());
                    return (
                      <Link
                        key={idx}
                        href={href}
                        className="text-gray-700 hover:text-ocean-600 font-medium transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {label}
                      </Link>
                    );
                  }
                )}

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    aria-label="Search"
                    className="text-gray-700 hover:text-ocean-600 transition-colors"
                  >
                    🔍
                  </button>
                  <button
                    aria-label="Cart"
                    className="relative text-gray-700 hover:text-ocean-600 transition-colors"
                  >
                    🛒
                    <span className="absolute -top-2 -right-2 bg-ocean-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      0
                    </span>
                  </button>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-ocean-600 transition-colors"
                    aria-label="User Dashboard"
                    onClick={() => setIsOpen(false)}
                  >
                    👤
                  </Link>
                </div>
                <button className="bg-ocean-600 text-white px-6 py-2 rounded-full hover:bg-ocean-700 transition-colors font-medium w-fit">
                  Reservation
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
