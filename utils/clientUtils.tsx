"use client";

import React, { useState, useEffect } from "react";

// Component wrapper to prevent hydration mismatches for client-only rendering
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Hook for safely accessing browser APIs
export function useClientSide<T>(serverFallback: T, clientFn: () => T): T {
  const [value, setValue] = useState<T>(serverFallback);

  useEffect(() => {
    setValue(clientFn());
  }, [clientFn]);

  return value;
}
