import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "MEENPRO",
  description: "BORN OF MEENPRO",
  openGraph: {
    title: "MEENPRO",
    description: "BORN OF MEENPRO",
    images: ["/uploads/meenpro.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className="dark">
      <body
        className={`${orbitron.className} antialiased bg-black text-white min-h-screen flex flex-col`}
      >
        {/* เนื้อหา */}
        <div className="flex-1">
          {children}
        </div>

        {/* ✅ ส่วนท้าย */}
        <footer className="relative w-full py-10 border-t border-white/5 overflow-hidden">
          {/* gradient เบา ๆ */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black opacity-90" />

          {/* เส้นแสงบน */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative z-10 text-center">
            <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-white/30 font-light">
              SYSTEM DESIGN BY{" "}
              <a
                href="https://www.facebook.com/mali.temps/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-all duration-300 font-medium"
              >
                Matoom Wellesley
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}