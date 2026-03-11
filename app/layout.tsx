import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CryptoVault",
  description: "Secure cloud file storage demo using AES + RSA hybrid encryption",
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