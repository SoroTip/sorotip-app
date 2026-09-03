import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import "./globals.css";
import WalletConnect from "@/components/WalletConnect";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SoroTip",
  description: "Tip creators on Stellar",
};

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/send", label: "Send" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-tip-dark antialiased`}>
        <header className="sticky top-0 z-10 border-b border-white/5 bg-tip-dark/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" className="text-lg font-bold text-white">
              Soro<span className="text-tip-orange">Tip</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-stone-300 sm:flex">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </nav>
            <WalletConnect />
          </div>
          <nav className="flex items-center gap-4 overflow-x-auto border-t border-white/5 px-4 py-2 text-sm text-stone-300 sm:hidden">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="shrink-0 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
