"use client";

import { useEffect, useState } from "react";
import { menuAPI } from "@/lib/api";

export default function Test() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Test component mounted, fetching data...");
    menuAPI
      .getAll()
      .then((res) => {
        console.log("Test API response:", res.data);
        setItems(res.data.menu_items);
      })
      .catch((e) => {
        console.error(e);
        setError(e.message);
      });
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!items.length) return <p>Loading...</p>;

  return (
    <ul>
      {items.map((item: any) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
