import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/motion/LenisProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";
import TransitionLoader from "@/components/ui/TransitionLoader";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { FavouritesProvider } from "@/components/properties/FavouritesProvider";
import { RecentlyViewedProvider } from "@/components/properties/RecentlyViewedProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Luxespace Properties | Ultra-Luxury Real Estate Dubai",
  description: "Exquisite luxury villas, penthouses, and apartments in prime Dubai locations. Buy, rent, or invest in prime locations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${cormorant.variable} antialiased`}
    >
      <body className="bg-luxury-charcoal text-white">
        <LenisProvider>
          <LoadingScreen />
          <TransitionLoader />
          <CustomCursor />
          <ScrollToTop />
          <WhatsAppButton />
          <FavouritesProvider>
            <RecentlyViewedProvider>
              {children}
            </RecentlyViewedProvider>
          </FavouritesProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
