import { Sirin_Stencil, Rubik_Maps, Outfit, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const sirin_stencil = Sirin_Stencil({
  variable: "--font-sirin-stencil",
  weight: ["400"],
  subsets: ["latin"],
});

const rubikMaps = Rubik_Maps({
  variable: "--font-rubik-maps",
  weight: ["400"],
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

// Modern Bengali Font - Hind Siliguri
const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
});

export const metadata = {
  title: "Event Connect",
  description: "Your Complete Event Planning Solution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sirin_stencil.variable} ${rubikMaps.variable} ${outfit.variable} ${hindSiliguri.variable} antialiased`}
        suppressHydrationWarning 
      >
        {children}
      </body>
    </html>
  );
}