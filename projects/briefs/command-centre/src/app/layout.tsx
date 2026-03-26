import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

// Epilogue for headlines — loaded via next/font/google
import { Epilogue } from "next/font/google";
const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
});

export const metadata: Metadata = {
  title: "Command Centre",
  description: "Agentic OS Command Centre",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${epilogue.variable} antialiased`}
        style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
