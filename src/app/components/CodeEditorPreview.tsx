'use client';

import { useState } from 'react';

interface CodeEditorPreviewProps {
  htmlCode?: string;
  cssCode?: string;
  jsCode?: string;
}

const CodeEditorPreview: React.FC<CodeEditorPreviewProps> = ({
  htmlCode = '',
  cssCode = '',
  jsCode = ''
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');

  // Basic syntax highlighting function
  const highlightCode = (code: string, language: 'html' | 'css' | 'js') => {
    if (!code) return [];

    // Split code into lines
    return code.split('\n').map((line, index) => {
      let highlightedLine = line;

      // Very basic syntax highlighting rules
      switch (language) {
        case 'html':
          // Highlight HTML tags
          highlightedLine = line
            .replace(/(&lt;[^&]*&gt;)/g, '<span class="text-pink-500">$1</span>')
            .replace(/(&lt;\/[^&]*&gt;)/g, '<span class="text-pink-500">$1</span>')
            // Highlight attributes
            .replace(/(\s\w+)=["'][^"']*["']/g, '<span class="text-yellow-500">$1</span>');
          break;

        case 'css':
          // Highlight CSS properties and values
          highlightedLine = line
            .replace(/([{};])/g, '<span class="text-gray-400">$1</span>')
            .replace(/([a-z-]+):/g, '<span class="text-blue-400">$1</span>:')
            .replace(/(#[a-fA-F0-9]{3,6})/g, '<span class="text-green-400">$1</span>');
          break;

        case 'js':
          // Highlight JavaScript keywords
          highlightedLine = line
            .replace(/(const|let|var|function|return|if|else|for|while)/g, '<span class="text-purple-500">$1</span>')
            .replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
            .replace(/('.*?')/g, '<span class="text-green-400">$1</span>')
            .replace(/(\{|\}|\(|\))/g, '<span class="text-gray-400">$1</span>');
          break;
      }

      return (
        <div key={index} className="flex">
          {/* Line number */}
          <span className="w-8 inline-block text-right mr-4 text-gray-400 select-none">
            {index + 1}
          </span>
          {/* Code line */}
          <span 
            dangerouslySetInnerHTML={{ 
              __html: highlightedLine || '&nbsp;'
            }} 
            className="flex-1"
          />
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-700">
      {/* Editor Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('html')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'html'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          HTML
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'css'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          CSS
        </button>
        <button
          onClick={() => setActiveTab('js')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'js'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          JavaScript
        </button>
      </div>

      {/* Code Display Area */}
      <div className="p-4 font-mono text-sm overflow-x-auto">
        <div className={`${activeTab === 'html' ? 'block' : 'hidden'}`}>
          <div className="text-gray-300">
            {highlightCode(htmlCode, 'html')}
          </div>
        </div>
        <div className={`${activeTab === 'css' ? 'block' : 'hidden'}`}>
          <div className="text-gray-300">
            {highlightCode(cssCode, 'css')}
          </div>
        </div>
        <div className={`${activeTab === 'js' ? 'block' : 'hidden'}`}>
          <div className="text-gray-300">
            {highlightCode(jsCode, 'js')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPreview; 