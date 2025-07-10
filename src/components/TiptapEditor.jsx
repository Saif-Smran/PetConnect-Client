import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaUndo,
  FaRedo,
  FaLink,
  FaCode
} from 'react-icons/fa';

const TiptapEditor = ({ content, onChange, placeholder = "Start writing..." }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 bg-base-100 rounded-lg',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-base-content/20 rounded-lg overflow-hidden bg-base-100 shadow-sm">
      {/* Toolbar */}
      <div className="border-b border-base-content/10 p-2 bg-base-200/50">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex border-r border-base-content/10 pr-2 mr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`btn btn-ghost btn-sm ${
                editor.isActive('bold') ? 'bg-primary text-primary-content' : ''
              }`}
              title="Bold"
            >
              <FaBold />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`btn btn-ghost btn-sm ${
                editor.isActive('italic') ? 'bg-primary text-primary-content' : ''
              }`}
              title="Italic"
            >
              <FaItalic />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`btn btn-ghost btn-sm ${
                editor.isActive('underline') ? 'bg-primary text-primary-content' : ''
              }`}
              title="Underline"
            >
              <FaUnderline />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`btn btn-ghost btn-sm ${
                editor.isActive('strike') ? 'bg-primary text-primary-content' : ''
              }`}
              title="Strikethrough"
            >
              <FaStrikethrough />
            </button>
          </div>

          {/* Lists */}
          <div className="flex border-r border-base-content/10 pr-2 mr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`btn btn-ghost btn-sm ${
                editor.isActive('bulletList') ? 'bg-primary text-primary-content' : ''
              }`}
              title="Bullet List"
            >
              <FaListUl />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`btn btn-ghost btn-sm ${
                editor.isActive('orderedList') ? 'bg-primary text-primary-content' : ''
              }`}
              title="Numbered List"
            >
              <FaListOl />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex border-r border-base-content/10 pr-2 mr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`btn btn-ghost btn-sm ${
                editor.isActive({ textAlign: 'left' }) ? 'bg-primary text-primary-content' : ''
              }`}
              title="Align Left"
            >
              <FaAlignLeft />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`btn btn-ghost btn-sm ${
                editor.isActive({ textAlign: 'center' }) ? 'bg-primary text-primary-content' : ''
              }`}
              title="Align Center"
            >
              <FaAlignCenter />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`btn btn-ghost btn-sm ${
                editor.isActive({ textAlign: 'right' }) ? 'bg-primary text-primary-content' : ''
              }`}
              title="Align Right"
            >
              <FaAlignRight />
            </button>
          </div>

          {/* Quote and Code */}
          <div className="flex border-r border-base-content/10 pr-2 mr-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`btn btn-ghost btn-sm ${
                editor.isActive('blockquote') ? 'bg-primary text-primary-content' : ''
              }`}
              title="Quote"
            >
              <FaQuoteLeft />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`btn btn-ghost btn-sm ${
                editor.isActive('code') ? 'bg-primary text-primary-content' : ''
              }`}
              title="Inline Code"
            >
              <FaCode />
            </button>
          </div>

          {/* Links */}
          <div className="flex border-r border-base-content/10 pr-2 mr-2">
            <button
              type="button"
              onClick={addLink}
              className={`btn btn-ghost btn-sm ${
                editor.isActive('link') ? 'bg-primary text-primary-content' : ''
              }`}
              title="Add Link"
            >
              <FaLink />
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="flex">
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              className="btn btn-ghost btn-sm"
              title="Undo"
            >
              <FaUndo />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              className="btn btn-ghost btn-sm"
              title="Redo"
            >
              <FaRedo />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
        {editor.isEmpty && (
          <div className="absolute top-4 left-4 text-base-content/50 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default TiptapEditor;
