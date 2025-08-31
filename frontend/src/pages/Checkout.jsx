import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { orderAPI } from "../lib/api";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  ShoppingBag,
  User,
  Truck,
  Store,
  UtensilsCrossed,
  Shield,
  Star,
  ArrowRight,
  Gift,
  Sparkles,
  Home,
  Phone,
  Mail,
  Calendar,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Checkout = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    orderType: "delivery",
    deliveryAddress: "",
    paymentMethod: "credit_card",
    notes: "",
    promoCode: "",
    customerInfo: {
      phone: "",
      email: user?.email || "",
    },
  });

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const deliveryFee =
    formData.orderType === "delivery" ? (subtotal > 50 ? 0 : 5.0) : 0;
  const promoDiscount = formData.promoCode === "WELCOME10" ? subtotal * 0.1 : 0;
  const total = subtotal + tax + deliveryFee - promoDiscount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("customerInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
        order_type: formData.orderType,
        delivery_address:
          formData.orderType === "delivery" ? formData.deliveryAddress : null,
        payment_method: formData.paymentMethod,
        notes: formData.notes,
        promo_code: formData.promoCode,
        customer_info: formData.customerInfo,
      };

      const response = await orderAPI.createOrder(orderData);
      if (response.data.success) {
        setOrderId(response.data.order_id);
        setOrderComplete(true);
        clearCart();
      } else {
        throw new Error(response.data.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Order Details", icon: UtensilsCrossed },
    { id: 2, title: "Delivery & Payment", icon: CreditCard },
    { id: 3, title: "Confirmation", icon: CheckCircle },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl"
        >
          <div className="bg-amber-500/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <User className="h-10 w-10 text-amber-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Please log in to continue
          </h2>
          <p className="mb-8 text-gray-300 leading-relaxed">
            You need to be logged in to place an order and enjoy our premium
            dining experience.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-600 hover:to-orange-600 font-semibold px-8 py-3 shadow-xl"
            size="lg"
            as={motion.button}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Log In to Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-md bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl"
        >
          <div className="bg-blue-500/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Your cart is empty
          </h2>
          <p className="mb-8 text-gray-300 leading-relaxed">
            Discover our delicious menu and add some amazing dishes to your
            cart.
          </p>
          <Button
            onClick={() => navigate("/menu")}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:from-emerald-600 hover:to-teal-600 font-semibold px-8 py-3 shadow-xl"
            size="lg"
            as={motion.button}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Browse Our Menu
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 p-12 rounded-2xl border border-gray-700 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="bg-green-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-8 flex items-center justify-center"
          >
            <CheckCircle className="h-12 w-12 text-green-400" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Order Confirmed!
          </h2>
          <p className="mb-4 text-xl text-gray-300">
            Thank you for choosing Oasis Tides!
          </p>
          <p className="mb-8 text-gray-400">
            Your delicious meal is being prepared with care.
          </p>

          <div className="bg-gray-700/50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <Calendar className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400 mb-1">Order ID</p>
                <p className="text-xl font-bold text-amber-400">#{orderId}</p>
              </div>
              <div className="text-center">
                <Award className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                <p className="text-xl font-bold text-green-400">
                  ${total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-gray-400 mb-1">Estimated Time</p>
              <p className="font-semibold text-white">30-45 mins</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <Truck className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-gray-400 mb-1">Status</p>
              <p className="font-semibold text-green-400">Confirmed</p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <Star className="h-6 w-6 text-amber-400 mx-auto mb-2" />
              <p className="text-gray-400 mb-1">Order Type</p>
              <p className="font-semibold text-white capitalize">
                {formData.orderType.replace("_", " ")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-600 hover:to-orange-600 font-semibold py-3 shadow-xl"
              size="lg"
              as={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Shield className="mr-2 h-5 w-5" />
              Track Your Order
            </Button>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/menu")}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold py-3"
                size="lg"
                as={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Order Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold py-3"
                size="lg"
                as={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pb-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-4">
              🔒 Secure Checkout
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Secure Checkout
            </h1>
            <p className="text-xl text-gray-300">
              Complete your order with confidence
            </p>
          </motion.div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= step.id
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 border-amber-500 text-black"
                      : "border-gray-600 text-gray-400"
                  }`}
                >
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="ml-3 hidden md:block">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id
                        ? "text-amber-400"
                        : "text-gray-400"
                    }`}
                  >
                    Step {step.id}
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      currentStep >= step.id ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 ml-8 ${
                      currentStep > step.id ? "bg-amber-500" : "bg-gray-600"
                    }`}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          {/* Checkout Form */}
          <section className="lg:col-span-2 space-y-8">
            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <User className="mr-3 h-6 w-6 text-blue-400" />
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="customerInfo.phone"
                      value={formData.customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Your phone number"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="customerInfo.email"
                      value={formData.customerInfo.email}
                      onChange={handleInputChange}
                      placeholder="Your email address"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Type */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Store className="mr-3 h-6 w-6 text-emerald-400" />
                How would you like your order?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    value: "dine_in",
                    label: "Dine In",
                    icon: UtensilsCrossed,
                    description: "Enjoy at our restaurant",
                    color: "from-purple-500 to-indigo-500",
                  },
                  {
                    value: "takeaway",
                    label: "Takeaway",
                    icon: ShoppingBag,
                    description: "Pick up when ready",
                    color: "from-emerald-500 to-teal-500",
                  },
                  {
                    value: "delivery",
                    label: "Delivery",
                    icon: Truck,
                    description: "Delivered to your door",
                    color: "from-amber-500 to-orange-500",
                  },
                ].map((type) => (
                  <motion.label
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col items-center p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                      formData.orderType === type.value
                        ? "border-amber-400 bg-gradient-to-br from-amber-500/20 to-orange-500/20"
                        : "border-gray-600 hover:border-gray-500 bg-gray-700/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value={type.value}
                      checked={formData.orderType === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div
                      className={`p-4 rounded-full bg-gradient-to-r ${type.color} mb-4`}
                    >
                      <type.icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-xl font-semibold text-white mb-2">
                      {type.label}
                    </span>
                    <span className="text-sm text-gray-400 text-center">
                      {type.description}
                    </span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Delivery Address */}
            <AnimatePresence>
              {formData.orderType === "delivery" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <MapPin className="mr-3 h-6 w-6 text-blue-400" />
                    Delivery Address
                  </h2>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    required={formData.orderType === "delivery"}
                    rows={4}
                    placeholder="Enter your complete delivery address with landmarks..."
                    className="w-full p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <CreditCard className="mr-3 h-6 w-6 text-cyan-400" />
                Payment Method
              </h2>
              <div className="space-y-4">
                {[
                  {
                    value: "credit_card",
                    label: "Credit/Debit Card",
                    icon: CreditCard,
                    description: "Visa, Mastercard, Amex",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    value: "cash",
                    label: "Cash on Delivery",
                    icon: Gift,
                    description: "Pay when you receive",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    value: "paypal",
                    label: "PayPal",
                    icon: Shield,
                    description: "Secure PayPal payment",
                    color: "from-indigo-500 to-purple-500",
                  },
                ].map((method) => (
                  <motion.label
                    key={method.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`flex items-center p-4 rounded-xl cursor-pointer border-2 transition-all duration-300 ${
                      formData.paymentMethod === method.value
                        ? "border-amber-400 bg-gradient-to-r from-amber-500/20 to-orange-500/20"
                        : "border-gray-600 hover:border-gray-500 bg-gray-700/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-r ${method.color} mr-4`}
                    >
                      <method.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-white">
                        {method.label}
                      </span>
                      <p className="text-sm text-gray-400">
                        {method.description}
                      </p>
                    </div>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Special Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Sparkles className="mr-3 h-6 w-6 text-amber-400" />
                Special Instructions
              </h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Any special requests, dietary requirements, or cooking preferences..."
                className="w-full p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
              />
            </motion.div>
          </section>

          {/* Order Summary */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-2xl shadow-2xl p-8 sticky top-20 text-black h-fit"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Star className="mr-3 h-6 w-6" />
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-black/20"
                >
                  <div>
                    <p className="font-semibold text-lg">{item.name}</p>
                    <p className="text-sm text-black/70">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="mb-6 p-4 bg-black/10 rounded-xl">
              <label className="block text-sm font-semibold mb-2">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-black placeholder-black/50 border border-black/20 focus:outline-none focus:ring-2 focus:ring-black/30"
                />
                <Button
                  type="button"
                  size="sm"
                  className="bg-black/20 hover:bg-black/30 text-black border-none"
                >
                  Apply
                </Button>
              </div>
              {formData.promoCode === "WELCOME10" && (
                <p className="text-sm text-green-800 mt-2 font-semibold">
                  ✓ 10% discount applied!
                </p>
              )}
            </div>

            <div className="border-t border-black/30 pt-6 space-y-3 text-lg font-semibold">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {formData.orderType === "delivery"
                    ? "Delivery Fee"
                    : "Service Fee"}
                </span>
                <span>
                  {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-800">
                  <span>Promo Discount</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-black/30 pt-3 text-2xl font-bold flex justify-between">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full bg-black text-amber-400 font-bold hover:bg-gray-900 transition-all duration-300 py-4 text-lg shadow-xl"
              size="lg"
              as={motion.button}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-400 border-t-transparent mr-3"></div>
                  Processing Order...
                </div>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Place Secure Order - ${total.toFixed(2)}
                </>
              )}
            </Button>

            <div className="mt-6 text-center text-black/70 flex items-center justify-center text-sm space-x-2">
              <Clock className="h-4 w-4" />
              <span>
                Estimated{" "}
                {formData.orderType === "delivery" ? "delivery" : "preparation"}
                : 30-45 minutes
              </span>
            </div>

            <div className="mt-4 flex items-center justify-center text-xs text-black/60">
              <Shield className="h-4 w-4 mr-1" />
              <span>Secure SSL encrypted checkout</span>
            </div>
          </motion.section>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
