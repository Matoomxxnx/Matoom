import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Winterfell Vega",
  description: "BORN OF WINTERFELL",
  openGraph: {
    title: "Winterfell Vega",
    description: "BORN OF WINTERFELL",
    images: ["/uploads/Vega.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className="dark">
      <body className="antialiased bg-black text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}