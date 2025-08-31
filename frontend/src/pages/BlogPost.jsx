import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { blogAPI } from "../lib/api";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from "framer-motion";
import { Calendar, User } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const { isDark } = useTheme();

  const {
    data: blogPost,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogPost", slug],
    queryFn: async () => {
      const response = await blogAPI.getBlogPost(slug);
      return response.data.blog_post;
    },
  });

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
          <p className="text-gray-300">{t("failedToLoadBlogPost")}</p>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-extrabold text-amber-400 mb-4">
            {t("notFound")}
          </h2>
          <p className="text-gray-300">{t("blogPostNotFound")}</p>
        </div>
      </div>
    );
  }

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
            ? "bg-gradient-to-r from-amber-800 via-orange-800 to-red-800"
            : "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            className="text-5xl font-extrabold bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent mb-4"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            {language === "ar" ? blogPost.title_ar : blogPost.title}
          </motion.h1>
          <motion.div
            className={`flex items-center justify-center gap-4 text-lg ${
              isDark ? "text-amber-200" : "text-amber-100"
            }`}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <span className="flex items-center gap-1">
              <User className="h-5 w-5" />
              {blogPost.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-5 w-5" />
              {new Date(blogPost.published_at).toLocaleDateString()}
            </span>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          className={`rounded-3xl shadow-2xl overflow-hidden flex flex-col p-8 ${
            isDark
              ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
              : "bg-white border border-gray-200"
          }`}
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
        >
          {blogPost.image && (
            <motion.img
              src={
                blogPost.image.startsWith("http")
                  ? blogPost.image
                  : `http://localhost:8002/storage/blog_images/${blogPost.image}`
              }
              alt={language === "ar" ? blogPost.title_ar : blogPost.title}
              className="w-full max-h-96 rounded-xl mb-8 object-cover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            />
          )}
          <motion.div
            className={`prose max-w-none ${
              isDark ? "prose-invert text-gray-300" : "text-gray-700"
            }`}
            dangerouslySetInnerHTML={{
              __html:
                language === "ar" ? blogPost.content_ar : blogPost.content,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default BlogPost;
