"use client";

import { useEffect } from "react";

export default function BodyClassInitializer() {
  useEffect(() => {
    document.body.classList.add("expansion-alids-init");
  }, []);

  return null; // This component doesn't render anything
}
