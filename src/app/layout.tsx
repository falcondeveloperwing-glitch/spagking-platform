import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpagKing — Premium Restaurant OS",
  description: "SpagKing is the all-in-one premium restaurant management platform: POS, Inventory, Staff, CRM, Delivery, Reports & AI insights — built for ambitious restaurants.",
  keywords: ["SpagKing", "restaurant", "POS", "inventory", "CRM", "delivery", "Nigeria"],
  authors: [{ name: "SpagKing" }],
  icons: {
    icon: "/spagking-mark.svg",
  },
  openGraph: {
    title: "SpagKing — Premium Restaurant OS",
    description: "The all-in-one premium restaurant management platform.",
    siteName: "SpagKing",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
