import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ocean-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-ocean-500 to-primary-500 rounded-full flex items-center justify-center">
                <span
                  className="text-white font-bold"
                  aria-label="Ocean wave emoji"
                >
                  🌊
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Oasis Tides</h3>
                <p className="text-xs text-ocean-300">Fine Dining Restaurant</p>
              </div>
            </div>
            <p className="text-ocean-300 mb-4">
              Experience the finest dining with fresh seafood, ocean views, and
              exceptional service at Oasis Tides Restaurant.
            </p>
            <div className="flex space-x-4" aria-label="Social media links">
              <a
                href="#"
                className="text-ocean-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                📘
              </a>
              <a
                href="#"
                className="text-ocean-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                🐦
              </a>
              <a
                href="#"
                className="text-ocean-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href="#"
                className="text-ocean-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                💼
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick Links">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-ocean-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-ocean-300 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="text-ocean-300 hover:text-white transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/chefs"
                  className="text-ocean-300 hover:text-white transition-colors"
                >
                  Our Chefs
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-ocean-300 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-ocean-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services">
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/reservations"
                  className="text-ocean-300 hover:text-white transition-colors"
                >
                  Table Reservations
                </Link>
              </li>
              <li>
                <Link
                  href="/catering"
                  className="text-ocean-300 hover:text-white transition-colors"
                >
                  Catering
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-ocean-300 hover:text-white transition-colors"
                >
                  Private Events
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery"
                  className="text-ocean-300 hover:text-white transition-colors"
                >
                  Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="/takeaway"
                  className="text-ocean-300 hover:text-white transition-colors"
                >
                  Takeaway
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact Info */}
          <address className="not-italic" aria-label="Contact Information">
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-ocean-300">
              <div className="flex items-start space-x-3">
                <span aria-hidden="true" className="text-ocean-400">
                  📍
                </span>
                <div>
                  <p>123 Ocean Drive</p>
                  <p>Seaside City, SC 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span aria-hidden="true" className="text-ocean-400">
                  📞
                </span>
                <a
                  href="tel:+1234567890"
                  className="hover:text-white transition-colors"
                >
                  +1 (234) 567-8900
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span aria-hidden="true" className="text-ocean-400">
                  📧
                </span>
                <a
                  href="mailto:info@oasistides.com"
                  className="hover:text-white transition-colors"
                >
                  info@oasistides.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span aria-hidden="true" className="text-ocean-400">
                  🕒
                </span>
                <div>
                  <p>Mon-Sun: 11:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </address>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ocean-800 mt-8 pt-8 text-center">
          <p className="text-ocean-300 text-sm">
            © 2024 Oasis Tides Restaurant. All rights reserved. | 
            <Link
              href="/privacy"
              className="hover:text-white transition-colors ml-1"
            >
              Privacy Policy
            </Link>{" "}
            | 
            <Link
              href="/terms"
              className="hover:text-white transition-colors ml-1"
            >
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
