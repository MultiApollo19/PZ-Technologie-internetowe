import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: "SpaceLab",
  description: "A next-gen site with rockets!",
  openGraph:{
    type: "website",
    url:"https://spacelab-six.vercel.app",
    title:"SpaceLab",
    description:"A next-gen site with rockets!",
    siteName:"SpaceLab"
  }
  
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
        <SpeedInsights/>
      </body>
    </html>
  );
}
