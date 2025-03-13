'use client';

import { cn } from '@/lib/utils';
import { EditorContent, JSONContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface ViewerProps {
  content: JSONContent;
  style?: 'default' | 'prose';
  immediatelyRender?: boolean;
  className?: string;
}

const Viewer = ({ content, style, immediatelyRender = true, className }: ViewerProps) => {
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

  const classes: string = cn(style === 'prose' ? 'prose-mt-0 prose max-w-none dark:prose-invert' : '', className);

  return (
    <article className={classes}>
      <EditorContent editor={editor} readOnly={true} />
    </article>
  );
};

export default Viewer;
