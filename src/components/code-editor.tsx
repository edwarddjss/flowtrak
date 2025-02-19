'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Editor, { loader } from '@monaco-editor/react'
import { cn } from '@/lib/utils'
import { useThemeStorage } from '@/lib/hooks/use-theme-storage'

loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
})

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: string
  className?: string
  options?: Record<string, any>
}

const LANGUAGE_TEMPLATES = {
  javascript: `function solution(nums, target) {
  // Write your solution here
  
}`,
  typescript: `function solution(nums: number[], target: number): number[] {
  // Write your solution here
  return [];
}`,
  python: `def solution(nums: List[int], target: int) -> List[int]:
    # Write your solution here
    pass`,
  java: `class Solution {
    public int[] solution(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
  cpp: `class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`
}

const defaultEditorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  roundedSelection: true,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
  suggestOnTriggerCharacters: true,
  snippetSuggestions: 'on',
  parameterHints: { enabled: true },
  formatOnType: true,
  formatOnPaste: true,
  codeLens: true,
  showDeprecated: true,
  dragAndDrop: true,
  links: true,
  padding: { top: 16 },
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible',
    useShadows: true,
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10
  },
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
  renderLineHighlight: 'line',
  smoothScrolling: true,
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: true,
  fastScrollSensitivity: 5
}

export function CodeEditor({
  value,
  onChange,
  language,
  theme = 'vs-dark',
  className,
  options = {},
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current
      const model = editor.getModel()
      if (model) {
        // Add placeholder decoration
        const decorations = model.deltaDecorations([], [{
          range: new monaco.Range(2, 1, 2, 1),
          options: {
            after: {
              content: '    // Your code here',
              inlineClassName: 'code-editor-placeholder'
            }
          }
        }])

        // Remove placeholder when user starts typing
        const disposable = model.onDidChangeContent(() => {
          const lineContent = model.getLineContent(2)
          if (lineContent.trim().length > 0) {
            model.deltaDecorations(decorations, [])
            disposable.dispose()
          }
        })

        return () => {
          disposable.dispose()
        }
      }
    }
  }, [value])

  return (
    <div className={cn('relative w-full h-full min-h-[300px]', className)}>
      <Editor
        value={value}
        onChange={onChange}
        defaultLanguage={language}
        theme={theme}
        options={{
          fontSize: 14,
          lineHeight: 21,
          padding: { top: 10 },
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          ...options,
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor
          // Add CSS for placeholder
          const styleSheet = document.createElement('style')
          styleSheet.textContent = `
            .code-editor-placeholder {
              color: #6b7280 !important;
              font-style: italic;
            }
          `
          document.head.appendChild(styleSheet)
        }}
      />
    </div>
  )
}
