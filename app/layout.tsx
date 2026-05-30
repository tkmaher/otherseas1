import type { Metadata } from "next";
import { Host_Grotesk } from 'next/font/google';
import "./globals.scss";

export const metadata: Metadata = {
  title: "Tom Maher",
  description: "The web design portfolio of Tom Maher.",
};

const host_grotesk = Host_Grotesk({
  subsets: ['latin'],
  variable: '--font-host'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={host_grotesk.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
