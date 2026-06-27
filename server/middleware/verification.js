const verifyRecaptcha = async (req, res, next) => {

    const token =
        req.body.captchaToken;


    if (!token) {
        return res.status(400).json({
            message: "Captcha token missing"
        });
    }


    const response =
        await fetch(
            "https://www.google.com/recaptcha/api/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },
                body:
                    `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
            });


    const result =
        await response.json();


    if (!result.success) {

        return res.status(403).json({
            message: "Captcha failed"
        });

    }


    // optional protection

    if (result.score < 0.5) {

        return res.status(403).json({
            message: "Bot detected"
        });

    }


    next();

};
