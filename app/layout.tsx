import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AVD Basiscertificaat AI-Geletterd',
  description:
    'Mondeling examen voor het basiscertificaat AI-Geletterd van AI voor Docenten.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className={inter.variable}>
      <body className="bg-purple-light-bg text-text-body antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
