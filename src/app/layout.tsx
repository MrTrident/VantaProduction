import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VantaProvider } from "@/lib/vanta-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VANTA PRODUCTION — Creative Production Network & Platform",
  description: "An independent creative production network bringing talented artists and creators together.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#050505] text-[#f4f4f6] font-sans antialiased selection:bg-white selection:text-black`}
      >
        <VantaProvider>
          {children}
        </VantaProvider>
      </body>
    </html>
  );
}
