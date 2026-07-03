"use client";

import { useState, useRef } from "react";
import { 
  Heading1, Heading2, Heading3, List, ListOrdered, 
  Quote, Link as LinkIcon, Image as ImageIcon, Table, Code, 
  Video, Eye, Edit2, Info
} from "lucide-react";
import { parseMarkdown } from "@/lib/markdown";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function RichTextEditor({ value, onChange, placeholder = "Write your content here in Markdown...", rows = 12 }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = before + (selectedText || "text") + after;

    onChange(text.substring(0, start) + replacement + text.substring(end));
    
    // Focus back and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selectedText || "text").length);
    }, 0);
  };

  const getToolbarActions = () => [
    { icon: Heading1, title: "Heading 1", onClick: () => insertText("# ", "\n") },
    { icon: Heading2, title: "Heading 2", onClick: () => insertText("## ", "\n") },
    { icon: Heading3, title: "Heading 3", onClick: () => insertText("### ", "\n") },
    { type: "divider" },
    { icon: List, title: "Unordered List", onClick: () => insertText("- ", "\n") },
    { icon: ListOrdered, title: "Ordered List", onClick: () => insertText("1. ", "\n") },
    { type: "divider" },
    { icon: Quote, title: "Blockquote", onClick: () => insertText("> ", "\n") },
    { icon: Info, title: "Callout Box", onClick: () => insertText("> [!NOTE]\n> ", "\n") },
    { type: "divider" },
    { icon: LinkIcon, title: "Insert Link", onClick: () => insertText("[", "](https://example.com)") },
    { icon: ImageIcon, title: "Insert Image", onClick: () => insertText("![Image Description](", "/assets/apartment_render.png)") },
    { icon: Table, title: "Insert Table", onClick: () => insertText("\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n") },
    { icon: Code, title: "Code Block", onClick: () => insertText("```javascript\n", "\n```") },
    { icon: Video, title: "YouTube Video", onClick: () => insertText("@[youtube](", "dQw4w9WgXcQ)") },
  ];

  return (
    <div className="border border-luxury-border/30 rounded-xl overflow-hidden bg-luxury-dark">
      {/* Editor Header / Tab Switcher */}
      <div className="flex items-center justify-between border-b border-luxury-border/20 px-4 py-2 bg-luxury-charcoal/20 shrink-0">
        <div className="flex gap-2 select-none">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeTab === "write"
                ? "bg-luxury-gold text-luxury-charcoal"
                : "text-gray-400 hover:text-white hover:bg-luxury-charcoal/50"
            }`}
          >
            <Edit2 className="w-3 h-3" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
              activeTab === "preview"
                ? "bg-luxury-gold text-luxury-charcoal"
                : "text-gray-400 hover:text-white hover:bg-luxury-charcoal/50"
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Live Preview</span>
          </button>
        </div>

        <span className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold font-mono">
          Markdown Editor
        </span>
      </div>

      {activeTab === "write" ? (
        <div className="flex flex-col">
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap gap-1 items-center px-4 py-2 border-b border-luxury-border/20 bg-luxury-charcoal/10 select-none">
            {getToolbarActions().map((action, idx) => {
              if (action.type === "divider") {
                return <div key={`div-${idx}`} className="w-[1px] h-4 bg-luxury-border/30 mx-1.5" />;
              }
              const Icon = action.icon!;
              return (
                <button
                  key={`act-${idx}`}
                  type="button"
                  onClick={action.onClick}
                  title={action.title}
                  className="p-2 rounded hover:bg-luxury-charcoal/50 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          {/* Text Editor Area */}
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#1f232c] px-6 py-4 text-xs text-gray-200 placeholder-gray-600 focus:outline-none resize-y min-h-[250px] font-mono leading-relaxed"
          />
        </div>
      ) : (
        /* Live Preview Mode Area */
        <div className="bg-[#1f232c] px-8 py-8 min-h-[310px] overflow-y-auto max-h-[500px]">
          {value.trim() ? (
            <div className="prose prose-invert max-w-none space-y-4">
              {parseMarkdown(value)}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[250px] text-gray-600 text-xs italic">
              Nothing to preview. Write some content first.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
