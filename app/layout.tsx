import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
// import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MindJourney Blog",
  description: "Explore the latest articles on business, beauty, technology, and more. Stay updated with insights and trends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${poppins.variable} antialiased`}>
        <Navbar />
        {/* <PageTransition> */}
        <main>
          {children}
          {/* <Analytics /> */}
        </main>
        {/* </PageTransition> */}
        <Footer />
      </body>
    </html>
  );
}
