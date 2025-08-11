import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutClient from "@/components/LayoutClient";
import { BetProvider } from "@/contexts/BetContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NavigationEvents } from "@/components/NavigationEvents";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

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
        <AuthProvider>
          <BetProvider>
            <LoadingProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <NavigationEvents />
              </Suspense>
              <LayoutClient>
                {children}
              </LayoutClient>
            </LoadingProvider>
          </BetProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
