"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SwarnanetTerminal } from "@/components/terminal/SwarnanetTerminal";
import { isAuthenticated } from "@/lib/auth";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignInCard } from "@/components/auth/SignInCard";

export default function DashboardPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsLoggedIn(isAuthenticated());
  }, []);

  if (!isMounted || !isLoggedIn) {
    return (
      <AuthLayout>
        <SignInCard onLoginSuccess={() => setIsLoggedIn(true)} />
      </AuthLayout>
    );
  }

  return (
    <SwarnanetTerminal
      onSignOut={() => {
        setIsLoggedIn(false);
        router.push("/login");
      }}
    />
  );
}
