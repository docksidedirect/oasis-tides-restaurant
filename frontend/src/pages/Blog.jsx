import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { blogAPI } from "../lib/api";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Calendar,
  ArrowRight,
  Clock,
  BookOpen,
  TrendingUp,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Featured Posts Carousel Component
const FeaturedPostsCarousel = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredPosts = posts.slice(0, 3);

  useEffect(() => {
    if (featuredPosts.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === featuredPosts.length - 1 ? 0 : prevIndex + 1
        );
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [featuredPosts.length]);

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? featuredPosts.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === featuredPosts.length - 1 ? 0 : currentIndex + 1
    );
  };

  if (featuredPosts.length === 0) return null;

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl mb-16">
      <div className="relative w-full h-full">
        {featuredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            className={`absolute inset-0 w-full h-full ${
              index === currentIndex ? "opacity-100 z-20" : "opacity-0 z-0"
            }`}
            initial={{ opacity: 0, scale: 1.07 }}
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1 : 1.07,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Featured image background */}
            {post.image ? (
              <motion.img
                src={
                  post.image.startsWith("http")
                    ? post.image
                    : `http://localhost:8002/storage/blog_images/${post.image}`
                }
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                initial={{ scale: 1.07, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 0.95 }}
                transition={{ duration: 0.8 }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content overlay */}
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-4"
              >
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold mb-4">
                  Featured Post
                </Badge>
                <div className="flex items-center text-gray-300 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(post.published_at).toLocaleDateString()}
                  </span>
                  <Clock className="h-4 w-4 ml-4 mr-2" />
                  <span>5 min read</span>
                </div>
              </motion.div>
              <motion.h3
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-2xl md:text-4xl font-bold mb-4 line-clamp-2"
              >
                {post.title}
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg md:text-xl text-gray-200 mb-6 line-clamp-2"
              >
                {post.summary}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-600 hover:to-orange-600 font-semibold"
                  >
                    Read Full Story
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Navigation arrows */}
      {featuredPosts.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ArrowRight className="h-6 w-6 rotate-180" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {featuredPosts.map((_, index) => (
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
        </>
      )}
    </div>
  );
};

const Blog = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const {
    data: blogData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      const response = await blogAPI.getBlogPosts();
      return response.data.blog_posts;
    },
  });

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
            : "bg-gradient-to-br from-blue-50 via-white to-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
          <span
            className={`text-xl font-medium ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("loading")}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
            : "bg-gradient-to-br from-blue-50 via-white to-gray-50"
        }`}
      >
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-500/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-red-400" />
          </div>
          <h2
            className={`text-3xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("error")}
          </h2>
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Failed to load blog posts. Please try again later.
          </p>
          <Button
            className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-600 hover:to-orange-600"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const blogPosts = blogData?.data || [];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`py-20 ${
          isDark
            ? "bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900"
            : "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"
        } text-white`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ... header content as before ... */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm font-semibold rounded-full mb-6">
                ✨ Stories & Insights
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                {t("blogTitle")}
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
                Discover stories from our kitchen, sustainability initiatives,
                culinary insights, and the passion behind every dish we create.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {blogPosts.length === 0 ? (
          <div className="text-center py-20">{/* ... empty state ... */}</div>
        ) : (
          <>
            {/* Featured Posts Carousel with motion images */}
            <FeaturedPostsCarousel posts={blogPosts} />

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {/* ... Stats cards as before ... */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`text-center p-6 rounded-2xl border ${
                  isDark
                    ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                    : "bg-white border-gray-200 shadow-lg"
                }`}
              >
                <div className="bg-amber-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-amber-400" />
                </div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {blogPosts.length}
                </h3>
                <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                  Total Articles
                </p>
              </motion.div>
              {/* ... more stats/cards ... */}
            </div>

            {/* Blog Posts Grid */}
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-sm font-semibold rounded-full mb-4">
                  Latest Stories
                </span>
                <h2
                  className={`text-3xl md:text-4xl font-bold mb-4 ${
                    isDark
                      ? "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                      : "text-gray-900"
                  }`}
                >
                  All Blog Posts
                </h2>
                <p
                  className={`text-xl max-w-2xl mx-auto ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Explore our complete collection of culinary stories and
                  insights
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className={`rounded-2xl shadow-2xl overflow-hidden border transition-all duration-300 ${
                      isDark
                        ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl"
                    }`}
                  >
                    {/* Thumbnail image motion! */}
                    <div className="h-48 flex items-center justify-center relative overflow-hidden">
                      {post.image ? (
                        <motion.img
                          src={
                            post.image.startsWith("http")
                              ? post.image
                              : `http://localhost:8002/storage/blog_images/${post.image}`
                          }
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
                          initial={{ scale: 1.07, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.8 }}
                          viewport={{ once: true }}
                        />
                      ) : (
                        <BookOpen className="h-16 w-16 text-white/80 relative z-10" />
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-black/30 backdrop-blur-sm text-white border-white/20">
                          New
                        </Badge>
                      </div>
                    </div>
                    {/* Card content */}
                    <div className="p-6">
                      <div
                        className={`flex items-center text-sm mb-4 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                        <Clock className="h-4 w-4 ml-4 mr-2" />
                        <span>5 min read</span>
                      </div>
                      <h2
                        className={`text-xl font-bold mb-3 line-clamp-2 leading-tight ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {post.title}
                      </h2>
                      <p
                        className={`mb-6 line-clamp-3 leading-relaxed ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {post.summary}
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge
                          variant="secondary"
                          className={
                            isDark
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }
                        >
                          Blog Post
                        </Badge>
                        <Link to={`/blog/${post.slug}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`${
                              isDark
                                ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                : "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            }`}
                            as={motion.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Read More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
            {/* Newsletter (your code here if you want) */}
            {/* ... */}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
