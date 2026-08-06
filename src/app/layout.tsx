import type { Metadata } from "next";
import { Inter, Poppins, Pacifico } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/shared/theme-provider";

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

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpagKing — Premium Restaurant OS",
  description: "SpagKing is the all-in-one premium restaurant management platform: POS, Inventory, Staff, CRM, Delivery, Reports & AI insights — built for ambitious restaurants.",
  keywords: ["SpagKing", "restaurant", "POS", "inventory", "CRM", "delivery", "Nigeria"],
  authors: [{ name: "SpagKing" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "SpagKing — Premium Restaurant OS",
    description: "The all-in-one premium restaurant management platform.",
    siteName: "SpagKing",
    type: "website",
  },
};

// Inline script to prevent theme flash — runs before paint
const themeInitScript = `
(function() {
  try {
    var stored = JSON.parse(localStorage.getItem('spagking-store') || '{}');
    var mode = stored.state && stored.state.themeMode || 'dark';
    var isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(isDark ? 'dark' : 'light');
    root.style.colorScheme = isDark ? 'dark' : 'light';
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${pacifico.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
