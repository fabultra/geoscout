import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GEO Scout',
  description: 'Analysez votre visibilité sur les LLMs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
