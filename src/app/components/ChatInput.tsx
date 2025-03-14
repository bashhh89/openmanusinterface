'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Example prompts for inspiration
  const examplePrompts = [
    "Create a responsive landing page for a coffee shop",
    "Build a simple todo app with HTML, CSS, and JavaScript",
    "Generate a personal portfolio website with dark mode",
    "Create a chat interface using Puter.js",
    "Make a simple browser game with canvas"
  ];

  // Auto-resize textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const enhancePrompt = async () => {
    const trimmedPrompt = typeof prompt === 'string' ? prompt.trim() : '';
    if (!trimmedPrompt || isLoading || isEnhancing) return;
    
    try {
      setIsEnhancing(true);
      
      // Use Puter.js to enhance the prompt with more comprehensive instructions
      const result = await window.puter.ai.chat(
        `I want you to significantly enhance and expand the following prompt to make it much more detailed and specific, so it will generate better code.
         
         For the enhanced version:
         1. Add specific details about layout, responsive design, and UI/UX elements
         2. Specify color schemes, typography, and visual style preferences
         3. Include technical requirements like frameworks, libraries, or specific features
         4. Add details about functionality, user interactions, and animations
         5. Suggest content structure and organization
         6. Even if the original prompt is just a few words, expand it into a comprehensive request
         
         Return ONLY the enhanced prompt without any explanations, markdown formatting, or additional text.
         
         Original prompt: "${trimmedPrompt}"`,
        { model: 'gpt-4o-mini' }
      );
      
      // Extract the enhanced prompt from the response, ensuring it's a string
      let enhancedPrompt = '';
      if (typeof result === 'string') {
        enhancedPrompt = result;
      } else if (result && typeof result === 'object') {
        enhancedPrompt = result.text || result.content || JSON.stringify(result);
      }
      
      if (enhancedPrompt) {
        setPrompt(enhancedPrompt);
      } else {
        console.error('Failed to extract enhanced prompt from result:', result);
      }
      
    } catch (error) {
      console.error('Error enhancing prompt:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative rounded-xl shadow-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 transition-all focus-within:border-purple-500/50 focus-within:shadow-purple-500/10">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to create a website, app, or game..."
            className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-gray-400 p-4 pr-20 resize-none min-h-[56px] max-h-[200px] overflow-y-auto"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className={`absolute right-2 bottom-2 rounded-lg px-4 py-2 font-medium transition-all ${
              isLoading || !prompt.trim()
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing</span>
              </div>
            ) : (
              'Send'
            )}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-400 flex justify-between">
          <span>Press Shift+Enter for new line</span>
          <span className="text-purple-400">Powered by Puter.js</span>
        </div>
      </form>
      
      <div className="mt-3">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try one of these examples:</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              disabled={isLoading || isEnhancing}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;