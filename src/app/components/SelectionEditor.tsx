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
  const selectionScriptRef = useRef<string>('');

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

      // Store the script in a ref for later use
      selectionScriptRef.current = script;

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

  const injectSelectionScript = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      try {
        const doc = iframe.contentDocument;
        if (doc) {
          const scriptEl = doc.createElement('script');
          scriptEl.textContent = selectionScriptRef.current;
          doc.body.appendChild(scriptEl);
        }
      } catch (e) {
        console.error('Error injecting selection script:', e);
      }
    }
  };

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

  const handleAiEdit = async () => {
    await onAiEdit(selection, prompt);
    setShowEditor(false);
    setPrompt('');
    setEditText('');
  };

  return (
    <div className="relative w-full h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded ${
              canUndo 
                ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                : 'text-gray-600 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded ${
              canRedo 
                ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                : 'text-gray-600 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          <div className="h-4 border-l border-gray-700 mx-1"></div>
          <button
            onClick={onDownload}
            className="p-1.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded"
            title="Download HTML"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <div className="h-4 border-l border-gray-700 mx-1"></div>
          <button
            onClick={() => setIsSelecting(!isSelecting)}
            className={`p-1.5 rounded ${
              isSelecting 
                ? 'bg-purple-900/50 text-purple-300' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
            title="Select Element"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </button>
          <button
            onClick={() => setShowElementOutline(!showElementOutline)}
            className={`p-1.5 rounded ${
              showElementOutline 
                ? 'bg-purple-900/50 text-purple-300' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
            title="Show Element Outlines"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Version:</span>
          <select
            value={version}
            onChange={(e) => onVersionChange(parseInt(e.target.value))}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded px-2 py-1 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <button
            onClick={() => window.open(previewUrl, '_blank')}
            className="p-1.5 text-gray-300 hover:bg-gray-800 hover:text-white rounded"
            title="Open in New Tab"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview iframe */}
      <iframe
        ref={iframeRef}
        src={previewUrl}
        className="w-full h-[calc(100%-40px)]"
        onLoad={injectSelectionScript}
      />

      {/* Selection editor */}
      {showEditor && (
        <div
          ref={editorRef}
          className="absolute z-10 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
          style={{
            left: `${Math.min(editorPosition.x, window.innerWidth - 320)}px`,
            top: `${Math.min(editorPosition.y + 50, window.innerHeight - 300)}px`,
          }}
        >
          <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
            <div className="text-sm font-medium text-gray-300">
              {isAiMode ? 'AI Edit' : 'Edit HTML'}
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsAiMode(false)}
                className={`px-2 py-1 text-xs rounded ${
                  !isAiMode 
                    ? 'bg-purple-900/50 text-purple-300' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => setIsAiMode(true)}
                className={`px-2 py-1 text-xs rounded ${
                  isAiMode 
                    ? 'bg-purple-900/50 text-purple-300' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                AI
              </button>
              <button
                onClick={() => setShowEditor(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-3">
            {selectedElement && (
              <div className="mb-2 text-xs text-gray-400 bg-gray-800/50 p-1.5 rounded border-l-2 border-purple-500 font-mono overflow-x-auto whitespace-nowrap">
                {selectedElement}
              </div>
            )}
            {isAiMode ? (
              <>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe how to change the selected text..."
                  className="w-full h-24 p-2 mb-2 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleEdit}
                    disabled={!prompt.trim() || !selection}
                    className={`px-3 py-1.5 rounded text-sm ${
                      !prompt.trim() || !selection
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                    }`}
                  >
                    Apply AI Edit
                  </button>
                </div>
              </>
            ) : (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full h-24 p-2 mb-2 bg-gray-800 border border-gray-700 rounded text-gray-300 text-sm font-mono focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleEdit}
                    disabled={!selection}
                    className={`px-3 py-1.5 rounded text-sm ${
                      !selection
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                    }`}
                  >
                    Apply Edit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 