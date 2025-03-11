import React, { useState, useRef, useEffect } from 'react';

interface SelectionEditorProps {
  previewUrl: string;
  onEdit: (selection: string, replacement: string) => void;
  onAiEdit: (selection: string, prompt: string) => Promise<void>;
  version: number;
  onVersionChange: (version: number) => void;
  onDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function SelectionEditor({ 
  previewUrl, 
  onEdit, 
  onAiEdit, 
  version,
  onVersionChange,
  onDownload,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: SelectionEditorProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<string>('');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
  const [isAiMode, setIsAiMode] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [editText, setEditText] = useState('');
  const [showElementOutline, setShowElementOutline] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'selection') {
        const { text, x, y, elementPath } = event.data;
        setSelection(text);
        setSelectedElement(elementPath);
        setEditorPosition({ x, y });
        setShowEditor(true);
        setEditText(text);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (iframeRef.current) {
      // Inject selection handler script into iframe
      const script = `
        document.addEventListener('mouseup', function(e) {
          const selection = window.getSelection();
          if (selection && selection.toString().trim()) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            // Get the element path
            let element = e.target;
            let path = [];
            while (element && element.tagName) {
              let selector = element.tagName.toLowerCase();
              if (element.id) {
                selector += '#' + element.id;
              } else if (element.className) {
                selector += '.' + Array.from(element.classList).join('.');
              }
              path.unshift(selector);
              element = element.parentElement;
            }
            
            window.parent.postMessage({
              type: 'selection',
              text: selection.toString(),
              elementPath: path.join(' > '),
              x: rect.left + rect.width / 2,
              y: rect.bottom
            }, '*');
          }
        });

        // Add hover effect for elements
        document.addEventListener('mouseover', function(e) {
          const target = e.target;
          if (target.style) {
            target.dataset.originalOutline = target.style.outline;
            target.style.outline = '2px solid #4f46e5';
          }
        });

        document.addEventListener('mouseout', function(e) {
          const target = e.target;
          if (target.style) {
            target.style.outline = target.dataset.originalOutline || '';
          }
        });

        // Make content editable
        document.body.style.cursor = 'text';
        document.body.style.userSelect = 'text';
      `;

      iframeRef.current.onload = () => {
        const doc = iframeRef.current?.contentDocument;
        if (doc) {
          const scriptEl = doc.createElement('script');
          scriptEl.textContent = script;
          doc.body.appendChild(scriptEl);
        }
      };
    }
  }, [iframeRef]);

  const handleEdit = async () => {
    if (isAiMode) {
      await onAiEdit(selection, prompt);
    } else {
      onEdit(selection, editText);
    }
    setShowEditor(false);
    setPrompt('');
    setEditText('');
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            title="Undo"
          >
            ↩
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            title="Redo"
          >
            ↪
          </button>
          <select
            value={version}
            onChange={(e) => onVersionChange(Number(e.target.value))}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value={1}>Version 1</option>
            <option value={2}>Version 2</option>
            <option value={3}>Version 3</option>
          </select>
        </div>
        <button
          onClick={onDownload}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500"
        >
          Download Code
        </button>
      </div>

      <div className="pt-12 h-full">
        <iframe
          ref={iframeRef}
          src={previewUrl}
          className="w-full h-full border-0"
          title="Preview"
        />
      </div>
      
      {showEditor && (
        <div
          ref={editorRef}
          className="absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 min-w-[300px]"
          style={{
            left: `${editorPosition.x}px`,
            top: `${editorPosition.y + 10}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex justify-between mb-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setIsAiMode(false)}
                className={`px-3 py-1 rounded ${!isAiMode ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                Direct Edit
              </button>
              <button
                onClick={() => setIsAiMode(true)}
                className={`px-3 py-1 rounded ${isAiMode ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                AI Edit
              </button>
            </div>
            <button
              onClick={() => setShowEditor(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {selectedElement && (
            <div className="mb-2 text-xs text-gray-500 dark:text-gray-400 break-all">
              Selected: {selectedElement}
            </div>
          )}

          {isAiMode ? (
            <div className="space-y-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how you want to modify this selection..."
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Suggestions:
                <ul className="mt-1 space-y-1">
                  <li>• "Make the text larger and bold"</li>
                  <li>• "Change the color to match the theme"</li>
                  <li>• "Add a hover effect"</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end mt-3">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
            >
              {isAiMode ? 'Apply AI Edit' : 'Apply Edit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 