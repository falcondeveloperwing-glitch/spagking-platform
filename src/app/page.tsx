"use client";
import { useStore } from "@/lib/store";
import { DemoLogin } from "@/components/demo-login";
import { CustomerApp } from "@/components/customer-app";
import { StaffApp } from "@/components/staff-app";

export default function Home() {
  const user = useStore(s => s.user);

  if (!user) return <DemoLogin />;
  if (user.role === "customer") return <CustomerApp />;
  return <StaffApp />;
}
