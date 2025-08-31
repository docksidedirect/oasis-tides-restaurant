import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Shield,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Crown,
  Users,
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDemo, setSelectedDemo] = useState(null);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Demo credentials for testing
  const demoCredentials = [
    {
      role: "Admin",
      email: "admin@oasistides.com",
      password: "password",
      icon: Crown,
      color: "from-purple-500 to-indigo-500",
      description: "Full system access",
    },
    {
      role: "Staff",
      email: "staff@oasistides.com",
      password: "password",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      description: "Kitchen & service management",
    },
    {
      role: "Client",
      email: "client@oasistides.com",
      password: "password",
      icon: UserCheck,
      color: "from-emerald-500 to-teal-500",
      description: "Customer dashboard",
    },
  ];

  const fillDemoCredentials = (email, password, index) => {
    setFormData({ email, password });
    setSelectedDemo(index);
    setTimeout(() => setSelectedDemo(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding & Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mb-8 shadow-2xl"
            >
              <Sparkles className="h-10 w-10 text-black" />
            </motion.div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Welcome Back to
              <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Oasis Tides
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Experience premium dining with our sophisticated restaurant
              management system. Sign in to access your personalized dashboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: Shield,
                  title: "Secure Access",
                  desc: "Protected login system",
                },
                {
                  icon: Star,
                  title: "Premium Experience",
                  desc: "Luxury dining management",
                },
                {
                  icon: CheckCircle,
                  title: "Real-time Updates",
                  desc: "Live order tracking",
                },
                {
                  icon: User,
                  title: "Personal Dashboard",
                  desc: "Customized interface",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700"
                >
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                    <feature.icon className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl mb-4 shadow-xl">
                <Sparkles className="h-8 w-8 text-black" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Welcome Back
              </h2>
            </div>

            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" />
                Demo Accounts
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {demoCredentials.map((cred, index) => {
                  const IconComponent = cred.icon;
                  return (
                    <motion.button
                      key={index}
                      onClick={() =>
                        fillDemoCredentials(cred.email, cred.password, index)
                      }
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedDemo === index
                          ? "border-amber-400 bg-amber-500/20"
                          : "border-gray-600 hover:border-gray-500 bg-gray-700/30 hover:bg-gray-700/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-r ${cred.color}`}
                        >
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">
                              {cred.role}
                            </span>
                            <Badge className="bg-gray-600 text-gray-200 text-xs">
                              Demo
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            {cred.description}
                          </p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedDemo === index && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute top-2 right-2"
                          >
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl flex items-center"
                  >
                    <div className="p-1 bg-red-500/20 rounded-full mr-3">
                      <Shield className="h-4 w-4 text-red-400" />
                    </div>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-600 hover:to-orange-600 font-semibold py-3 shadow-xl transition-all duration-300"
                size="lg"
                as={motion.button}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Sign In Securely
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Mobile Register Link */}
            <div className="lg:hidden mt-8 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>

            {/* Security Badge */}
            <div className="mt-8 flex items-center justify-center text-xs text-gray-500">
              <Shield className="h-4 w-4 mr-1" />
              <span>Secured with SSL encryption</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
