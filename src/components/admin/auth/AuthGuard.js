"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState("checking");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/validate", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Not authenticated");
        }

        setAuthStatus("authenticated");
      } catch (error) {
        setAuthStatus("unauthenticated");
        // Hanya redirect jika tidak di halaman login
        if (!window.location.pathname.includes("/login")) {
          router.push("/admin/login");
        }
      }
    };

    checkAuth();
  }, [router]);

  // Tampilkan loading state
  if (authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (authStatus === "unauthenticated" && !window.location.pathname.includes("/login")) {
    return null; // Sedang di-redirect ke login
  }

  return children;
};

export default AuthGuard;
