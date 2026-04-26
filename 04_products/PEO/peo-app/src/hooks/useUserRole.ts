"use client";

import { useEffect, useState } from "react";

interface UserRoleData {
  userId: string | null;
  role: string;
  isAuthenticated: boolean;
}

export function useUserRole() {
  const [data, setData] = useState<UserRoleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setData({ userId: null, role: "anonymous_visitor", isAuthenticated: false });
        setLoading(false);
      });
  }, []);

  return { ...data, loading };
}
