import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARCITE CCL | Corporate Cricket League, Kochi",
  description: "16 company teams. Two days. Connections beyond the boundary. Register a 15-player squad for ARCITE Corporate Cricket League at Thripunuthura Oval Ground, Kochi.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
