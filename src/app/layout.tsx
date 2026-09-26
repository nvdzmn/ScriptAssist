import type { Metadata } from "next";
import { TopNav } from "@/components/shell/TopNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScriptAssist",
  description: "Pending prior authorizations, recent scripts, and research alerts.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        {children}
      </body>
    </html>
  );
}
