import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ID Extractor — Universal Document Scanner",
  description: "Smart crop · Chandra OCR · Ollama extraction",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
