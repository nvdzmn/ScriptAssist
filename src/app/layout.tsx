import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { TopNav } from "@/components/shell/TopNav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "ScriptAssist",
  description: "Pending prior authorizations, recent scripts, and research alerts.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${display.variable} ${mono.variable}`}>
        <TopNav />
        {children}
      </body>
    </html>
  );
}
