import { useLanguage } from "../contexts/LanguageContext";
import {
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Restaurant Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="ml-2 text-xl font-bold">Oasis Tides</span>
            </div>
            <p className="text-gray-300 mb-4">
              Experience authentic dining with fresh seafood and exquisite
              cuisine in a beautiful oceanside setting.
            </p>
            <p className="text-gray-300 mb-4">
              The Source Code is for Sale and if any amendments are required can
              do!
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("contact")}</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-300">
                  15 Ahmed Abu Giz, Ashmoun, Menofia, Egypt
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-300">+2 0100 1945390</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-300">
                  ahsmartsolutions@gmail.com
                </span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span>Monday - Thursday</span>
                <span>11:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Friday - Saturday</span>
                <span>11:00 AM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>12:00 PM - 9:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">{t("footerText")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
