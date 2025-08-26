"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { orderAPI } from "@/lib/api";

interface OrderDetail {
  id: number;
  date: string;
  total: number;
  status: string;
  items: {
    menu_item_name: string;
    quantity: number;
    price: number;
  }[];
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    orderAPI
      .getById(Number(id))
      .then((res) => {
        setOrder(res.data);
      })
      .catch(() => {
        setError("Failed to load order details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="flex justify-center py-10">Loading...</div>;
  if (error)
    return <div className="text-red-600 py-10 text-center">{error}</div>;
  if (!order) return <div className="py-10 text-center">Order not found.</div>;

  return (
    <main className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-semibold text-ocean-900 mb-6">
        Order #{order.id}
      </h1>
      <p className="mb-4">
        Date: {order.date} | Status:{" "}
        <span className="capitalize">{order.status}</span>
      </p>
      <ul className="divide-y divide-gray-200">
        {order.items.map((item, index) => (
          <li key={index} className="flex justify-between py-3">
            <span>
              {item.menu_item_name} × {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="text-right font-bold text-xl mt-4">
        Total: ${order.total.toFixed(2)}
      </div>
    </main>
  );
}
