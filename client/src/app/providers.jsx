"use client";

import {
    GoogleReCaptchaProvider
} from "react-google-recaptcha-v3";


export default function Providers({ children }) {

    return (
        <GoogleReCaptchaProvider
            reCAPTCHAKey={
                process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
            }
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}