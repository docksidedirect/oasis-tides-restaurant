import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oasis Tides Restaurant - Fine Dining Experience",
  description:
    "Experience the finest dining at Oasis Tides Restaurant. Fresh seafood, ocean views, and exceptional service await you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* This ensures proper viewport scaling on mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.className} bg-white text-gray-900 antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-grow container max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {/* Main content area with padding and responsive max width */}
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
