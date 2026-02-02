// src/components/AuthGuard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackPath?: string; // Where to redirect if not authenticated (default: /login)
}

export default function AuthGuard({ 
  children, 
  fallbackPath = "/login" 
}: AuthGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(router.asPath);
        router.push(`${fallbackPath}?returnUrl=${returnUrl}`);
      }
    });

    return () => unsub();
  }, [router, fallbackPath]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-[70vh] bg-[#002930] flex items-center justify-center">
        <div className="text-white/80 text-lg">Loading...</div>
      </div>
    );
  }

  // Unauthenticated - show nothing while redirecting
  if (status === "unauthenticated") {
    return (
      <div className="min-h-[70vh] bg-[#002930] flex items-center justify-center">
        <div className="text-white/80 text-lg">Redirecting to sign in...</div>
      </div>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
}