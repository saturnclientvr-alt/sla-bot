import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Background } from "@/components/Background";
import { Navbar } from "@/components/Navbar";
import { Cursor } from "@/components/Cursor";
import { ToastContainer } from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VEDL | Virtual Elite Dragons League",
  description:
    "Verify your Player ID and Discord account before submitting item tickets for review by the VEDL administration team.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 10 L70 30 L65 55 L50 65 L35 55 L30 30 Z' stroke='%2339FF14' stroke-width='2' fill='rgba(57,255,20,0.2)'/><path d='M50 35 L58 43 L56 52 L50 56 L44 52 L42 43 Z' fill='%2339FF14'/></svg>",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppProvider>
          <LoadingScreen />
          <Cursor />
          <Background />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
