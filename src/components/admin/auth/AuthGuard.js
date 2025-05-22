"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cek token di localStorage atau cookies
    const adminToken = localStorage.getItem("adminToken");
    
    if (!adminToken) {
      router.push("/admin/login");
    } else {
      // Opsional: Validasi token dengan backend
      const validateToken = async () => {
        try {
          const response = await fetch("/api/auth/validate", {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          });
          
          if (!response.ok) {
            throw new Error("Token tidak valid");
          }
          
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token validation error:", error);
          localStorage.removeItem("adminToken");
          router.push("/admin/login");
        } finally {
          setIsLoading(false);
        }
      };
      
      validateToken();
    }
  }, [router]);

  // Tampilkan loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Tampilkan children hanya jika sudah terautentikasi
  return isAuthenticated ? children : null;
};

export default AuthGuard;