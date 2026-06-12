import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Montreal French Flashcards",
  description: "Mobile-friendly French and English phrase flashcards.",
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
      <body>{children}</body>
    </html>
  );
}
