import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Editor, {loader} from "@monaco-editor/react";

interface CodeEditorProps {
    code: string;
    onChange: (value: string) => void;
    isLoading?: boolean;
  }

const pastelTheme = {
    base: 'vs-dark' as const,
    inherit: true,
    rules: [
        { token: 'comment', foreground: '#a6c0a6', fontStyle: 'italic' },
        { token: 'keyword', foreground: '#f0a8c0' },  // pastel pink
        { token: 'string', foreground: '#b4e8b4' },   // pastel green
        { token: 'number', foreground: '#c2d8f0' },   // pastel blue
        { token: 'function', foreground: '#f0cfa8' }, // pastel orange
    ],
    colors: {
        'editor.background': '#2a2a2a',               // darker background for contrast
        'editor.foreground': '#e8e8e8',              // light text
        'editor.lineHighlightBackground': '#3a3a3a',  // slightly lighter than background
        'editor.selectionBackground': '#4a4a4a',
        'editorCursor.foreground': '#f0a8c0',        // pastel pink cursor
        'editorLineNumber.foreground': '#888888',
        'editorLineNumber.activeForeground': '#f0a8c0',
    }
};
  
const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, isLoading }) => {
    const [isEditorReady, setIsEditorReady] = useState(false);
  
    useEffect(() => {
      loader.init().then(monaco => {
        monaco.editor.defineTheme('pastelTheme', pastelTheme);
      });
    }, []);
  
    return (
      <div className="rounded-lg overflow-hidden border border-gray-700 h-full min-h-[300px]">
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="pastelTheme"
          value={code}
          onChange={(value) => onChange(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            tabSize: 4,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: "on",
            showUnused: true,
            folding: true,
            dragAndDrop: true,
            formatOnPaste: true,
            formatOnType: true,
            padding: { top: 16, bottom: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: "on",
          }}
          onMount={() => setIsEditorReady(true)}
          loading={
            <div className="h-full min-h-[300px] bg-gray-900 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          }
        />
      </div>
    );
  };
  
export { CodeEditor };