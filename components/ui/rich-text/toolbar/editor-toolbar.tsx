import { Editor } from '@tiptap/react';
import { Bold, Code, Italic, List, ListOrdered, Minus, MoreHorizontal, Quote, Redo, Strikethrough, Undo } from 'lucide-react';
import { ReactNode } from 'react';

import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, Toolbar } from '@/components/ui/toolbar';

import { Button } from '../../button';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';
import { FormatType } from './format-type';

type ToolType = 'select' | 'group' | 'toggle' | 'button';

interface BaseTool {
  type: ToolType;
  priority: number;
}

interface GroupTool extends BaseTool {
  type: 'group';
  components: ComponentTool[];
}

interface ComponentTool extends BaseTool {
  type: 'select' | 'toggle' | 'button';
  component: ReactNode;
}

type Tool = GroupTool | ComponentTool;

interface EditorToolbarProps {
  editor: Editor;
  containerWidth: number;
}

const widths: Record<ToolType, number> = {
  select: 120,
  toggle: 36,
  button: 36,
  group: 0, // Groups don't have a direct width, they're calculated from their components
} as const;

const EditorToolbar = ({ editor, containerWidth }: EditorToolbarProps) => {
  const tools: Tool[] = [
    {
      type: 'select',
      priority: 1,
      component: <FormatType key="type" editor={editor} />,
    },
    {
      type: 'group',
      priority: 2,
      components: [
        {
          type: 'toggle',
          priority: 2,
          component: (
            <Toggle
              key="bold"
              size="sm"
              className="mr-1"
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              pressed={editor.isActive('bold')}
              tabIndex={0}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
          ),
        },
        {
          type: 'toggle',
          priority: 2,
          component: (
            <Toggle
              key="italic"
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
          ),
        },
        {
          type: 'toggle',
          priority: 4,
          component: (
            <Toggle
              key="strikethrough"
              size="sm"
              className="mr-1"
              onPressedChange={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              pressed={editor.isActive('strike')}
              tabIndex={0}
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>
          ),
        },
      ],
    },
    {
      type: 'group',
      priority: 3,
      components: [
        {
          type: 'toggle',
          priority: 3,
          component: (
            <Toggle
              key="bullet-list"
              size="sm"
              className="mr-1"
              onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
              pressed={editor.isActive('bulletList')}
              tabIndex={0}
            >
              <List className="h-4 w-4" />
            </Toggle>
          ),
        },
        {
          type: 'toggle',
          priority: 3,
          component: (
            <Toggle
              key="ordered-list"
              size="sm"
              className="mr-1"
              onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
              pressed={editor.isActive('orderedList')}
              tabIndex={0}
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
          ),
        },
      ],
    },
    {
      type: 'group',
      priority: 4,
      components: [
        {
          type: 'toggle',
          priority: 4,
          component: (
            <Toggle
              key="code-block"
              size="sm"
              className="mr-1"
              onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
              pressed={editor.isActive('codeBlock')}
              tabIndex={0}
            >
              <Code className="h-4 w-4" />
            </Toggle>
          ),
        },
        {
          type: 'toggle',
          priority: 4,
          component: (
            <Toggle
              key="blockquote"
              size="sm"
              className="mr-1"
              onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
              pressed={editor.isActive('blockquote')}
              tabIndex={0}
            >
              <Quote className="h-4 w-4" />
            </Toggle>
          ),
        },
      ],
    },
    {
      type: 'button',
      priority: 4,
      component: (
        <Button
          key="horizontal-rule"
          size="sm"
          className="mr-1"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            console.log('setHorizontalRule');
            editor.chain().focus().setHorizontalRule().run();
          }}
          tabIndex={0}
        >
          <Minus className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const undoRedoWidth = 72;
  const totalWidth = tools.reduce((acc, tool) => {
    if (tool.type === 'group') {
      return acc + tool.components.reduce((acc, component) => acc + widths[component.type], 0);
    }

    return acc + widths[tool.type];
  }, 0);
  const needsFloatingTools = containerWidth < totalWidth + undoRedoWidth;

  const room = containerWidth - undoRedoWidth - 40 - 8;

  const calcedStaticTools = calculateStaticTools(tools, room);
  const staticTools = needsFloatingTools ? calcedStaticTools : tools;

  const floatingTools = calculateFloatingTools(tools, staticTools);

  return (
    <Toolbar className="m-0 flex items-center justify-between p-2" aria-label="Formatting options">
      <ToggleGroup className="flex flex-row items-center" type="multiple">
        {staticTools.map((tool) => {
          if (tool.type === 'group') {
            return tool.components.map((tool) => tool.component);
          }

          return tool.component;
        })}
        {needsFloatingTools && (
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="ghost" className="focus:bg-transparent hover:bg-transparent focus:text-foreground hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Toolbar className="m-0 flex items-center justify-between p-2" aria-label="Floating tools">
                <ToggleGroup className="flex flex-row items-center" type="multiple">
                  {floatingTools.map((tool) => {
                    if (tool.type === 'group') {
                      return tool.components.map((component) => component.component);
                    }

                    return tool.component;
                  })}
                </ToggleGroup>
              </Toolbar>
            </PopoverContent>
          </Popover>
        )}
      </ToggleGroup>

      <ToggleGroup className="flex flex-row items-center" type="multiple">
        <Button
          size="sm"
          className="mr-1"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          disabled={!editor.can().chain().focus().undo().run()}
          tabIndex={0}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          className="mr-1"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          disabled={!editor.can().chain().focus().redo().run()}
          tabIndex={0}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </ToggleGroup>
    </Toolbar>
  );
};

export default EditorToolbar;

function calculateStaticTools(tools: Tool[], room: number): Tool[] {
  // Helper function to calculate total width of tools
  const calculateWidth = (tools: Tool[]): number => {
    return tools.reduce((acc, tool) => {
      if (tool.type === 'group') {
        return acc + tool.components.reduce((acc, component) => acc + widths[component.type], 0);
      }
      return acc + widths[tool.type];
    }, 0);
  };

  // Helper function to filter tools by priority
  const filterByPriority = (tools: Tool[], maxPriority: number): Tool[] => {
    return tools
      .map((tool) => {
        if (tool.type === 'group') {
          const filteredComponents = tool.components.filter((component) => component.priority < maxPriority);
          if (filteredComponents.length === 0) return null;
          return {
            ...tool,
            components: filteredComponents,
          };
        }
        return tool.priority < maxPriority ? tool : null;
      })
      .filter((tool): tool is Tool => tool !== null);
  };

  // Try removing tools by priority, starting from lowest (4) to highest (1)
  for (let priority = 4; priority > 0; priority--) {
    const filteredTools = filterByPriority(tools, priority);
    const width = calculateWidth(filteredTools);
    if (width < room) {
      return filteredTools;
    }
  }

  // If we get here, even removing all priority 1 items didn't fit
  // Return an empty array as a fallback
  return [];
}

function calculateFloatingTools(tools: Tool[], staticTools: Tool[]): Tool[] {
  const floatingTools: Tool[] = [];

  for (const tool of tools) {
    const staticTool = staticTools.find((st) => st.type === tool.type && st.priority === tool.priority);

    if (!staticTool) {
      // If the tool doesn't exist in staticTools at all, add it
      floatingTools.push(tool);
    } else if (tool.type === 'group' && staticTool.type === 'group') {
      // For groups, we need to compare their components
      const missingComponents = tool.components.filter((component) => !staticTool.components.some((sc) => sc.priority === component.priority));

      if (missingComponents.length > 0) {
        // Only add the group if it has missing components
        floatingTools.push({
          ...tool,
          components: missingComponents,
        });
      }
    }
  }

  return floatingTools;
}
