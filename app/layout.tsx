import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Devesh Kumar Sharma | Software Development Engineer",
  description: "Software Development Engineer in Bengaluru specializing in distributed systems, scalable backends, and cloud infrastructure. Experience at Kotak811 and Amazon.",
  openGraph: {
    title: "Devesh Kumar Sharma | Software Development Engineer",
    description: "Professional experience, projects, technical skills, and education. Building reliable systems with measurable impact.",
    type: "website",
  },
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
