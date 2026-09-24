import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameVault & MetaForge | Universal Gaming Economy Suite",
  description: "Enterprise gaming utility, Growtopia agriculture & splicing matrix, Roblox DevEx calculator, and Discord webhook automation dispatcher.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
