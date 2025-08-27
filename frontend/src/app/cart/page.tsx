"use client";

import { useCart } from "@/contexts/CartContext";
import React, { useState, useEffect } from "react";
import { orderAPI } from "@/lib/api";

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem, clearCart, getTotal } =
    useCart();

  const [orderType, setOrderType] = useState<
    "dine_in" | "takeaway" | "delivery"
  >("dine_in");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch by rendering nothing on server/initial hydrate

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }
    if (orderType === "delivery" && !deliveryAddress.trim()) {
      setErrorMsg("Please enter a delivery address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
        order_type: orderType,
        delivery_address:
          orderType === "delivery" ? deliveryAddress : undefined,
        notes,
      };

      await orderAPI.create(orderPayload); // Your actual API call to place order

      setSuccessMsg("Order successfully placed!");
      clearCart(); // Clear cart on success
      setDeliveryAddress("");
      setNotes("");
    } catch (error) {
      setErrorMsg("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="mb-6">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center py-2 border-b"
              >
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm">${item.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={1}
                    className="w-16 border rounded px-2 py-1 text-center"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:underline"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mb-6 font-bold text-lg">
            Total: ${getTotal().toFixed(2)}
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Order Type</label>
            <select
              value={orderType}
              onChange={(e) =>
                setOrderType(
                  e.target.value as "dine_in" | "takeaway" | "delivery"
                )
              }
              className="border rounded px-3 py-2 w-full max-w-xs"
            >
              <option value="dine_in">Dine In</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          {orderType === "delivery" && (
            <div className="mb-4">
              <label
                className="block mb-1 font-medium"
                htmlFor="deliveryAddress"
              >
                Delivery Address
              </label>
              <textarea
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="border rounded px-3 py-2 w-full max-w-lg"
                rows={3}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="notes">
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border rounded px-3 py-2 w-full max-w-lg"
              rows={3}
            />
          </div>

          {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}
          {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

          <button
            onClick={handleSubmitOrder}
            disabled={loading}
            className="bg-ocean-600 text-white rounded px-6 py-3 hover:bg-ocean-700 transition disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}
