import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  Users,
  Clock,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

// Carousel images for the hero section & text shown
const carouselImages = [
  {
    src: "/images/slider_img_1.png",
    title: "Fresh and Tasty",
    subtitle: "",
  },
  {
    src: "/images/slider_img_2.png",
    title: "Authentic flavors",
    subtitle: " ",
  },
  {
    src: "/images/slider_img_3.png",
    title: "A Perfect Choice",
    subtitle: "",
  },
];

const features = [
  {
    icon: <Star className="h-8 w-8 text-amber-400" />,
    title: "Premium Quality",
    description:
      "Fresh ingredients and authentic recipes crafted by expert chefs",
  },
  {
    icon: <Users className="h-8 w-8 text-emerald-400" />,
    title: "Family Friendly",
    description:
      "Perfect atmosphere for intimate dinners and family gatherings",
  },
  {
    icon: <Clock className="h-8 w-8 text-cyan-400" />,
    title: "Fast Service",
    description:
      "Quick and efficient dining experience without compromising quality",
  },
];

const products = [
  {
    id: 1,
    name: "Seaside Grilled Salmon",
    price: 34.99,
    image: "/images/slider_img_2.png",
    description:
      "Perfectly grilled salmon with ocean spices and seasonal vegetables.",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Mediterranean Pasta",
    price: 26.99,
    image: "/images/slider_img_1.png",
    description:
      "Classic pasta tossed with fresh veggies, herbs and premium olive oil.",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Tropical Shrimp Skewers",
    price: 29.99,
    image: "/images/slider_img_3.png",
    description:
      "Juicy shrimp skewers marinated in tropical fruits and exotic spices.",
    rating: 4.7,
  },
];

// Carousel Component
const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1
    );
  };

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
      {/* Carousel Images */}
      <div className="relative w-full h-full">
        {carouselImages.map((image, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 w-full h-full ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1 : 1.1,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <img
              src={image.src}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Text overlay */}
            <div className="absolute bottom-8 left-8 text-white">
              <motion.h3
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl md:text-4xl font-bold mb-2"
              >
                {image.title}
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg md:text-xl text-gray-200"
              >
                {image.subtitle}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { isDark } = useTheme();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-900"
      }`}
    >
      {/* Hero Section with Carousel */}
      <section className="relative flex flex-col lg:flex-row items-center justify-center px-8 py-16 md:py-24 max-w-7xl mx-auto gap-12">
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm font-semibold rounded-full mb-4">
              ✨ Premium Dining Experience
            </span>
            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r ${
                isDark
                  ? "from-white via-gray-100 to-gray-300"
                  : "from-gray-900 via-gray-700 to-gray-600"
              } bg-clip-text text-transparent`}
            >
              {t("welcome")} to Oasis Tides
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`text-lg md:text-2xl mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Experience authentic dining with fresh seafood and exquisite cuisine
            in a beautiful oceanside setting where every meal becomes a memory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link to="/menu">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-600 hover:to-orange-600 shadow-xl transition-all duration-300 font-semibold px-8 py-4"
                >
                  Explore {t("menu")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/contact">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className={`border-2 shadow-xl transition-all duration-300 font-semibold px-8 py-4 ${
                    isDark
                      ? "border-gray-400 text-white hover:bg-white hover:text-black"
                      : "border-gray-600 text-gray-900 hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  Reserve Table
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Carousel */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <ImageCarousel />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`py-20 transition-colors duration-300 ${
          isDark
            ? "bg-gradient-to-r from-gray-800 to-gray-900"
            : "bg-gradient-to-r from-gray-100 to-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-sm font-semibold rounded-full mb-4">
                Why Choose Us
              </span>
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r ${
                  isDark
                    ? "from-white to-gray-300"
                    : "from-gray-900 to-gray-600"
                } bg-clip-text text-transparent`}
              >
                The Oasis Tides Difference
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                We pride ourselves on delivering exceptional dining experiences
                with attention to every detail, creating moments that last a
                lifetime.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                }}
                className={`text-center p-8 rounded-2xl shadow-2xl border transition-all duration-300 ${
                  isDark
                    ? "bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 hover:border-gray-500"
                    : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`flex justify-center mb-6 p-4 rounded-full w-20 h-20 mx-auto items-center ${
                    isDark ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-lg leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        className={`py-20 transition-colors duration-300 ${
          isDark
            ? "bg-gradient-to-br from-black via-gray-900 to-gray-800"
            : "bg-gradient-to-br from-white via-gray-50 to-blue-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-sm font-semibold rounded-full mb-4">
                Signature Dishes
              </span>
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r ${
                  isDark
                    ? "from-white to-gray-300"
                    : "from-gray-900 to-gray-600"
                } bg-clip-text text-transparent`}
              >
                Chef's Recommendations
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Discover our most loved dishes crafted with passion, expertise,
                and the finest ingredients from around the world.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                }}
                className={`rounded-2xl shadow-2xl overflow-hidden border transition-all duration-300 ${
                  isDark
                    ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600"
                    : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover h-full w-full transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">
                      {product.rating}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3
                    className={`text-2xl font-bold mb-3 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {product.name}
                  </h3>
                  <p
                    className={`mb-6 leading-relaxed ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                      ${product.price}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-600 hover:to-orange-600 font-semibold transition-all duration-300"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {t("addToCart")}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/menu">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-600 hover:to-orange-600 shadow-xl transition-all duration-300 font-semibold px-8 py-4"
                >
                  Explore {t("menu")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 bg-black/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-4">
              Book Your Table Now
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Experience Fine Dining at Oasis Tides
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8">
              Join us for an unforgettable culinary journey. Reserve your table
              today and let us create a memorable experience for you and your
              loved ones.
            </p>
            <Link to="/reservations">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 font-semibold px-8 py-4 shadow-xl"
                >
                  Make a Reservation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
