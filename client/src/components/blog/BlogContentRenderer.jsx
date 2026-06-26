import { slugifyHeading } from "@/lib/blogContent";

const HEADING_SIZE_CLASSES = {
    2: "text-2xl sm:text-3xl mt-10 mb-4",
    3: "text-xl sm:text-2xl mt-8 mb-3",
    4: "text-lg sm:text-xl mt-6 mb-2",
};

const BlogContentRenderer = ({ blocks = [] }) => {
    let headingCount = 0;

    return (
        <div className="space-y-6">
            {blocks.map((block, index) => {
                const { type, data } = block;
                const key = block.id || index;

                switch (type) {
                    case "paragraph":
                        return (
                            <p
                                key={key}
                                className="text-[16px] leading-[1.8] text-[#374151]"
                                dangerouslySetInnerHTML={{ __html: data.text }}
                            />
                        );

                    case "header": {
                        const level = Math.min(Math.max(data.level || 2, 2), 4);
                        const id = slugifyHeading(data.text, headingCount++);
                        const Tag = `h${level}`;
                        return (
                            <Tag
                                key={key}
                                id={id}
                                className={`font-bold text-[#1b2430] scroll-mt-24 ${HEADING_SIZE_CLASSES[level]}`}
                                dangerouslySetInnerHTML={{ __html: data.text }}
                            />
                        );
                    }

                    case "list": {
                        const ListTag = data.style === "ordered" ? "ol" : "ul";
                        return (
                            <ListTag
                                key={key}
                                className={`pl-6 space-y-2 text-[16px] leading-[1.8] text-[#374151] ${data.style === "ordered" ? "list-decimal" : "list-disc"
                                    }`}
                            >
                                {data.items.map((item, i) => {
                                    const text = typeof item === "string" ? item : item.content;
                                    return <li key={i} dangerouslySetInnerHTML={{ __html: text }} />;
                                })}
                            </ListTag>
                        );
                    }

                    case "quote":
                        return (
                            <blockquote
                                key={key}
                                className="border-l-4 border-[#1365ff] bg-[#e5eff9]/50 rounded-r-xl px-6 py-4"
                            >
                                <p className="text-lg italic text-[#1b2430]" dangerouslySetInnerHTML={{ __html: data.text }} />
                                {data.caption && (
                                    <cite className="block mt-2 text-sm text-[#6e7b8d] not-italic">— {data.caption}</cite>
                                )}
                            </blockquote>
                        );

                    case "code":
                        return (
                            <pre
                                key={key}
                                className="bg-[#1b2430] text-[#e5eff9] rounded-xl p-5 overflow-x-auto text-sm leading-relaxed"
                            >
                                <code>{data.code}</code>
                            </pre>
                        );

                    case "delimiter":
                        return (
                            <div key={key} className="flex justify-center py-4">
                                <span className="text-2xl tracking-[1em] text-[#b7bdbd]">***</span>
                            </div>
                        );

                    case "table":
                        return (
                            <div key={key} className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {data.content.map((row, rowIndex) => {
                                            const isHeaderRow = data.withHeadings && rowIndex === 0;
                                            const CellTag = isHeaderRow ? "th" : "td";
                                            return (
                                                <tr key={rowIndex} className={isHeaderRow ? "bg-[#e5eff9]" : "border-t border-gray-100"}>
                                                    {row.map((cell, cellIndex) => (
                                                        <CellTag
                                                            key={cellIndex}
                                                            className={`px-4 py-3 text-left ${isHeaderRow ? "font-semibold text-[#1b2430]" : "text-[#374151]"
                                                                }`}
                                                            dangerouslySetInnerHTML={{ __html: cell }}
                                                        />
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        );

                    case "image":
                        return (
                            <figure key={key} className="my-6">
                                <img
                                    src={data.file?.url}
                                    alt={data.caption || ""}
                                    className={`w-full rounded-2xl mx-auto ${data.withBorder ? "border border-gray-200" : ""} ${data.withBackground ? "bg-gray-50 p-4" : ""
                                        }`}
                                />
                                {data.caption && (
                                    <figcaption
                                        className="text-center text-sm text-[#6e7b8d] mt-2"
                                        dangerouslySetInnerHTML={{ __html: data.caption }}
                                    />
                                )}
                            </figure>
                        );

                    case "embed":
                        return (
                            <div key={key} className="my-6">
                                <div className="relative w-full overflow-hidden rounded-2xl" style={{ paddingTop: "56.25%" }}>
                                    <iframe
                                        src={data.embed}
                                        title={data.caption || "Embedded content"}
                                        className="absolute inset-0 w-full h-full"
                                        allowFullScreen
                                    />
                                </div>
                                {data.caption && <p className="text-center text-sm text-[#6e7b8d] mt-2">{data.caption}</p>}
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default BlogContentRenderer;
