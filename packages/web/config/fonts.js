import { Poppins, DM_Sans, Sora } from "@next/font/google";

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
