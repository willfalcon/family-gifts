'use client';

import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface ViewerProps {
  content: JSONContent;
  style?: 'default' | 'prose';
  immediatelyRender?: boolean;
}

const Viewer = ({ content, style, immediatelyRender = true }: ViewerProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
    immediatelyRender,
    editorProps: {
      attributes: {
        class: 'prose-p:my-2',
      },
    },
  });

  if (!editor) return <></>;

  const className: string = style === 'prose' ? 'prose-mt-0 prose max-w-none dark:prose-invert' : '';

  return (
    <article className={className}>
      <EditorContent editor={editor} readOnly={true} />
    </article>
  );
};

export default Viewer;
