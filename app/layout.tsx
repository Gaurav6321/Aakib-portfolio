import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Providers } from "@/components/chrome";

// The reference uses PP Telegraf (commercial). Space Grotesk is the free stand-in;
// to use a licensed Telegraf, load it with next/font/local under the same variable.
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Akib Sayyad — Multi-Disciplinary Artist & Illustrator",
  description:
    "Portfolio of Akib Sayyad, multi-disciplinary artist, illustrator and senior graphic designer based in Pune, India.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={display.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
