import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Users, Award, Clock, Heart } from "lucide-react";

const About = () => {
  const { t, language } = useLanguage();
  const { isDark } = useTheme();

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const values = [
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Community First",
      titleAr: "المجتمع أولاً",
      description:
        "We believe in supporting our local fishing community and creating connections through food.",
      descriptionAr:
        "نؤمن بدعم مجتمع الصيد المحلي لدينا وإنشاء روابط من خلال الطعام.",
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: "Quality Excellence",
      titleAr: "التميز في الجودة",
      description:
        "Every dish is crafted with the finest ingredients and attention to detail.",
      descriptionAr:
        "يتم إعداد كل طبق بأجود المكونات واهتمام بالتفاصيل.",
    },
    {
      icon: <Clock className="h-8 w-8 text-green-500" />,
      title: "Fresh Daily",
      titleAr: "طازج يومياً",
      description:
        "Our menu changes based on the daily catch, ensuring maximum freshness.",
      descriptionAr:
        "تتغير قائمتنا بناءً على صيد اليوم، مما يضمن أقصى درجات النضارة.",
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Passion Driven",
      titleAr: "مدفوع بالشغف",
      description:
        "Our love for coastal cuisine drives everything we do.",
      descriptionAr:
        "حبنا للمأكولات الساحلية يدفع كل ما نقوم به.",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Hero Section */}
      <section
        className={`relative py-20 ${
          isDark
            ? "bg-gradient-to-r from-blue-800 to-teal-800 text-white"
            : "bg-gradient-to-r from-blue-600 to-teal-600 text-white"
        }`}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              {t("aboutUs")}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl max-w-3xl mx-auto"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              {t("ourStory")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section
        className={`py-16 ${
          isDark ? "bg-gray-900" : "bg-white"
        } transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInVariants}>
              <h2
                className={`text-3xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("ourStory")}
              </h2>
              <div
                className={`space-y-4 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <p>
                  {language === "ar"
                    ? "تأسست واحة المد والجزر في عام 2018 على يد الشيف مارينا رودريغيز وشريكها جيمس تشين، وبدأت كحلم لإنشاء مطعم يكرم حقًا هدايا المحيط. ما بدأ كمطعم ساحلي صغير نما ليصبح وجهة محبوبة لعشاق المأكولات البحرية."
                    : "Founded in 2018 by Chef Marina Rodriguez and her partner James Chen, Oasis Tides began as a dream to create a restaurant that truly honors the ocean's gifts. What started as a small coastal eatery has grown into a beloved destination for seafood enthusiasts."
                  }
                </p>
                <p>
                  {language === "ar"
                    ? "بدأت رحلتنا عندما قررت مارينا، بعد سنوات من العمل في المطاعم الحائزة على نجمة ميشلان في جميع أنحاء أوروبا، العودة إلى جذورها الساحلية. وقد تعاونت مع جيمس، وهو خبير في تذوق النبيذ ولديه شغف بالطعام المستدام، لإنشاء شيء مميز."
                    : "Our journey began when Marina, after years of working in Michelin-starred restaurants across Europe, decided to return to her coastal roots. She partnered with James, a sommelier with a passion for sustainable dining, to create something special."
                  }
                </p>
                <p>
                  {language === "ar"
                    ? "اليوم، تقف واحة المد والجزر كشهادة على رؤيتهما: مكان يلتقي فيه الطعام الاستثنائي بالمسؤولية البيئية، حيث تحكي كل وجبة قصة البحر، وحيث يصبح الضيوف جزءًا من عائلتنا الممتدة."
                    : "Today, Oasis Tides stands as a testament to their vision: a place where exceptional food meets environmental responsibility, where every meal tells the story of the sea, and where guests become part of our extended family."
                  }
                </p>
              </div>
            </motion.div>
            <motion.div
              className={`rounded-lg h-96 flex items-center justify-center ${
                isDark
                  ? "bg-gradient-to-br from-blue-900 to-teal-900"
                  : "bg-gradient-to-br from-blue-100 to-teal-100"
              }`}
              variants={fadeInVariants}
            >
              <span className="text-6xl">🏖️</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section
        className={`py-16 ${
          isDark ? "bg-gray-800" : "bg-white"
        } transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              className={`text-3xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              {t("ourValues")}
            </motion.h2>
            <motion.p
              className={`text-lg max-w-2xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              {language === "ar"
                ? "هذه المبادئ الأساسية توجه كل ما نقوم به، من مصادر المكونات إلى خدمة ضيوفنا."
                : "These core principles guide everything we do, from sourcing ingredients to serving our guests."
              }
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className={`text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                  isDark
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-900"
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="flex justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {value.icon}
                </motion.div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {language === "ar" ? value.titleAr : value.title}
                </h3>
                <p
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {language === "ar" ? value.descriptionAr : value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        className={`py-16 ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        } transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              className={`text-3xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              {t("ourTeam")}
            </motion.h2>
            <motion.p
              className={`text-lg ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              {language === "ar"
                ? "الأشخاص الشغوفون وراء واحة المد والجزر."
                : "The passionate people behind Oasis Tides."
              }
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`rounded-lg p-6 text-center shadow-md ${
                  isDark
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-900"
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <motion.div
                  className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    isDark
                      ? "bg-gradient-to-br from-blue-900 to-teal-900"
                      : "bg-gradient-to-br from-blue-100 to-teal-100"
                  }`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-2xl">👨‍🍳</span>
                </motion.div>
                <h3
                  className={`text-xl font-semibold mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {language === "ar" ? "الشيف جون دو" : "Chef John Doe"}
                </h3>
                <p
                  className={`font-medium mb-2 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {language === "ar" ? "رئيس الطهاة" : "Head Chef"}
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {language === "ar"
                    ? "مع أكثر من 20 عامًا من الخبرة، يجلب الشيف جون شغفًا بالمأكولات البحرية وتقنيات الطهي المبتكرة إلى واحة المد والجزر."
                    : "With over 20 years of experience, Chef John brings a passion for seafood and innovative culinary techniques to Oasis Tides."
                  }
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section
        className={`py-16 ${
          isDark ? "bg-gray-800" : "bg-white"
        } transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className={`rounded-lg h-96 flex items-center justify-center ${
                isDark
                  ? "bg-gradient-to-br from-green-900 to-blue-900"
                  : "bg-gradient-to-br from-green-100 to-blue-100"
              }`}
              variants={fadeInVariants}
            >
              <span className="text-6xl">🌊</span>
            </motion.div>
            <motion.div variants={fadeInVariants}>
              <h2
                className={`text-3xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("sustainabilityCommitment")}
              </h2>
              <div
                className={`space-y-4 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <p>
                  {language === "ar"
                    ? "في واحة المد والجزر، نؤمن بأن الطعام الرائع والمسؤولية البيئية يسيران جنبًا إلى جنب. نحن ملتزمون بالممارسات المستدامة التي تحمي محيطاتنا للأجيال القادمة."
                    : "At Oasis Tides, we believe that great food and environmental responsibility go hand in hand. We are committed to sustainable practices that protect our oceans for future generations."
                  }
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {language === "ar"
                      ? "شراكات مع عمليات صيد مستدامة"
                      : "Partnerships with sustainable fishing operations"
                    }
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {language === "ar"
                      ? "سياسة عدم استخدام البلاستيك لمرة واحدة"
                      : "Zero single-use plastics policy"
                    }
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {language === "ar"
                      ? "برامج شاملة للحد من النفايات"
                      : "Comprehensive waste reduction programs"
                    }
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {language === "ar"
                      ? "دعم مجتمعات الصيد المحلية"
                      : "Support for local fishing communities"
                    }
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;


