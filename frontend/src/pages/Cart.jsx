import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";

const Cart = () => {
  const { items: cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { t, language } = useLanguage();
  const { isDark } = useTheme();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`py-12 shadow-lg ${
          isDark
            ? "bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800"
            : "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            className="text-5xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent mb-4"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            {t("yourCart")}
          </motion.h1>
          <motion.p
            className={`text-lg md:text-xl max-w-3xl mx-auto opacity-90 ${
              isDark ? "text-purple-200" : "text-purple-100"
            }`}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            {t("cartSubtitle")}
          </motion.p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {cart.length === 0 ? (
          <motion.div
            className={`text-center py-20 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
          >
            <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-gray-400" />
            <h2 className="text-3xl font-bold mb-4">{t("cartEmpty")}</h2>
            {/* <p className="text-lg mb-8">{t("cartEmptyMessage")}</p> */}{" "}
            <Link to="/menu">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 font-semibold px-8 py-4 shadow-lg"
              >
                {t("browseMenu")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <motion.div
              className={`lg:col-span-2 rounded-3xl shadow-2xl p-8 ${
                isDark
                  ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
                  : "bg-white border border-gray-200"
              }`}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <h2
                className={`text-3xl font-extrabold mb-8 pb-4 border-b ${
                  isDark
                    ? "text-white border-gray-700"
                    : "text-gray-900 border-gray-200"
                }`}
              >
                {t("yourItems")}
              </h2>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    className={`flex items-center justify-between py-4 border-b last:border-b-0 ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                    variants={itemVariants}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={language === "ar" ? item.nameAr : item.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                      />
                      <div>
                        <h3
                          className={`text-lg font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {language === "ar" ? item.nameAr : item.name}
                        </h3>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center border rounded-lg ${
                          isDark ? "border-gray-700" : "border-gray-300"
                        }`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                          className={`p-2 ${
                            isDark ? "text-white" : "text-gray-700"
                          }`}
                        >
                          -
                        </Button>
                        <span
                          className={`px-3 ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className={`p-2 ${
                            isDark ? "text-white" : "text-gray-700"
                          }`}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div
                className="mt-8 flex justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className={`border-red-500 text-red-500 hover:bg-red-500 hover:text-white ${
                    isDark ? "border-red-400 text-red-400" : ""
                  }`}
                >
                  {t("clearCart")}
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className={`rounded-3xl shadow-2xl p-8 h-fit ${
                isDark
                  ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
                  : "bg-white border border-gray-200"
              }`}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <h2
                className={`text-3xl font-extrabold mb-8 pb-4 border-b ${
                  isDark
                    ? "text-white border-gray-700"
                    : "text-gray-900 border-gray-200"
                }`}
              >
                {t("orderSummary")}
              </h2>
              <div
                className={`flex justify-between items-center text-xl font-semibold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <span>{t("total")}:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700 font-semibold px-8 py-4 shadow-lg"
                >
                  {t("proceedToCheckout")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
