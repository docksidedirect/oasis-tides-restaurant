"use client";

import { useEffect, useRef } from "react";

export default function ClientDynamicWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add("expansion-alids-init");
    }
  }, []);

  return <div ref={ref}>{children}</div>;
}
