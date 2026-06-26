"use client";

import { useState } from "react";
import { FaTwitter, FaLinkedin, FaFacebook, FaLink as LinkIcon, FaCheck } from "react-icons/fa";
import Link from "next/link";

const ShareButtons = ({ url, title }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const links = [
        { icon: FaTwitter, label: "Share on Twitter", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
        { icon: FaLinkedin, label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
        { icon: FaFacebook, label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    ];

    return (
        <div className="flex items-center gap-2">
            {links.map(({ icon: Icon, href, label }) => (
                <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-[#6e7b8d] hover:border-[#1365ff] hover:text-[#1365ff] transition"
                >
                    <Icon size={16} />
                </Link>
            ))}
            <button
                onClick={handleCopy}
                aria-label="Copy link"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-[#6e7b8d] hover:border-[#1365ff] hover:text-[#1365ff] transition"
            >
                {copied ? <FaCheck size={16} className="text-green-500" /> : <LinkIcon size={16} />}
            </button>
        </div>
    );
};

export default ShareButtons;
