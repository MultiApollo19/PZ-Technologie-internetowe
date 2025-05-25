import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next"


export const metadata: Metadata = {
  title: "SpaceLab",
  description: "A next-gen site with rockets!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative">
        <Analytics/>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
