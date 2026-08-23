import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import QueryProvider from "@/query-provider";
import { ThemeProvider } from "@/theme-provider";
import { ImageKitProvider } from "@imagekit/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The Brain Bank",
    template: "%s | The Brain Bank",
  },
  description:
    "Discover the favorite books of the world's most influential people. The more a book is mentioned, the higher it ranks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NuqsAdapter>
          <QueryProvider>
            <TooltipProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <ImageKitProvider
                  urlEndpoint={`https://ik.imagekit.io/${process.env.NEXT_PUBLIC_IMAGEKIT_ID}`}
                >
                  {children}
                </ImageKitProvider>
              </ThemeProvider>
            </TooltipProvider>
          </QueryProvider>
        </NuqsAdapter>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
