"use client";

import { useState } from "react";
import { reservationAPI } from "@/lib/api";

export default function NewReservationPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    reservation_date: "",
    reservation_time: "",
    party_size: 1,
    special_requests: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.reservation_date)
      newErrors.reservation_date = "Select a reservation date";
    if (!formData.reservation_time)
      newErrors.reservation_time = "Select a reservation time";
    if (!formData.party_size || formData.party_size < 1)
      newErrors.party_size = "Party size must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "party_size" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!validate()) return;

    setLoading(true);

    try {
      await reservationAPI.create(formData);
      setSuccessMsg(
        "Reservation successfully booked! We look forward to seeing you."
      );
      setFormData({
        name: "",
        phone: "",
        email: "",
        reservation_date: "",
        reservation_time: "",
        party_size: 1,
        special_requests: "",
      });
      setErrors({});
    } catch (error) {
      setErrorMsg("Failed to submit reservation. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
      <h1 className="text-2xl font-semibold mb-6 text-ocean-900">
        Book a Reservation
      </h1>

      {successMsg && (
        <p className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMsg}
        </p>
      )}
      {errorMsg && (
        <p className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMsg}</p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block font-medium mb-1 text-gray-700"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
              errors.name ? "border-red-500 ring-red-300" : "border-gray-300"
            }`}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block font-medium mb-1 text-gray-700"
          >
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
              errors.phone ? "border-red-500 ring-red-300" : "border-gray-300"
            }`}
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="text-red-500 text-sm mt-1">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block font-medium mb-1 text-gray-700"
          >
            Email (optional)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring border-gray-300"
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label
            htmlFor="reservation_date"
            className="block font-medium mb-1 text-gray-700"
          >
            Reservation Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="reservation_date"
            name="reservation_date"
            value={formData.reservation_date}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
              errors.reservation_date
                ? "border-red-500 ring-red-300"
                : "border-gray-300"
            }`}
            aria-invalid={errors.reservation_date ? "true" : "false"}
            aria-describedby={
              errors.reservation_date ? "date-error" : undefined
            }
          />
          {errors.reservation_date && (
            <p id="date-error" className="text-red-500 text-sm mt-1">
              {errors.reservation_date}
            </p>
          )}
        </div>

        {/* Time */}
        <div className="mb-4">
          <label
            htmlFor="reservation_time"
            className="block font-medium mb-1 text-gray-700"
          >
            Reservation Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="reservation_time"
            name="reservation_time"
            value={formData.reservation_time}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
              errors.reservation_time
                ? "border-red-500 ring-red-300"
                : "border-gray-300"
            }`}
            aria-invalid={errors.reservation_time ? "true" : "false"}
            aria-describedby={
              errors.reservation_time ? "time-error" : undefined
            }
          />
          {errors.reservation_time && (
            <p id="time-error" className="text-red-500 text-sm mt-1">
              {errors.reservation_time}
            </p>
          )}
        </div>

        {/* Party Size */}
        <div className="mb-4">
          <label
            htmlFor="party_size"
            className="block font-medium mb-1 text-gray-700"
          >
            Party Size <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="party_size"
            name="party_size"
            value={formData.party_size}
            onChange={handleChange}
            min={1}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
              errors.party_size
                ? "border-red-500 ring-red-300"
                : "border-gray-300"
            }`}
            aria-invalid={errors.party_size ? "true" : "false"}
            aria-describedby={errors.party_size ? "party-error" : undefined}
          />
          {errors.party_size && (
            <p id="party-error" className="text-red-500 text-sm mt-1">
              {errors.party_size}
            </p>
          )}
        </div>

        {/* Special Requests */}
        <div className="mb-6">
          <label
            htmlFor="special_requests"
            className="block font-medium mb-1 text-gray-700"
          >
            Special Requests
          </label>
          <textarea
            id="special_requests"
            name="special_requests"
            rows={4}
            value={formData.special_requests}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring border-gray-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ocean-600 text-white py-3 rounded hover:bg-ocean-700 transition disabled:opacity-50 font-semibold"
        >
          {loading ? "Booking..." : "Book Reservation"}
        </button>
      </form>
    </main>
  );
}
