"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { SplashScreen } from "@/components/splash-screen";
import { DemoLogin } from "@/components/demo-login";
import { CustomerApp } from "@/components/customer-app";
import { StaffApp } from "@/components/staff-app";

export default function Home() {
  const splashDone = useStore(s => s.splashDone);
  const setSplashDone = useStore(s => s.setSplashDone);
  const user = useStore(s => s.user);

  // Allow users to skip the splash by pressing any key
  useEffect(() => {
    if (splashDone) return;
    const skip = () => setSplashDone();
    window.addEventListener("keydown", skip, { once: true });
    return () => window.removeEventListener("keydown", skip);
  }, [splashDone, setSplashDone]);

  return (
    <>
      <SplashScreen />
      {user ? (
        user.role === "customer" ? <CustomerApp /> : <StaffApp />
      ) : (
        <DemoLogin />
      )}
    </>
  );
}
