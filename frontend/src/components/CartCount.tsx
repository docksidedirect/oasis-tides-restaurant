"use client";

import { useEffect, useState } from "react";

export default function CartCount() {
  const [isMounted, setIsMounted] = useState(false);
  const { cartItems } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Render nothing on server

  return <span>{cartItems.length} items</span>; // Render on client
}
