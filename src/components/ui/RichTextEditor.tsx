"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Maximize2,
  Minimize2,
  ChevronDown,
  Type,
  Check,
} from "lucide-react";

export interface EditorStats {
  words: number;
  chars: number;
  readTimeMinutes: number;
}

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (htmlContent: string) => void;
  onStatsChange?: (stats: EditorStats) => void;
  placeholder?: string;
  spellCheckEnabled?: boolean;
  onToggleSpellCheck?: () => void;
  onQuickSave?: () => void;
}

export default function RichTextEditor({
  initialValue = "",
  onChange,
  onStatsChange,
  placeholder = "Start drafting your editorial piece here...",
  spellCheckEnabled = true,
  onQuickSave,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>("p");
  const [selectedFont, setSelectedFont] = useState<string>("serif");
  const [activeAlign, setActiveAlign] = useState<"left" | "center" | "right" | "justify">("left");
  const [stats, setStats] = useState<EditorStats>({ words: 0, chars: 0, readTimeMinutes: 1 });
  const [isSynced, setIsSynced] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onStatsChangeRef = useRef(onStatsChange);
  useEffect(() => {
    onStatsChangeRef.current = onStatsChange;
  });

  const lastStatsRef = useRef<EditorStats>({ words: -1, chars: -1, readTimeMinutes: -1 });

  const calculateStats = useCallback((text: string) => {
    const trimmed = text.trim();
    const chars = trimmed.length;
    const words = trimmed ? (trimmed.match(/\S+/g) || []).length : 0;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    if (
      lastStatsRef.current.words === words &&
      lastStatsRef.current.chars === chars &&
      lastStatsRef.current.readTimeMinutes === readTimeMinutes
    ) {
      return;
    }

    const newStats = { words, chars, readTimeMinutes };
    lastStatsRef.current = newStats;
    setStats(newStats);
    if (onStatsChangeRef.current) {
      onStatsChangeRef.current(newStats);
    }
  }, []);

  // Update command states for active formatting buttons
  const updateActiveFormats = useCallback(() => {
    if (typeof document !== "undefined") {
      try {
        setFormatting({
          bold: document.queryCommandState("bold"),
          italic: document.queryCommandState("italic"),
          underline: document.queryCommandState("underline"),
        });
      } catch {
        // ignore in environments without queryCommandState support
      }
    }
  }, []);

  // Sync initial value once
  useEffect(() => {
    if (editorRef.current) {
      if (initialValue && editorRef.current.innerHTML !== initialValue) {
        editorRef.current.innerHTML = initialValue;
      }
      calculateStats(editorRef.current.innerText || "");
    }
  }, [initialValue, calculateStats]);

  // Execute browser document command
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleContentChange();
    updateActiveFormats();
  };

  const handleFormatChange = (tag: string) => {
    setSelectedFormat(tag);
    if (!editorRef.current) return;
    editorRef.current.focus();
    if (tag === "blockquote") {
      document.execCommand("formatBlock", false, "<blockquote>");
    } else {
      document.execCommand("formatBlock", false, `<${tag}>`);
    }
    handleContentChange();
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    if (!editorRef.current) return;
    editorRef.current.focus();
    if (font === "serif") {
      document.execCommand("fontName", false, "var(--font-serif, Georgia, serif)");
    } else if (font === "sans") {
      document.execCommand("fontName", false, "var(--font-sans, Inter, sans-serif)");
    } else if (font === "mono") {
      document.execCommand("fontName", false, "monospace");
    }
    handleContentChange();
  };

  const handleContentChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const text = editorRef.current.innerText || "";
    calculateStats(text);

    setIsSynced(false);
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      setIsSynced(true);
    }, 800);

    if (onChange) {
      onChange(html);
    }
  };

  // Keyboard shortcut listener (Cmd+S / Ctrl+S)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      setIsSynced(true);
      if (onQuickSave) {
        onQuickSave();
      }
    }
  };

  return (
    <div
      className={`border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl shadow-xs overflow-hidden flex flex-col transition-all ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none bg-white dark:bg-slate-900"
          : "w-full"
      }`}
    >
      {/* ── Sticky Formatting Toolbar ── */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 px-3 py-1.5 flex items-center justify-between gap-2 text-slate-700 dark:text-slate-300 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap flex-1">
          {/* Paragraph Format Dropdown */}
          <div className="relative inline-flex items-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md h-8 px-2.5 text-xs font-medium shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors shrink-0">
            <span className="text-slate-500 dark:text-slate-400 font-bold text-xs mr-1.5 font-mono">H</span>
            <select
              value={selectedFormat}
              onChange={(e) => handleFormatChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-4 appearance-none"
              title="Text Style"
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="blockquote">Quote Block</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-2" />
          </div>

          {/* Font Family Dropdown */}
          <div className="relative inline-flex items-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md h-8 px-2.5 text-xs font-medium shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors shrink-0">
            <Type className="w-3.5 h-3.5 mr-1.5 text-slate-500 dark:text-slate-400" />
            <select
              value={selectedFont}
              onChange={(e) => handleFontChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-4 appearance-none"
              title="Font Family"
            >
              <option value="serif">Serif</option>
              <option value="sans">Sans-Serif</option>
              <option value="mono">Monospace</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none absolute right-2" />
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />

          {/* Basic Formatting: B, I, U */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => executeCommand("bold")}
              className={`h-8 w-8 flex items-center justify-center rounded-md text-xs transition-colors cursor-pointer ${
                formatting.bold
                  ? "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              }`}
              title="Bold (Cmd+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("italic")}
              className={`h-8 w-8 flex items-center justify-center rounded-md text-xs transition-colors cursor-pointer ${
                formatting.italic
                  ? "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              }`}
              title="Italic (Cmd+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("underline")}
              className={`h-8 w-8 flex items-center justify-center rounded-md text-xs transition-colors cursor-pointer ${
                formatting.underline
                  ? "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              }`}
              title="Underline (Cmd+U)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />

          {/* Alignments */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                executeCommand("justifyLeft");
                setActiveAlign("left");
              }}
              className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                activeAlign === "left"
                  ? "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                executeCommand("justifyCenter");
                setActiveAlign("center");
              }}
              className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                activeAlign === "center"
                  ? "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                executeCommand("justifyRight");
                setActiveAlign("right");
              }}
              className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
                activeAlign === "right"
                  ? "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              }`}
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />

          {/* Lists & Quotes */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => executeCommand("insertUnorderedList")}
              className="h-8 w-8 flex items-center justify-center rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Bulleted List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("insertOrderedList")}
              className="h-8 w-8 flex items-center justify-center rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<blockquote>")}
              className={`h-8 w-8 flex items-center justify-center rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                selectedFormat === "blockquote" ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white" : ""
              }`}
              title="Blockquote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Fullscreen button */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors cursor-pointer shrink-0 ${
            isFullscreen
              ? "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800"
          }`}
          title={isFullscreen ? "Exit Full Screen" : "Full Screen / Zen Mode"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* ── Editable Canvas Area ── */}
      <div
        ref={editorRef}
        contentEditable
        spellCheck={spellCheckEnabled}
        onInput={handleContentChange}
        onBlur={handleContentChange}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        onKeyDown={handleKeyDown}
        className="font-editorial-body text-slate-800 dark:text-slate-100 px-5 sm:px-8 md:px-10 py-6 sm:py-8 min-h-[380px] sm:min-h-[440px] focus:outline-none selection:bg-slate-200 dark:selection:bg-slate-800 overflow-y-auto leading-relaxed font-serif text-base sm:text-lg custom-editor-scrollbar prose prose-slate max-w-none flex-1 placeholder:text-slate-400 placeholder:italic"
        data-placeholder={placeholder}
      />

      {/* ── Editor Status Footer ── */}
      <footer className="hidden sm:flex h-9 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/50 text-[11px] text-slate-500 dark:text-slate-400 items-center justify-between flex-shrink-0 select-none">
        <div className="flex items-center space-x-3">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {stats.words} {stats.words === 1 ? "word" : "words"}
          </span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>{stats.chars.toLocaleString()} characters</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>~{stats.readTimeMinutes} min read</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span>⌘ S to quick-save</span>
          </div>

          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
            {isSynced ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Synced</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Editing…</span>
              </>
            )}
          </span>
        </div>
      </footer>
    </div>
  );
}
