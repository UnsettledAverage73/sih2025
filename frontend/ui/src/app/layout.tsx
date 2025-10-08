import "./globals.css";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap", // Add display: 'swap' for better font loading behavior
});

export const metadata = {
  title: "WipeApp",
  description: "A cross-platform desktop application for secure disk wiping.",
};

export default function RootLayout({
  children,
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen bg-muted/40">
            <Sidebar className="hidden md:flex w-64" />
            <div className="flex flex-col flex-1">
              <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <div className="relative ml-auto flex-1 md:grow-0" />
                <ModeToggle />
              </header>
              <main className="flex-1 p-4 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
