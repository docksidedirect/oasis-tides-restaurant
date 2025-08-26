"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { orderAPI } from "@/lib/api";

interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    orderAPI
      .getAll()
      .then((res) => setOrders(res.data))
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="flex justify-center py-10">Loading...</div>;
  if (error)
    return <div className="text-red-600 py-10 text-center">{error}</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-semibold text-ocean-900 mb-6">
        Order History
      </h1>
      {orders.length === 0 ? (
        <p>You have no past orders.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <Link
                  href={`/orders/${order.id}`}
                  className="font-semibold text-ocean-600 hover:underline"
                >
                  Order #{order.id}
                </Link>
                <div className="text-gray-500">{order.date}</div>
              </div>
              <div className="text-lg font-bold">${order.total.toFixed(2)}</div>
              <div className="capitalize">{order.status}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
