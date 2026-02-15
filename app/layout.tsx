import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Snap Plan Designs",
  description: "Snap Plan Designs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="light" lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
