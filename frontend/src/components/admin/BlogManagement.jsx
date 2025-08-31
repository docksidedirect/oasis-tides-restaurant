import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { blogAPI } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import BlogPostForm from "./BlogPostForm";
import ConfirmDialog from "./ConfirmDialog";

const BlogManagement = () => {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);

  const {
    data: blogPosts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminBlogPosts"],
    queryFn: async () => {
      try {
        const response = await blogAPI.getBlogPosts();
        if (
          response.data &&
          response.data.blog_posts &&
          response.data.blog_posts.data
        ) {
          return response.data.blog_posts.data;
        }
        return [];
      } catch (error) {
        console.error("BlogManagement API Error:", error);
        throw error;
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogAPI.deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminBlogPosts"]);
      toast.success(t("blogPostDeletedSuccessfully"));
      setIsConfirmDialogOpen(false);
    },
    onError: (error) => {
      toast.error(t("failedToDeleteBlogPost"), { description: error.message });
    },
  });

  const handleAddBlogPost = () => {
    setSelectedBlogPost(null);
    setIsAddEditDialogOpen(true);
  };

  const handleEditBlogPost = (post) => {
    setSelectedBlogPost(post);
    setIsAddEditDialogOpen(true);
  };

  const handleDeleteBlogPost = (post) => {
    setSelectedBlogPost(post);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBlogPost) {
      deleteMutation.mutate(selectedBlogPost.id);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`text-center py-8 ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {t("loadingBlogPosts")}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 text-red-600`}>
        {t("errorLoadingBlogPosts")}: {error.message}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-3xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {t("blogManagement")}
        </h1>
        <Button
          onClick={handleAddBlogPost}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("addNewBlogPost")}
        </Button>
      </div>

      <motion.div
        className={`rounded-lg shadow overflow-hidden ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
        initial="hidden"
        animate="visible"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {t("title")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {t("author")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {t("status")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <motion.tbody
            className={`${
              isDark
                ? "bg-gray-800 divide-gray-700"
                : "bg-white divide-gray-200"
            }`}
          >
            {blogPosts.map((post) => (
              <motion.tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {language === "ar" ? post.title_ar : post.title}
                    </div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {(language === "ar"
                        ? post.summary_ar
                        : post.summary
                      )?.substring(0, 50) ||
                        (language === "ar"
                          ? post.content_ar
                          : post.content
                        )?.substring(0, 50)}
                      ...
                    </div>
                  </div>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {post.author || "Admin"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={post.published ? "default" : "destructive"}>
                    {post.published ? t("published") : t("draft")}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditBlogPost(post)}
                      className={
                        isDark
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-blue-600 hover:bg-blue-50"
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditBlogPost(post)}
                      className={
                        isDark
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-blue-600 hover:bg-blue-50"
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBlogPost(post)}
                      className={
                        isDark
                          ? "text-red-400 hover:bg-gray-700"
                          : "text-red-600 hover:bg-red-50"
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </motion.div>

      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent
          className={`sm:max-w-[425px] ${
            isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <DialogHeader>
            <DialogTitle className={isDark ? "text-white" : "text-gray-900"}>
              {selectedBlogPost ? t("editBlogPost") : t("addNewBlogPost")}
            </DialogTitle>
          </DialogHeader>
          <BlogPostForm
            blogPost={selectedBlogPost}
            onClose={() => setIsAddEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmDialogOpen(false)}
        title={t("confirmDeleteBlogPostTitle")}
        description={t("confirmDeleteBlogPostDescription")}
      />
    </div>
  );
};

export default BlogManagement;
