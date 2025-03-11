'use client';

import { useState, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import ResponseDisplay from './components/ResponseDisplay';
import ModelSelector from './components/ModelSelector';

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (prompt: string, options: { model: string }) => Promise<any>;
      };
    };
  }
}

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    // Check system dark mode preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);

    // Listen for system dark mode changes
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handler);

    return () => darkModeQuery.removeEventListener('change', handler);
  }, []);

  // Helper function to safely extract text content from various response formats
  const extractTextContent = (result: any): string => {
    // Check for direct string
    if (typeof result === 'string') {
      return result;
    }
    
    // Handle Claude's nested structure pattern
    if (result && typeof result === 'object') {
      // Claude 3.5 specific format with message -> content -> text
      if (result.message?.content && Array.isArray(result.message.content)) {
        const textParts = result.message.content
          .filter((item: any) => item.type === 'text' && typeof item.text === 'string')
          .map((item: any) => item.text);
          
        if (textParts.length > 0) {
          return textParts.join('\n\n');
        }
      }
      
      // Direct text property
      if (typeof result.text === 'string') {
        return result.text;
      }
      
      // Claude completion property
      if (typeof result.completion === 'string') {
        return result.completion;
      }

      // OpenAI content property
      if (typeof result.content === 'string') {
        return result.content;
      }
      
      // Handle message.content format (string)
      if (result.message && typeof result.message.content === 'string') {
        return result.message.content;
      }
      
      // Handle array of objects with text properties
      if (Array.isArray(result)) {
        // Try to extract text from the first item if it's an object with text
        if (result.length > 0 && typeof result[0] === 'object' && result[0] !== null) {
          if (typeof result[0].text === 'string') {
            return result[0].text;
          }
        }
        
        // If it's an array of strings, join them
        if (result.every((item: any) => typeof item === 'string')) {
          return result.join('');
        }
      }
    }
    
    // Last resort: stringify the object
    try {
      return JSON.stringify(result, null, 2);
    } catch (e) {
      return `Unable to parse response: ${e instanceof Error ? e.message : 'Unknown error'}`;
    }
  };

  const handleSubmit = async (prompt: string) => {
    setError(null);
    setDebugInfo(null);
    setIsLoading(true);
    
    try {
      if (!window.puter?.ai?.chat) {
        throw new Error('Puter.js is not loaded properly. Please refresh the page.');
      }

      console.log(`Sending request to model: ${selectedModel}`);
      
      const result = await window.puter.ai.chat(prompt, {
        model: selectedModel
      });
      
      // Log the structure for debugging
      console.log('Response structure:', result);
      
      // Store debug info
      setDebugInfo(`Model: ${selectedModel}, Response type: ${typeof result}`);
      
      // Check for empty response
      if (!result) {
        setError(`Empty response from model: ${selectedModel}`);
        return;
      }

      // Check for refusal in common formats
      if (result.refusal) {
        setError(typeof result.refusal === 'string' ? result.refusal : 'Request was refused by the AI model.');
        setResponse(null);
        return;
      }
      
      if (result.message?.refusal) {
        setError(typeof result.message.refusal === 'string' ? result.message.refusal : 'Request was refused by the AI model.');
        setResponse(null);
        return;
      }
      
      // Extract the text content using our helper function
      const extractedText = extractTextContent(result);
      setResponse(extractedText);
      
    } catch (error) {
      console.error('Error calling AI:', error);
      
      // More detailed error reporting
      let errorMsg = 'Failed to get response from AI model. Please try again.';
      
      if (error instanceof Error) {
        errorMsg += ` Error: ${error.message}`;
      } else if (typeof error === 'string') {
        errorMsg += ` Error: ${error}`;
      } else if (typeof error === 'object' && error !== null) {
        try {
          errorMsg += ` Error details: ${JSON.stringify(error)}`;
        } catch (e) {
          errorMsg += ' Error details could not be stringified.';
        }
      }
      
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              AI Chat Interface
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Interact with various AI models using Puter.js
            </p>
          </header>
          
          <div className="space-y-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl p-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Select AI Model
              </h2>
              <ModelSelector
                selectedModel={selectedModel}
                onSelect={setSelectedModel}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-4">
              <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
              
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}
              
              {debugInfo && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 text-xs">
                  <p><code>{debugInfo}</code></p>
                </div>
              )}
              
              <ResponseDisplay response={response} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
