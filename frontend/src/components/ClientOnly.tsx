"use client";

import { useEffect, useState } from "react";

export default function ClientOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <body className={`antialiased${hydrated ? " expansion-alids-init" : ""}`}>
      {children}
    </body>
  );
}
