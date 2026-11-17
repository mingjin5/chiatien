import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Baloo_2 } from "next/font/google";
import "./globals.css";

const body = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bvp",
  display: "swap",
});

const display = Baloo_2({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chia Tiền",
  description:
    "Chia tiền nhóm, tính ai nợ ai và tạo mã VietQR để chuyển khoản.",
};

export const viewport: Viewport = {
  themeColor: "#f5f3ff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${body.variable} ${display.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
