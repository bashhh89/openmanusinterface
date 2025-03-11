'use client';

import { useEffect, useRef } from 'react';

interface ResponseDisplayProps {
  response: string | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function ResponseDisplay({ response, isLoading = false, error = null }: ResponseDisplayProps) {
  const responseRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new response comes in
  useEffect(() => {
    if (response && responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  return (
    <div 
      ref={responseRef}
      className="w-full h-full max-h-[500px] rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                overflow-y-auto p-6 shadow-sm transition-colors duration-200"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-60 space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20">
            <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Processing your request...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">This may take a moment depending on the complexity of your query.</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-60 space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20">
            <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-red-600 dark:text-red-400">Error</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      ) : response ? (
        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
            {response.split('\n').map((line, i) => {
              // Simple detection for code blocks (starts with spaces or tabs)
              const isCodeLine = line.startsWith('  ') || line.startsWith('\t');
              return (
                <div key={i} className={isCodeLine ? 'font-mono bg-gray-50 dark:bg-gray-900/50 p-1 rounded' : ''}>
                  {line || '\u00A0'}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-60 space-y-6 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Welcome to AI Web Explorer!
            </p>
            <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Try asking me to browse websites or answer questions. For example:
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-gray-600 dark:text-gray-300">
                "Summarize the content from example.com"
              </p>
              <p className="text-sm bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-gray-600 dark:text-gray-300">
                "What's the latest news on spacex.com?"
              </p>
              <p className="text-sm bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-gray-600 dark:text-gray-300">
                "Compare the features listed on tesla.com"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}