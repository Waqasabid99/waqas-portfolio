import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
import Providers from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Waqas Abid | Full Stack Developer",
  description: "Promise to deliver best of best",
  keywords: [
    "Waqas Abid",
    "Full Stack Developer",
    "Web Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Express.js Developer",
    "MongoDB Developer",
    "MERN Stack Developer",
    "MEAN Stack Developer",
    "MEVN Stack Developer",
    "Full Stack Developer",
    "Web Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Express.js Developer",
    "MongoDB Developer",
    "MERN Stack Developer",
    "MEAN Stack Developer",
    "MEVN Stack Developer",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={` ${poppins.className} ${montserrat.className} h-full antialiased`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D4YKBWPZBH"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-D4YKBWPZBH');
          `}
        </Script>

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7523374535029796"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <ToastContainer />
          {children}
        </Providers>
      </body>
    </html>
  );
};
