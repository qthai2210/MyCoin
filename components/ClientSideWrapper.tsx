"use client"; // Mark as Client Component

import { useEffect, useState } from "react";

export default function ClientSideWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // If we haven't mounted yet, return minimal content to avoid hydration mismatch
  if (!hasMounted) {
    return <div style={{ visibility: "hidden" }}></div>;
  }

  // Once mounted on client, render children
  return <>{children}</>;
}
