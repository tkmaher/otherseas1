import type { Metadata } from "next";
import { Host_Grotesk } from 'next/font/google';
import { ReactLenis } from 'lenis/react';

import "./globals.scss";
import ContextSpoofer from "@/contexts/contextSpoofer";

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
    <html className={host_grotesk.variable} >
      <body>
        <ReactLenis root options={{lerp: 0.5}}>
          <ContextSpoofer data={children} />
        </ReactLenis>
      </body>
    </html>
  );
}
