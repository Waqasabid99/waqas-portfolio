"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function TagInput({ value = [], onChange }) {
    const [draft, setDraft] = useState("");

    const addTag = () => {
        const tag = draft.trim();
        if (!tag) return;
        if (!value.includes(tag)) onChange([...value, tag]);
        setDraft("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 focus-within:border-[#1365ff] transition">
            {value.map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-[#e5eff9] text-[#1365ff] text-sm px-3 py-1 rounded-full">
                    {tag}
                    <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} className="hover:text-red-500">
                        <X size={12} />
                    </button>
                </span>
            ))}
            <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addTag}
                placeholder={value.length ? "" : "Add tags…"}
                className="flex-1 min-w-[100px] outline-none text-sm py-1"
            />
        </div>
    );
}
