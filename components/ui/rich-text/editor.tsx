import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import EditorToolbar from './toolbar/editor-toolbar';

interface EditorProps {
  content: object;
  placeholder?: string;
  onChange: (value: object) => void;
  className?: string;
  immediatelyRender?: boolean;
}

const Editor = ({ content, placeholder, onChange, immediatelyRender = true }: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[200px] prose-p:my-2',
      },
    },
    immediatelyRender,
  });

  if (!editor) return <></>;

  return (
    <div className="prose max-w-none w-full border border-input bg-background dark:prose-invert">
      <EditorToolbar editor={editor} />
      <div className="editor">
        <EditorContent editor={editor} placeholder={placeholder} className="px-4 min-h-[200px]" />
      </div>
    </div>
  );
};

export default Editor;
