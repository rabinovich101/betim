import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import BetSlip from "@/components/BetSlip";
import { BetProvider } from "@/contexts/BetContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BETIM - Sports Betting Platform",
  description: "Modern sports betting platform with live odds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1a1a2e] text-white`}
      >
        <BetProvider>
          <Navbar />
          <div className="flex min-h-screen pt-16">
            <Sidebar />
            <main className="flex-1 lg:ml-0 xl:mr-80">
              {children}
            </main>
            <BetSlip />
          </div>
        </BetProvider>
      </body>
    </html>
  );
}
