import { Poppins, Inter, Work_Sans, Manrope, Sora } from "@next/font/google";

export const ppReg = Poppins({
  subsets: ["latin"],
  variable: "--font-ppReg",
  weight: ["400"],
});

export const ppSB = Poppins({
  subsets: ["latin"],
  variable: "--font-ppReg",
  weight: ["500"],
});

// bold poppins
export const ppB = Poppins({
  subsets: ["latin"],
  variable: "--font-ppB",
  weight: ["600"],
});

// extra bold
export const ppEB = Poppins({
  subsets: ["latin"],
  variable: "--font-ppEB",
  weight: ["900"],
});

// sora font
export const soraB = Poppins({
  subsets: ["latin"],
  variable: "--font-soraB",
  weight: ["500"],
});

export const soraReg = Poppins({
  subsets: ["latin"],
  variable: "--font-soraReg",
  weight: ["300"],
});

export const soraEB = Poppins({
  subsets: ["latin"],
  variable: "--font-soraEB",
  weight: ["900"],
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700", "500"],
  variable: "--font-inter",
});
export const sora = Sora({
  weight: ["600", "700"],
  variable: "--font-sora",
  subsets: ["latin"],
});
export const workSans = Work_Sans({
  weight: ["400", "500"],
  variable: "--font-workSans",
  subsets: ["latin"],
});
export const manrope = Manrope({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-manrope",
});
