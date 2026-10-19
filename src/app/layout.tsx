import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Tamil, Fraunces } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { DevPanel } from "@/components/dev/DevPanel";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { RGBAlertSystem } from "@/components/effects/RGBAlertSystem";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-tamil",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zyven Student Ambassador Portal | Represent. Create. Influence. Grow.",
  description:
    "Join the prestigious Zyven Student Ambassador Program. Complete campus missions, earn transparent points on the ledger, unlock rewards, and represent Zyven across Tamil Nadu colleges.",
  keywords: [
    "Zyven",
    "Student Ambassador",
    "Campus Ambassador",
    "Engineering Students",
    "Tamil Nadu Colleges",
    "MEC",
    "PSG",
    "Kongu",
  ],
  authors: [{ name: "Zyven Network" }],
  openGraph: {
    title: "Zyven Student Ambassador Portal",
    description: "Represent. Create. Influence. Grow.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${fraunces.variable} ${notoSansTamil.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-bg text-text font-sans antialiased selection:bg-primary/20 selection:text-primary"
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange={false}
          >
            <QueryProvider>
              <MotionProvider>
                {children}
                {process.env.NEXT_PUBLIC_USE_MOCK === "true" ? <DevPanel /> : null}
                <RGBAlertSystem />
              </MotionProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    borderRadius: "16px",
                    background: "var(--surface)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-md)",
                  },
                }}
              />
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
