import React from 'react';

interface BrowserPreviewProps {
  url?: string;
  content?: string;
  isLoading: boolean;
}

const BrowserPreview: React.FC<BrowserPreviewProps> = ({ url, content, isLoading }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Mock browser chrome/header */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center space-x-2">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        
        {url ? (
          <div className="flex-1 ml-2">
            <div className="bg-white dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded px-2 py-1 truncate">
              {url}
            </div>
          </div>
        ) : (
          <div className="flex-1 ml-2">
            <div className="bg-white dark:bg-gray-700 text-xs text-gray-400 dark:text-gray-500 rounded px-2 py-1 italic">
              No URL loaded
            </div>
          </div>
        )}
      </div>
      
      {/* Preview content area */}
      <div className="p-4 flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-12 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading content...</p>
          </div>
        ) : content ? (
          <div className="prose dark:prose-invert max-w-none">
            <pre className="text-sm whitespace-pre-wrap break-words text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-800/50 p-4 rounded">
              {content}
            </pre>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Website Preview Area</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                When you ask AI to browse a website, content will appear here
              </p>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500 italic max-w-xs">
              Try a prompt like: "Browse and summarize the content from example.com"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserPreview;