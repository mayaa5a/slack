import type { Metadata } from "next";
import { SlackProvider } from "@/components/providers/slack-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slack MVP Demo",
  description: "Slack-like prototype with cross-workspace AI dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SlackProvider>{children}</SlackProvider>
      </body>
    </html>
  );
}
