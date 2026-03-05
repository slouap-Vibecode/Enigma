import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enigma",
  description: "Enigma - Créez et résolvez des énigmes",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Suspense fallback={<div>Chargement...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
