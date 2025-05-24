import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import useMeasure from 'react-use-measure';
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
        tabindex: '1',
      },
    },
    immediatelyRender,
  });
  const [ref, bounds] = useMeasure();

  if (!editor) return <></>;

  return (
    <div ref={ref} className="prose max-w-none w-full border border-input bg-background dark:prose-invert rounded-md">
      <EditorToolbar editor={editor} containerWidth={bounds.width} />
      <div className="editor">
        <EditorContent editor={editor} placeholder={placeholder} className="px-4 min-h-[200px]" />
      </div>
    </div>
  );
};

export default Editor;
