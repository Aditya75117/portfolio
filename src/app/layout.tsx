import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeScript } from "@/components/ThemeScript";
import "@/styles/main.scss";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aditya Dutta — Senior UI Developer",
  description:
    "Portfolio of Aditya Dutta, a Senior UI Developer in Noida with 7+ years of experience building responsive, high-performance web applications with React.js and Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${jakarta.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
