"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReservationsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/reservations/new");
  }, [router]);

  return null; // Optionally add loading indicator here
}
