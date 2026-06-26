import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { ToastContainer } from "react-toastify";

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
      <body className="min-h-full flex flex-col">
        <Navbar />
        <ToastContainer />
        {children}
      </body>
    </html>
  );
};
