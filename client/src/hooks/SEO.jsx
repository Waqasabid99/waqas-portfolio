import { Helmet } from "react-helmet-async";


const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = "website"
}) => {

    const siteName = "Waqas Ali Abid | Portfolio";

    return (

        <Helmet>

            {/* Basic SEO */}

            <title>
                {title || ""}
            </title>


            <meta
                name="description"
                content={description || ""}
            />


            <meta
                name="keywords"
                content={keywords || ""}
            />


            {/* Canonical */}

            <link
                rel="canonical"
                href={url || ""}
            />


            {/* Open Graph */}

            <meta
                property="og:type"
                content={type || ""}
            />


            <meta
                property="og:title"
                content={title || ""}
            />


            <meta
                property="og:description"
                content={description || ""}
            />


            <meta
                property="og:image"
                content={image || ""}
            />


            <meta
                property="og:url"
                content={url || ""}
            />


            <meta
                property="og:site_name"
                content={siteName}
            />


            {/* Twitter */}

            <meta
                name="twitter:card"
                content="summary_large_image"
            />


            <meta
                name="twitter:title"
                content={title || ""}
            />


            <meta
                name="twitter:description"
                content={description || ""}
            />


            <meta
                name="twitter:image"
                content={image || ""}
            />

        </Helmet>

    );
};


export default SEO;
