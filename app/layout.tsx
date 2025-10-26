import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import PageTabs from "@/components/PageTabs";
import { A11yProvider } from "@/components/A11yProvider";

export const metadata: Metadata = {
  title: "LinguaAid",
  description: "Enable first responders to talk with refugees, instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-zinc-50 text-zinc-900 antialiased">
        <A11yProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
          >
            Skip to content
          </a>

          <NavBar />
          <div className="bg-white">
            <div className="mx-auto max-w-5xl px-4 my-2">
              <PageTabs />
            </div>
          </div>

          <main id="main" className="mx-auto max-w-5xl px-4 py-8">
            {children}
          </main>
        </A11yProvider>
      </body>
    </html>
  );
}
