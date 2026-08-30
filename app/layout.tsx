import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CursorTrail from "@/components/CursorTrail";
import { ThemeProvider } from "@/components/ThemeProvider";
import VimCommandsProvider from "@/components/VimCommandsProvider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["300", "400", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Amy Wang",
  description: "Portfolio of Amy Wang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-beahvior="smooth">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <VimCommandsProvider>
            <CursorTrail />
            <Nav />
            {children}
            <Footer />
          </VimCommandsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
