import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { authAPI } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import UserForm from "./UserForm";
import ConfirmDialog from "./ConfirmDialog";

const UserManagement = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const response = await authAPI.getUsers();
      return response.data.users;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: authAPI.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      toast.success(t("userDeletedSuccessfully"));
      setIsConfirmDialogOpen(false);
    },
    onError: (error) => {
      toast.error(t("failedToDeleteUser"), { description: error.message });
    },
  });

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddEditDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsAddEditDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id);
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
        {t("loadingUsers")}
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
          {t("userManagement")}
        </h1>
        <Button
          onClick={handleAddUser}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("addNewUser")}
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
                {t("name")}
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } uppercase tracking-wider`}
              >
                {t("email")}
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } uppercase tracking-wider`}
              >
                {t("role")}
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
              isDark ? "bg-gray-800 divide-gray-700" : "bg-white divide-gray-200"
            }`}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {users?.map((user) => (
              <motion.tr key={user.id} variants={rowVariants}>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.name}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
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
                      onClick={() => handleDeleteUser(user)}
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
              className={`${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {selectedUser ? t("editUser") : t("addNewUser")}
            </DialogTitle>
          </DialogHeader>
          <UserForm user={selectedUser} onClose={() => setIsAddEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmDialogOpen(false)}
        title={t("confirmDeleteUserTitle")}
        description={t("confirmDeleteUserDescription")}
      />
    </div>
  );
};

export default UserManagement;


