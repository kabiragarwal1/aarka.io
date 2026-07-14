import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import CursorProvider from "@/components/CursorProvider";
import ScrollReset from "@/components/ScrollReset";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AARKA — Strategy, Product, AI & Execution | Led by Kabir Agarwal",
  description:
    "AARKA is a strategic consulting and technology firm led by Kabir Agarwal. We build intelligent businesses at the intersection of strategy, product, automation, and capital.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "AARKA — Strategy, Product, AI & Execution",
    description:
      "Your bridge to success. Strategy, product, automation, capital. Led by Kabir Agarwal.",
    type: "website",
    url: "https://aarka.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
        style={{ background: "var(--bg)", color: "var(--fg)" }}
      >
        <ThemeProvider>
          <ScrollReset />
          <CursorProvider>{children}</CursorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
