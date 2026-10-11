import type { Metadata } from "next";
import { Host_Grotesk } from 'next/font/google';
import { ReactLenis } from 'lenis/react';

import "./globals.scss";
import ContextSpoofer from "@/contexts/contextSpoofer";
import { staticMetadata } from "./metadata";

export const metadata: Metadata = staticMetadata;


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
