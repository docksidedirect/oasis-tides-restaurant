// ClientOnlyBody.tsx
"use client";

import { useEffect, useState } from "react";

export default function ClientOnlyBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className={hydrated ? "expansion-alids-init" : ""}>{children}</div>
  );
}
