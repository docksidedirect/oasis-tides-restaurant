import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { menuAPI } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import MenuItemForm from "./MenuItemForm";
import ConfirmDialog from "./ConfirmDialog";

const MenuManagement = () => {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const {
    data: menuItems,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminMenuItems"],
    queryFn: async () => {
      const response = await menuAPI.getMenuItems();
      return response.data.menu_items;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: menuAPI.deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminMenuItems"]);
      toast.success(t("menuItemDeletedSuccessfully"));
      setIsConfirmDialogOpen(false);
    },
    onError: (error) => {
      toast.error(t("failedToDeleteMenuItem"), { description: error.message });
    },
  });

  const handleAddMenuItem = () => {
    setSelectedMenuItem(null);
    setIsAddEditDialogOpen(true);
  };

  const handleEditMenuItem = (item) => {
    setSelectedMenuItem(item);
    setIsAddEditDialogOpen(true);
  };

  const handleDeleteMenuItem = (item) => {
    setSelectedMenuItem(item);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMenuItem) {
      deleteMutation.mutate(selectedMenuItem.id);
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  if (isLoading) {
    return (
      <div
        className={`text-center py-8 ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {t("loadingMenuItems")}
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
          {t("menuManagement")}
        </h1>
        <Button
          onClick={handleAddMenuItem}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("addNewItem")}
        </Button>
      </div>

      <motion.div
        className={`rounded-lg shadow overflow-hidden ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
            <tr>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } uppercase tracking-wider`}
              >
                {t("item")}
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } uppercase tracking-wider`}
              >
                {t("category")}
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } uppercase tracking-wider`}
              >
                {t("price")}
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } uppercase tracking-wider`}
              >
                {t("status")}
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } uppercase tracking-wider`}
              >
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
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {menuItems?.map((item) => (
              <motion.tr key={item.id} variants={rowVariants}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {language === "ar" ? item.name_ar : item.name}
                    </div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {language === "ar"
                        ? item.description_ar?.substring(0, 50) + "..."
                        : item.description?.substring(0, 50) + "..."}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="secondary" className="capitalize">
                    {language === "ar"
                      ? t(item.category.replace("_", ""))
                      : item.category.replace("_", " ")}
                  </Badge>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${item.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={item.available ? "default" : "destructive"}>
                    {item.available ? t("available") : t("unavailable")}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMenuItem(item)}
                      className={`${
                        isDark
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMenuItem(item)}
                      className={`${
                        isDark
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMenuItem(item)}
                      className={`${
                        isDark
                          ? "text-red-400 hover:bg-gray-700"
                          : "text-red-600 hover:bg-red-50"
                      }`}
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
            <DialogTitle
              className={`${isDark ? "text-white" : "text-gray-900"}`}
            >
              {selectedMenuItem ? t("editMenuItem") : t("addNewMenuItem")}
            </DialogTitle>
          </DialogHeader>
          <MenuItemForm
            menuItem={selectedMenuItem}
            onClose={() => setIsAddEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmDialogOpen(false)}
        title={t("confirmDeleteMenuItemTitle")}
        description={t("confirmDeleteMenuItemDescription")}
      />
    </div>
  );
};

export default MenuManagement;
