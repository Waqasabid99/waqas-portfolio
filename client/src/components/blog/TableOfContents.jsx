"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const TableOfContents = ({ headings = [] }) => {
    const [activeId, setActiveId] = useState(headings[0]?.id);

    useEffect(() => {
        if (!headings.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                });
            },
            { rootMargin: "-100px 0px -70% 0px" }
        );

        headings.forEach((h) => {
            const el = document.getElementById(h.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length < 2) return null;

    return (
        <nav className="sticky top-28 hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6e7b8d] mb-3">On this page</p>
            <ul className="space-y-2 border-l border-gray-200">
                {headings.map((h) => (
                    <li key={h.id} style={{ paddingLeft: `${(h.level - 2) * 12 + 12}px` }}>
                        <Link
                            href={`#${h.id}`}
                            className={`block text-sm py-0.5 -ml-px border-l-2 pl-3 transition-colors ${activeId === h.id
                                ? "border-[#1365ff] text-[#1365ff] font-medium"
                                : "border-transparent text-[#6e7b8d] hover:text-[#1b2430]"
                                }`}
                        >
                            {h.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TableOfContents;