"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { SplashScreen } from "@/components/splash-screen";
import { LandingPage } from "@/components/landing/landing-page";
import { DemoLogin } from "@/components/demo-login";
import { CustomerApp } from "@/components/customer-app";
import { StaffApp } from "@/components/staff-app";

export default function Home() {
  const splashDone = useStore(s => s.splashDone);
  const setSplashDone = useStore(s => s.setSplashDone);
  const user = useStore(s => s.user);
  const appView = useStore(s => s.appView);
  const setAppView = useStore(s => s.setAppView);

  // Allow users to skip the splash by pressing any key
  useEffect(() => {
    if (splashDone) return;
    const skip = () => setSplashDone();
    window.addEventListener("keydown", skip, { once: true });
    return () => window.removeEventListener("keydown", skip);
  }, [splashDone, setSplashDone]);

  // First visit (no user) shows landing page; returning users skip to app
  useEffect(() => {
    if (splashDone && !user && appView !== "auth") {
      setAppView("landing");
    }
  }, [splashDone, user, appView, setAppView]);

  return (
    <>
      <SplashScreen />
      {user ? (
        user.role === "customer" ? <CustomerApp /> : <StaffApp />
      ) : appView === "auth" ? (
        <DemoLogin />
      ) : (
        <LandingPage />
      )}
    </>
  );
}
