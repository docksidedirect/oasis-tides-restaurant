import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { orderAPI } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Eye,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ConfirmDialog from "./ConfirmDialog";

const OrderManagement = () => {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const { isDark } = useTheme();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const response = await orderAPI.getOrders();
      return response.data.orders;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: orderAPI.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminOrders"]);
      toast.success(t("orderDeletedSuccessfully"));
      setIsConfirmDialogOpen(false);
    },
    onError: (error) => {
      toast.error(t("failedToDeleteOrder"), { description: error.message });
    },
  });

  const handleDeleteOrder = (order) => {
    setSelectedOrder(order);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedOrder) {
      deleteMutation.mutate(selectedOrder.id);
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
        {t("loadingOrders")}
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
          {t("orderManagement")}
        </h1>
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
                {t("orderNumber")}
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } uppercase tracking-wider`}
              >
                {t("customer")}
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${
                  isDark ? "text-gray-300" : "text-gray-500"
                } uppercase tracking-wider`}
              >
                {t("total")}
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
              isDark ? "bg-gray-800 divide-gray-700" : "bg-white divide-gray-200"
            }`}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {orders?.map((order) => (
              <motion.tr key={order.id} variants={rowVariants}>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {order.order_number}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {order.user?.name}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${order.total_amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={
                      order.status === "pending" ? "default" : "secondary"
                    }
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log("View Order", order.id)}
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
                      onClick={() => handleDeleteOrder(order)}
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

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmDialogOpen(false)}
        title={t("confirmDeleteOrderTitle")}
        description={t("confirmDeleteOrderDescription")}
      />
    </div>
  );
};

export default OrderManagement;


