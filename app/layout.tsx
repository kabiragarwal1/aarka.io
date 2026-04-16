import type { Metadata } from "next";
import "./globals.css";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "Aarka — AI Media OS",
  description:
    "A visual, AI-native media workspace where content flows into distribution and performance loops back into creation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-ink-950 text-ink-100">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
