import localFont from "next/font/local";
import { Syne } from "next/font/google";

export const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--nd-font-display",
  display: "swap",
  preload: true,
});

export const inter = localFont({
  src: [
    {
      path: "../public/fonts/InterVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../public/fonts/InterVariable-Italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--nd-font-sans",
  display: "swap",
  preload: true,
});

export const jetbrainsMono = localFont({
  src: [
    {
      path: "../public/fonts/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/JetBrainsMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--nd-font-mono",
  display: "swap",
  preload: true,
});
