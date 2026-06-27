"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function Providers({ children }) {
    console.log(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
    return (
        <GoogleReCaptchaProvider
            reCAPTCHAKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}