"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Toolbar from "./EditorToolbar";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";

import axios from "axios";

export default function TipTapEditor({ content, id }) {
    // const [text, setText] = useState(content || "");

    // const onChange = (html) => {
    //     setText(html);
    // };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false,
                orderedList: false,
            }),
            BulletList,
            OrderedList,
            ListItem,
            Underline,
            Image.configure({
                inline: false, // image as block
                allowBase64: true, // allows pasted images
            }),
            Placeholder.configure({
                placeholder: "Start typing...",
                showOnlyWhenEditable: true,
                showOnlyCurrent: false,
            }),
        ],
        content: content || "",
        immediatelyRender: false,
    });

    if (!editor) return null;

    async function save() {
        console.log("Saved content:", editor.getHTML());
        try {
            const res = await axios.post("/api/Category/addDetails", {
                details: editor.getHTML(),
                id: id,
            });
            console.log("Save response:", res.data);
        } catch (error) {
            console.error("Error saving content:", error);
        }
    }

    return (
        <div className="border rounded p-2">
            <style>{`
            .ProseMirror ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.ProseMirror ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
}

.ProseMirror li {
  margin: 0.25rem 0;
}

.ProseMirror {
  padding: 16px;          /* 👈 padding inside editor */
  min-height: 240px;      /* 👈 controls “rows” */
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  float: left;
  height: 0;
  pointer-events: none;
}

.ProseMirror h1 {
  font-size: 2rem;     /* big */
  font-weight: 700;      /* bold */
  line-height: 1.2;
  margin: 1rem 0 0.75rem;
}

.ProseMirror h2 {
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0.75rem 0 0.5rem;
}
.ProseMirror h3 {
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  line-height: 1.4;
  margin: 0.75rem 0 0.5rem;
}

.ProseMirror h4 {
  font-size: 1.25rem; /* 20px */
  font-weight: 500;
  line-height: 1.4;
  margin: 0.5rem 0 0.25rem;
}

.ProseMirror h5 {
  font-size: 1.125rem; /* 18px */
  font-weight: 500;
  line-height: 1.5;
  margin: 0.5rem 0 0.25rem;
}

.ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 1rem 0;
}



            `}</style>
            <div className="sticky top-15 bg-white! z-10 py-2">
                <Toolbar editor={editor} save={save} className="mb-2 " />
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
