import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Calendar, Send } from "lucide-react";

// Import your image (ensure menu.jpg is in public/images/)
const contactBanner = "/images/counter_bg.jpg";

const Contact = () => {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    reservationDate: "",
    reservationTime: "",
    partySize: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (Math.random() > 0.1) {
      // 90% success rate
      toast.success(t("messageSentSuccessfully"));
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        reservationDate: "",
        reservationTime: "",
        partySize: "",
      });
    } else {
      toast.error(t("messageSendingFailed"));
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pb-16">
      {/* Menu Banner (matches About styling) */}
      <section
        className="relative flex flex-col items-center justify-center py-10 md:py-14 mb-10"
        style={{
          backgroundImage: `url('${contactBanner}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          //borderRadius: "18px",
          overflow: "hidden",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 w-full text-center flex flex-col items-center">
          <h1
            className="text-white text-4xl md:text-5xl font-extrabold mb-2"
            style={{ textShadow: "0 2px 24px #222" }}
          >
            Contact
          </h1>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div
            className={`rounded-3xl shadow-2xl p-8 ${
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
              {t("visitUs")}
            </h2>
            <div className="space-y-6">
              <motion.div className="flex items-start" variants={itemVariants}>
                <MapPin className="h-6 w-6 text-blue-500 mt-1 mr-4" />
                <div>
                  <h3
                    className={`font-semibold mb-1 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("address")}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    123 Ocean Drive
                    <br />
                    Seaside City, SC 29401
                    <br />
                    United States
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex items-start" variants={itemVariants}>
                <Phone className="h-6 w-6 text-blue-500 mt-1 mr-4" />
                <div>
                  <h3
                    className={`font-semibold mb-1 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("phone")}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    +1 (555) 123-4567
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex items-start" variants={itemVariants}>
                <Mail className="h-6 w-6 text-blue-500 mt-1 mr-4" />
                <div>
                  <h3
                    className={`font-semibold mb-1 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("email")}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    info@oasistides.com
                  </p>
                </div>
              </motion.div>

              <motion.div className="flex items-start" variants={itemVariants}>
                <Clock className="h-6 w-6 text-blue-500 mt-1 mr-4" />
                <div>
                  <h3
                    className={`font-semibold mb-1 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("hours")}
                  </h3>
                  <div
                    className={`text-sm space-y-1 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <p>{t("mondayThursday")}</p>
                    <p>{t("fridaySaturday")}</p>
                    <p>{t("sunday")}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className={`mt-8 p-6 rounded-xl shadow-md ${
                isDark
                  ? "bg-gradient-to-br from-blue-900 to-cyan-900 border border-blue-800"
                  : "bg-blue-50 border border-blue-200"
              }`}
              variants={fadeInVariants}
            >
              <div className="flex items-center mb-3">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <h3
                  className={`font-semibold ${
                    isDark ? "text-blue-200" : "text-blue-900"
                  }`}
                >
                  {t("needATable")}
                </h3>
              </div>
              <p
                className={`mb-4 ${isDark ? "text-blue-100" : "text-blue-800"}`}
              >
                {t("bookTableMessage")}
              </p>
              <Button
                onClick={() => navigate("/reservations")}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 font-semibold px-8 py-4 shadow-lg"
              >
                {t("makeAReservation")}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className={`rounded-3xl shadow-2xl p-8 ${
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
              {t("sendMessage")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <Label
                  htmlFor="name"
                  className={`mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("fullName")}
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 p-3 rounded-lg w-full ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Label
                  htmlFor="email"
                  className={`mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("email")}
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 p-3 rounded-lg w-full ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Label
                  htmlFor="phone"
                  className={`mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("phone")}
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 p-3 rounded-lg w-full ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Label
                  htmlFor="message"
                  className={`mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t("message")}
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className={`mt-1 p-3 rounded-lg w-full min-h-[120px] ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  placeholder={t("messagePlaceholder")}
                />
              </motion.div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 font-semibold px-8 py-4 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? t("sending") : t("sendMessage")}
                <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
