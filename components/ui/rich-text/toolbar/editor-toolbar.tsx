import { Editor } from '@tiptap/react';
import { Bold, Code, Italic, List, ListOrdered, Minus, Quote, Redo, Strikethrough, Undo } from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, Toolbar } from '@/components/ui/toolbar';

import { FormatType } from './format-type';

interface EditorToolbarProps {
  editor: Editor;
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  return (
    <Toolbar className="m-0 flex items-center justify-between p-2" aria-label="Formatting options">
      <ToggleGroup className="flex flex-row items-center" type="multiple">
        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          pressed={editor.isActive('bold')}
          tabIndex={0}
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          pressed={editor.isActive('italic')}
          value="italic"
          tabIndex={0}
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          pressed={editor.isActive('strike')}
          tabIndex={0}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          pressed={editor.isActive('bulletList')}
          tabIndex={0}
        >
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          pressed={editor.isActive('orderedList')}
          tabIndex={0}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
          pressed={editor.isActive('codeBlock')}
          tabIndex={0}
        >
          <Code className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          pressed={editor.isActive('blockquote')}
          tabIndex={0}
        >
          <Quote className="h-4 w-4" />
        </Toggle>

        <Toggle size="sm" className="mr-1" onPressedChange={() => editor.chain().focus().setHorizontalRule().run()} tabIndex={0}>
          <Minus className="h-4 w-4" />
        </Toggle>

        <FormatType editor={editor} />
      </ToggleGroup>

      <ToggleGroup className="flex flex-row items-center invisible sm:visible" type="multiple">
        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          tabIndex={0}
        >
          <Undo className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          className="mr-1"
          onPressedChange={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          tabIndex={0}
        >
          <Redo className="h-4 w-4" />
        </Toggle>
      </ToggleGroup>
    </Toolbar>
  );
};

export default EditorToolbar;
