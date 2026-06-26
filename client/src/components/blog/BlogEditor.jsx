"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const UPLOAD_ENDPOINT = `${API_BASE_URL}/admin/blogs/upload-image`;
const DELETE_ENDPOINT = `${API_BASE_URL}/admin/blogs/delete-image`;

function extractImagePublicIds(data) {
  const ids = new Set();
  (data?.blocks || []).forEach((block) => {
    if (block.type === "image" && block.data?.file?.public_id) {
      ids.add(block.data.file.public_id);
    }
  });
  return ids;
}

function deleteRemoteImage(publicId) {
  fetch(DELETE_ENDPOINT, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_id: publicId }),
  }).catch((err) => console.error("Failed to delete removed image:", err));
}

const BlogContentEditor = forwardRef(function BlogContentEditor(
  { initialData, holderId = "blog-content-editor" },
  ref
) {
  const editorInstanceRef = useRef(null);
  const knownImagePublicIdsRef = useRef(new Set());
  const isReadyRef = useRef(false);

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (!editorInstanceRef.current) return null;
      return await editorInstanceRef.current.save();
    },
  }));

  useEffect(() => {
    let editor;

    (async () => {
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const Header = (await import("@editorjs/header")).default;
      const ListTool = (await import("@editorjs/list")).default;
      const Quote = (await import("@editorjs/quote")).default;
      const CodeTool = (await import("@editorjs/code")).default;
      const InlineCode = (await import("@editorjs/inline-code")).default;
      const Marker = (await import("@editorjs/marker")).default;
      const Delimiter = (await import("@editorjs/delimiter")).default;
      const ImageTool = (await import("@editorjs/image")).default;
      const Table = (await import("@editorjs/table")).default;
      const EmbedTool = (await import("@editorjs/embed")).default;

      editor = new EditorJS({
        holder: holderId,
        placeholder: "Start writing your post…",
        data: initialData?.blocks ? initialData : { blocks: [] },
        autofocus: false,
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: { levels: [2, 3, 4], defaultLevel: 2 },
          },
          list: { class: ListTool, inlineToolbar: true },
          quote: { class: Quote, inlineToolbar: true },
          code: CodeTool,
          inlineCode: InlineCode,
          marker: Marker,
          delimiter: Delimiter,
          table: { class: Table, inlineToolbar: true },
          embed: EmbedTool,
          image: {
            class: ImageTool,
            config: {
              field: "image", // must match uploadSingleImage("image") on the backend
              uploader: {
                async uploadByFile(file) {
                  const formData = new FormData();
                  formData.append("image", file);

                  const res = await fetch(UPLOAD_ENDPOINT, {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                  });

                  const data = await res.json();
                  if (!res.ok || !data.success) {
                    throw new Error(data.message || "Image upload failed");
                  }
                  return data; // { success: 1, file: { url, public_id } }
                },
              },
            },
          },
        },
        onChange: async (api) => {
          if (!isReadyRef.current) return;
          const output = await api.saver.save();
          const currentIds = extractImagePublicIds(output);
          const removedIds = [...knownImagePublicIdsRef.current].filter(
            (id) => !currentIds.has(id)
          );
          knownImagePublicIdsRef.current = currentIds;
          removedIds.forEach(deleteRemoteImage);
        },
      });

      await editor.isReady;
      editorInstanceRef.current = editor;
      knownImagePublicIdsRef.current = extractImagePublicIds(initialData);
      isReadyRef.current = true;
    })();

    return () => {
      isReadyRef.current = false;
      if (editorInstanceRef.current?.destroy) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id={holderId}
      className="min-h-[400px] rounded-2xl border border-gray-200 px-6 py-5 [&_.ce-block__content]:max-w-none `[&_.codex-editor__redactor]:!pb-4`"
    />
  );
});

export default BlogContentEditor;
