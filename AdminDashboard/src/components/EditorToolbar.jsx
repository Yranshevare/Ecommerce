import { useEditorState } from "@tiptap/react";
import {
    Bold,
    CloudCheck,
    Italic,
    List,
    ImageIcon,
    ListOrdered,
    Redo2,
    Strikethrough,
    Underline,
    Undo2,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
} from "lucide-react";
import { Button } from "./ui/button";

export default function Toolbar({ editor, save }) {
    if (!editor) return null;

    useEditorState({
        editor,
        selector: ({ editor }) => editor.state,
    });

    const addImage = () => {
        // Create an invisible file input
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*"; // only images
        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            // Convert to base64
            const reader = new FileReader();
            reader.onload = () => {
                const src = reader.result; // this is base64
                editor.chain().focus().setImage({ src }).run();
            };
            reader.readAsDataURL(file);
        };
        input.click(); // open file manager
    };

    const btn = (active) =>
        `px-2 py-1 border rounded text-sm transition
     ${active ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`;

    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2 border-b p-2">
                {/* Headings */}
                <button
                    className={btn(editor.isActive("heading", { level: 1 }))}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 size={15} />
                </button>

                <button
                    className={btn(editor.isActive("heading", { level: 2 }))}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 size={15} />
                </button>
                <button
                    className={btn(editor.isActive("heading", { level: 3 }))}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 size={15} />
                </button>

                <button
                    className={btn(editor.isActive("heading", { level: 4 }))}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                >
                    <Heading4 size={15} />
                </button>
                <button
                    className={btn(editor.isActive("heading", { level: 5 }))}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                >
                    <Heading5 size={15} />
                </button>

                {/* Text */}
                <button className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
                    <Bold size={15} />
                </button>

                <button className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <Italic size={15} />
                </button>

                <button className={btn(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                    <Underline size={15} />
                </button>

                <button className={btn(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()}>
                    <Strikethrough size={15} />
                </button>

                {/* Lists */}
                <button className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    <List size={15} />
                </button>

                <button className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered size={15} />
                </button>

                <button className={btn(false)} onClick={addImage}>
                    <ImageIcon size={15} />
                </button>

                {/* Actions */}
                <button className="px-2 py-1 border rounded text-sm" onClick={() => editor.chain().focus().undo().run()}>
                    <Undo2 size={15} />
                </button>

                <button className="px-2 py-1 border rounded text-sm" onClick={() => editor.chain().focus().redo().run()}>
                    <Redo2 size={15} />
                </button>
            </div>

            <Button onClick={save} variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white cursor-pointer">
                <CloudCheck className="mr-2 h-6 w-6" />
                Save
            </Button>
        </div>
    );
}
