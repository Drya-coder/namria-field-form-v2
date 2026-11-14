import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NAMRIA Field Observation Form LC-02',
  description: 'Official Field Observation for Land Classification of Unclassified Public Forest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-200 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}