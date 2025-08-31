import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useCart } from "../contexts/CartContext";
import { menuAPI } from "../lib/api";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Star, Plus, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Menu = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addToCart, getCartCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    data: menuItems,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["menuItems"],
    queryFn: async () => {
      const response = await menuAPI.getMenuItems();
      return response.data.menu_items;
    },
  });

  // Category values must match backend exactly
  const categories = [
    { id: "all", name: "All Items", nameAr: "جميع الأصناف" },
    { id: "appetizer", name: "Appetizers", nameAr: "المقبلات" },
    { id: "main_course", name: "Main Courses", nameAr: "الأطباق الرئيسية" },
    { id: "dessert", name: "Desserts", nameAr: "الحلويات" },
    { id: "beverage", name: "Beverages", nameAr: "المشروبات" },
  ];

  const filteredItems =
    menuItems?.filter(
      (item) => selectedCategory === "all" || item.category === selectedCategory
    ) || [];

  const handleAddToCart = (item) => {
    addToCart({ ...item, price: parseFloat(item.price) });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-500"></div>
        <span className="ml-4 text-lg font-medium">{t("loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-extrabold text-amber-400 mb-4">
            {t("error")}
          </h2>
          <p className="text-gray-300">
            Failed to load menu items. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pb-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent mb-4"
          >
            {t("menuTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl max-w-3xl mx-auto text-amber-100 opacity-90"
          >
            Discover our carefully crafted dishes made with the freshest
            ingredients and authentic flavors
          </motion.p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{
                y: -3,
                boxShadow: "0 4px 15px rgba(251,191,36,0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full"
            >
              <Button
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 font-semibold transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-amber-400 to-orange-400 text-black shadow-lg"
                    : "border-amber-400 border hover:bg-amber-500/30 hover:text-amber-100"
                }`}
              >
                {category.name}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Cart Summary */}
        <AnimatePresence>
          {getCartCount() > 0 && (
            <motion.div
              key="cart-summary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => navigate("/cart")}
                  className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-full shadow-xl flex items-center space-x-2 font-semibold"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart: {getCartCount()} items</span>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Items Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 30px rgba(251,191,36,0.2)",
                }}
                className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="h-52 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center relative overflow-hidden">
                  {item.image ? (
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      src={
                        item.image.startsWith("http")
                          ? item.image
                          : item.image.startsWith("/storage")
                          ? `http://localhost:8001${item.image}`
                          : `http://localhost:8001/storage/menu_images/${item.image}`
                      }
                      alt={item.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-5xl select-none">🍽️</span>
                  )}

                  {/* Popular badge */}
                  {item.popular && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <Badge className="absolute top-3 left-3 bg-yellow-400 text-black flex items-center gap-1 px-3 py-1 rounded-full shadow-md font-semibold text-sm">
                        <Star className="h-4 w-4" />
                        Popular
                      </Badge>
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-extrabold text-amber-400 mb-1"
                  >
                    {item.name}
                  </motion.h3>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-1"
                  >
                    ${item.price}
                  </motion.span>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-amber-200 mb-4"
                  >
                    {item.description}
                  </motion.p>

                  {/* Category Badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-2"
                  >
                    <Badge
                      variant="secondary"
                      className="capitalize text-amber-300 bg-amber-900/30 border-amber-700"
                    >
                      {item.category.replace("_", " ")}
                    </Badge>
                  </motion.div>

                  {/* Allergens */}
                  {item.allergens && JSON.parse(item.allergens).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mb-4"
                    >
                      <p className="text-sm text-amber-300 mb-1">Allergens:</p>
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(item.allergens).map((allergen, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs text-amber-300 border-amber-500"
                          >
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Add to Cart Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{
                      y: -2,
                      scale: 1.02,
                      boxShadow: "0 4px 15px rgba(251,191,36,0.15)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-auto"
                  >
                    <Button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.available}
                      className={`w-full flex items-center justify-center font-semibold transition-all ${
                        item.available
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:from-amber-500 hover:to-orange-600"
                          : "bg-gray-600 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      {item.available ? t("addToCart") : "Unavailable"}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-amber-300 text-xl select-none"
          >
            No items found in this category.
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Menu;
