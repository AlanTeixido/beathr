import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beathr — Recovery Intelligence",
  description:
    "Tu Garmin te dice lo que hiciste. Beathr te dice qué hacer hoy.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Beathr — Recovery Intelligence",
    description:
      "Tu Garmin te dice lo que hiciste. Beathr te dice qué hacer hoy.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beathr — Recovery Intelligence",
    description:
      "Tu Garmin te dice lo que hiciste. Beathr te dice qué hacer hoy.",
    images: ["/og-image.svg"],
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
