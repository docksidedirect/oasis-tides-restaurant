"use client";

import { useState, useEffect } from "react";
import { authAPI, orderAPI, reservationAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface OrderSummary {
  id: number;
  date: string;
  total: number;
  status: string;
}

interface ReservationSummary {
  id: number;
  date: string;
  time: string;
  party_size: number;
  status: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, updateUserContext } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [reservations, setReservations] = useState<ReservationSummary[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user details (you may modify if updateUserContext has fresh info)
        const res = await authAPI.me();
        const userData = res.data;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
        });
        setLoyaltyPoints(userData.loyaltyPoints || 0);

        // Fetch recent orders (limit 3)
        const ordersRes = await orderAPI.getAll();
        setOrders(ordersRes.data.slice(0, 3));

        // Fetch recent reservations (limit 3)
        const reservationsRes = await reservationAPI.getAll();
        setReservations(reservationsRes.data.slice(0, 3));
      } catch (error) {
        setMessage("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Call your update profile API here (assuming authAPI.update exists)
      // e.g. await authAPI.update(formData);
      // For now, simulate update:
      await new Promise((r) => setTimeout(r, 1000));

      setMessage("Profile updated successfully!");
      // Optionally update AuthContext with new info
      updateUserContext && updateUserContext(formData);
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto p-6 mt-12 text-center">
        <p className="text-lg text-gray-700">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-3xl font-semibold text-ocean-900 mb-6">
        Your Profile
      </h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes("Failed")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <InputField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 px-6 py-3 bg-ocean-600 hover:bg-ocean-700 text-white rounded font-semibold transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Loyalty Points</h2>
        <div className="text-3xl font-bold text-ocean-600">{loyaltyPoints}</div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <p>You have no recent orders.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="border border-gray-200 rounded p-3 flex justify-between"
              >
                <span>
                  Order #{order.id} — {order.date}
                </span>
                <span className="font-semibold">${order.total.toFixed(2)}</span>
                <span className="capitalize">{order.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Reservations</h2>
        {reservations.length === 0 ? (
          <p>You have no recent reservations.</p>
        ) : (
          <ul className="space-y-3">
            {reservations.map((reservation) => (
              <li
                key={reservation.id}
                className="border border-gray-200 rounded p-3 flex justify-between items-center"
              >
                <div>
                  <div>
                    {reservation.date} at {reservation.time}
                  </div>
                  <div>Party of {reservation.party_size}</div>
                </div>
                <div className="capitalize">{reservation.status}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={name} className="block mb-1 font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-ocean-600"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
