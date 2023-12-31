import "@diskastore/styles/globals.css";

import { Inter } from "next/font/google";
import MainWrapper from "@diskastore/MainWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Disk From Vitalii",
  description: "Google Disk analogue ",
  icons: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <MainWrapper>{children}</MainWrapper>
      </body>
    </html>
  );
}
