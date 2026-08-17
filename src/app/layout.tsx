import type { Metadata } from "next";
import { Bowlby_One_SC, Jost, Oswald } from "next/font/google";
import "./globals.css";

const bodyFont = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sectionFont = Bowlby_One_SC({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const headingFont = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Fire Point Menu",
  description: "A mobile-first digital menu for The Fire Point cafe and restro.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${sectionFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
