import { Inter } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Valorant Fantasy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
