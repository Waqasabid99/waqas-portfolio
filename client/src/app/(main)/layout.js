import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";

export default function MainLayout({ children }) {
    return (
        <>
            {children}
            <ScrollToTop />
            <Footer />
        </>
    );
};
