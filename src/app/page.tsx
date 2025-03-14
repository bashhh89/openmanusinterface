'use client';

import { useState, useEffect, useRef } from 'react';
import ChatInput from './components/ChatInput';
import ResponseDisplay from './components/ResponseDisplay';
import ModelSelector from './components/ModelSelector';
import BrowserPreview from './components/BrowserPreview';
import axios from 'axios';

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (prompt: string, options: { 
          model: string;
          tools?: Array<{
            type: string;
            function: {
              name: string;
              description: string;
              parameters: {
                type: string;
                properties: {
                  [key: string]: {
                    type: string;
                    description: string;
                  }
                };
                required: string[];
              };
            }
          }>;
          messages?: Array<{
            role: string;
            content: string;
            tool_call_id?: string;
          }>;
        }) => Promise<any>;
      };
    };
  }
}

// Real weather data function
async function getWeather(location: string) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
    );
    
    const { main, weather } = response.data;
    return `${Math.round(main.temp)}°C, ${weather[0].description}`;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return `Could not find weather data for ${location}. Please check the city name and try again.`;
    }
    return `Error fetching weather data for ${location}. Please try again later.`;
  }
}

// Current date function
function getCurrentDate() {
  const now = new Date();
  return now.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Mock browse_website function
async function browse_website(url: string): Promise<string> {
  // This is a mock implementation - in production, this would make real web requests
  return `Mock webpage content for ${url}. In a real implementation, this would fetch and parse the actual webpage content.`;
}

interface HistoryEntry {
  content: string;
  timestamp: number;
}

interface Version {
  content: string;
  description: string;
  timestamp: number;
}

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [websitePreviewUrl, setWebsitePreviewUrl] = useState<string | undefined>(undefined);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState<number>(40);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  // Initialize previewWidth from localStorage on client-side only
  useEffect(() => {
    const saved = localStorage.getItem('previewWidth');
    if (saved) {
      setPreviewWidth(parseFloat(saved));
    }
  }, []);

  // Available models from Puter.js documentation
  const availableModels = [
    'gpt-4o-mini',
    'gpt-4o',
    'o3-mini',
    'o1-mini',
    'claude-3-5-sonnet',
    'deepseek-chat',
    'deepseek-reasoner',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
    'mistral-large-latest',
    'pixtral-large-latest',
    'codestral-latest',
    'google/gemma-2-27b-it',
    'grok-beta'
  ];

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handler);
    return () => darkModeQuery.removeEventListener('change', handler);
  }, []);

  // Effect to handle preview panel animation
  useEffect(() => {
    if (websitePreviewUrl && previewPanelRef.current) {
      setIsPreviewVisible(true);
    } else if (!websitePreviewUrl && previewPanelRef.current) {
      setIsPreviewVisible(false);
    }
  }, [websitePreviewUrl]);

  // Add timer cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Function to get estimated time based on model
  const getEstimatedTime = (model: string): number => {
    switch (model) {
      case 'o1-mini':
        return 15; // 15 seconds
      case 'gpt-4o':
        return 20; // 20 seconds
      case 'claude-3-5-sonnet':
        return 25; // 25 seconds
      default:
        return 30; // default 30 seconds
    }
  };

  // Update startTimer to include estimated time
  const startTimer = () => {
    startTimeRef.current = Date.now();
    setEstimatedTime(getEstimatedTime(selectedModel));
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedTime(elapsed);
      }
    }, 1000);
  };

  // Function to stop the timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = null;
    setElapsedTime(0);
  };

  const extractTextContent = async (result: any): Promise<string> => {
    // Log the raw response for debugging
    console.log('Raw AI response:', result);

    // Handle string responses directly
    if (typeof result === 'string') {
      return result;
    }

    if (result && typeof result === 'object') {
      // Handle o1-mini and similar models that might return different formats
      if (result.content) {
        return result.content;
      }
      
      if (result.choices?.[0]?.message?.content) {
        return result.choices[0].message.content;
      }

      if (result.completion) {
        return result.completion;
      }

      // Handle Claude's response format
      if (result.message?.content && Array.isArray(result.message.content)) {
        return result.message.content
          .filter((item: any) => item.type === 'text')
          .map((item: any) => item.text)
          .join('\n');
      }

      // Handle function/tool calls
      if (result.function_call || result.tool_calls || result.message?.tool_calls || result.message?.function_call) {
        const functionCall = result.function_call || 
                           result.tool_calls?.[0] ||
                           result.message?.tool_calls?.[0] ||
                           result.message?.function_call;

        if (functionCall) {
          try {
            const name = functionCall.name || functionCall.function?.name;
            const args = JSON.parse(typeof functionCall.arguments === 'string' 
              ? functionCall.arguments 
              : JSON.stringify(functionCall.arguments));

            switch (name) {
              case 'get_weather':
                return await getWeather(args.location);
              case 'getCurrentDate':
                return getCurrentDate();
              case 'browse_website':
                return await browse_website(args.url);
              default:
                return 'Unknown function call';
            }
          } catch (e) {
            console.error('Error processing function call:', e);
            return 'Error: Unable to process function call';
          }
        }
      }

      // Handle various response formats
      const text = result.text || 
                  result.content || 
                  result.completion || 
                  result.message?.content ||
                  (Array.isArray(result.message?.content) 
                    ? result.message.content.map((item: any) => item.text).join('\n') 
                    : null);

      if (text) {
        return text;
      }
    }

    // If we can't extract text in any other way, try to stringify the result
    try {
      const stringified = JSON.stringify(result, null, 2);
      console.error('Unable to parse response normally, stringified result:', stringified);
      return stringified;
    } catch (e) {
      console.error('Error stringifying result:', e);
      return `Unable to parse response: ${e instanceof Error ? e.message : 'Unknown error'}`;
    }
  };

  const extractWebsiteUrl = (prompt: string): string | null => {
    // Simple extraction: if prompt starts with "Browse" or "browse", extract the URL
    const browseRegex = /^browse\s+(.+)$/i;
    const match = prompt.match(browseRegex);
    
    if (match && match[1]) {
      // Very basic URL validation/formatting
      let url = match[1].trim();
      
      // If URL doesn't start with http:// or https://, add https://
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      return url;
    }
    
    return null;
  };

  const extractHtmlFromResponse = (response: string): string | null => {
    // First try to find a complete HTML document
    const fullHtmlMatch = response.match(/<!DOCTYPE html>[\s\S]*?<\/html>/i);
    if (fullHtmlMatch) {
      return fullHtmlMatch[0].trim();
    }

    // Then try to find HTML content between ```html and ``` tags
    const htmlMatch = response.match(/```(?:html)?\n([\s\S]*?)```/);
    if (htmlMatch) {
      const extractedHtml = htmlMatch[1].trim();
      // If the extracted content is a complete HTML document, return it
      if (extractedHtml.toLowerCase().includes('<!doctype html>')) {
        return extractedHtml;
      }
      // Otherwise, wrap it in a basic HTML structure
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Generated Page</title>
          </head>
          <body>
            ${extractedHtml}
          </body>
        </html>
      `;
    }

    // If the response itself looks like HTML content but isn't wrapped
    if (response.includes('<html>') || response.includes('<body>')) {
      // Check if it's a complete document
      if (response.toLowerCase().includes('<!doctype html>')) {
        return response.trim();
      }
      // Wrap it in a basic HTML structure
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Generated Page</title>
          </head>
          <body>
            ${response}
          </body>
        </html>
      `;
    }

    return null;
  };

  // Add to history
  const addToHistory = (content: string) => {
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push({ content, timestamp: Date.now() });
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
    
    // Save to localStorage
    localStorage.setItem('generationHistory', JSON.stringify(newHistory));
  };

  // Undo/Redo functions
  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      const previousContent = history[currentHistoryIndex - 1].content;
      setResponse(previousContent);
      updatePreview(previousContent);
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      const nextContent = history[currentHistoryIndex + 1].content;
      setResponse(nextContent);
      updatePreview(nextContent);
    }
  };

  // Version management
  const handleVersionChange = (version: number) => {
    setCurrentVersion(version);
    if (versions[version - 1]) {
      const versionContent = versions[version - 1].content;
      setResponse(versionContent);
      updatePreview(versionContent);
    }
  };

  // Save current state as a new version
  const saveVersion = (description: string) => {
    if (response) {
      const newVersion: Version = {
        content: response,
        description,
        timestamp: Date.now()
      };
      const updatedVersions = [...versions, newVersion];
      setVersions(updatedVersions);
      
      // Save to localStorage
      localStorage.setItem('generationVersions', JSON.stringify(updatedVersions));
    }
  };

  // Download functionality
  const handleDownload = () => {
    if (response) {
      const htmlContent = extractHtmlFromResponse(response);
      if (htmlContent) {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `webpage_v${currentVersion}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  };

  // Update preview helper
  const updatePreview = (content: string) => {
    const htmlContent = extractHtmlFromResponse(content);
    if (htmlContent) {
      if (websitePreviewUrl) {
        URL.revokeObjectURL(websitePreviewUrl);
      }
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const previewUrl = URL.createObjectURL(blob);
      setWebsitePreviewUrl(previewUrl);
    }
  };

  // Enhance handleSubmit to support versioning
  const handleSubmit = async (prompt: string) => {
    setError(null);
    setDebugInfo(null);
    setIsLoading(true);
    setShareLink(null);
    startTimer(); // Start the timer when generation begins
    
    try {
      // Make sure Puter.js is loaded
      if (typeof window === 'undefined' || !window.puter?.ai?.chat) {
        throw new Error('Puter.js is not loaded properly. Please refresh the page.');
      }

      // Check if this is a browse request
      const websiteUrl = extractWebsiteUrl(prompt);
      
      if (websiteUrl) {
        // This is a browse request
        setIsPreviewLoading(true);
        setWebsitePreviewUrl(websiteUrl);
        
        try {
          // Get website content
          const websiteContent = await browse_website(websiteUrl);
          
          // Generate a response about the browsed website
          const result = await window.puter.ai.chat(
            `Analyze this website content from ${websiteUrl}:\n\n${websiteContent}`,
            { model: selectedModel }
          );

          if (!result) {
            throw new Error('No response received from AI model');
          }

          // Extract response content
          const responseContent = await extractTextContent(result);
          if (!responseContent) {
            throw new Error('No content in response');
          }

          setResponse(responseContent);
          setIsPreviewLoading(false);
          
          // After successful generation, add to history and potentially create new version
          addToHistory(responseContent);
          
          // If this is a new prompt (not an edit), create a new version
          if (!prompt.startsWith('edit:')) {
            const versionNumber = versions.length + 1;
            saveVersion(`Version ${versionNumber} - ${prompt.slice(0, 50)}...`);
          }
        } catch (browseError) {
          console.error('Browse request error:', browseError);
          throw new Error(`Failed to browse website: ${browseError instanceof Error ? browseError.message : 'Unknown error'}`);
        }
      } else {
        // Regular chat request
        const result = await window.puter.ai.chat(
          `Create a webpage based on this request: ${prompt}. Return only the complete HTML document with embedded CSS and JavaScript. Do not include any explanations or markdown formatting.`,
          { model: selectedModel }
        );

        if (!result) {
          throw new Error('No response received from AI model');
        }

        // Extract response content
        const responseContent = await extractTextContent(result);
        if (!responseContent) {
          throw new Error('No content in response');
        }

        // Try to extract just the HTML code
        const htmlContent = extractHtmlFromResponse(responseContent);
        if (!htmlContent) {
          console.error('Could not extract HTML from response:', responseContent);
          setResponse(responseContent);
          return;
        }

        setResponse(responseContent);

        // Create a blob URL for the preview
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const previewUrl = URL.createObjectURL(blob);
        
        // Show the preview
        setWebsitePreviewUrl(previewUrl);
        setIsPreviewVisible(true);
        
        // After successful generation, add to history and potentially create new version
        addToHistory(responseContent);
        
        // If this is a new prompt (not an edit), create a new version
        if (!prompt.startsWith('edit:')) {
          const versionNumber = versions.length + 1;
          saveVersion(`Version ${versionNumber} - ${prompt.slice(0, 50)}...`);
        }
      }
    } catch (error) {
      console.error('Error details:', {
        error,
        type: error?.constructor?.name,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      let errorMessage = 'An unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && Object.keys(error).length === 0) {
        errorMessage = 'The AI model returned an empty response. Please try again or select a different model.';
      }
      
      setError(`Error: ${errorMessage}`);
      setResponse(null);
    } finally {
      setIsLoading(false);
      stopTimer(); // Stop the timer when generation ends
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = previewWidth;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    
    const containerWidth = window.innerWidth;
    const dx = e.clientX - startX.current;
    const newWidth = Math.min(Math.max(20, startWidth.current - (dx / containerWidth * 100)), 80);
    setPreviewWidth(newWidth);
    localStorage.setItem('previewWidth', newWidth.toString());
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Add effect to handle shared content on load
  useEffect(() => {
    const handleSharedContent = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedContent = urlParams.get('content');
      
      if (encodedContent) {
        try {
          const decodedContent = decodeURIComponent(encodedContent);
          setResponse(decodedContent);
          setWebsitePreviewUrl(URL.createObjectURL(new Blob([decodedContent], { type: 'text/html' })));
          setIsPreviewVisible(true);
        } catch (error) {
          console.error('Error loading shared content:', error);
          setError('Failed to load shared content');
        }
      }
    };

    handleSharedContent();
  }, []);

  // Add function to generate share link with standalone page
  const generateShareLink = async () => {
    if (!response) return;
    
    try {
      // Extract HTML content from the response
      const htmlContent = extractHtmlFromResponse(response);
      if (!htmlContent) {
        throw new Error('Could not extract HTML content from response');
      }

      // Create a minimal standalone HTML page
      const minimalHtml = htmlContent.trim();
      
      // Create a blob from the HTML content
      const blob = new Blob([minimalHtml], { type: 'text/html' });
      
      // Create a share URL using the blob
      const shareUrl = URL.createObjectURL(blob);
      
      setShareLink(shareUrl);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (error) {
      console.error('Error generating share link:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate share link');
    }
  };

  // Enhance edit handlers to support history
  const handleDirectEdit = (selection: string, replacement: string) => {
    if (!response) return;
    
    try {
      // Get the current HTML content
      const htmlContent = extractHtmlFromResponse(response);
      if (!htmlContent) {
        throw new Error('Could not extract HTML content');
      }

      // Create new content with the replacement
      const newContent = htmlContent.replace(selection, replacement);
      
      // Update the response state with the new content
      setResponse(newContent);

      // Revoke old URL to prevent memory leaks
      if (websitePreviewUrl) {
        URL.revokeObjectURL(websitePreviewUrl);
      }

      // Create and set new preview URL
      const blob = new Blob([newContent], { type: 'text/html' });
      const newPreviewUrl = URL.createObjectURL(blob);
      setWebsitePreviewUrl(newPreviewUrl);
      
      // Add to history after successful edit
      addToHistory(newContent);
    } catch (error) {
      console.error('Direct edit error:', error);
      setError(`Error applying edit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAiEdit = async (selection: string, prompt: string) => {
    if (!response) return;
    
    try {
      setIsLoading(true);
      
      // Get AI suggestion for the edit
      const result = await window.puter.ai.chat(
        `I have this HTML content where I want to modify this specific part: "${selection}". 
         The requested change is: "${prompt}".
         Return ONLY the new content that should replace the selected text. Do not include any explanations or markdown formatting.`,
        { model: selectedModel }
      );

      const replacement = await extractTextContent(result);
      if (!replacement) {
        throw new Error('AI did not provide a valid replacement');
      }

      // Get the current HTML content
      const htmlContent = extractHtmlFromResponse(response);
      if (!htmlContent) {
        throw new Error('Could not extract HTML content');
      }

      // Create new content with the replacement
      const newContent = htmlContent.replace(selection, replacement);
      
      // Update the response state with the new content
      setResponse(newContent);

      // Revoke old URL to prevent memory leaks
      if (websitePreviewUrl) {
        URL.revokeObjectURL(websitePreviewUrl);
      }

      // Create and set new preview URL
      const blob = new Blob([newContent], { type: 'text/html' });
      const newPreviewUrl = URL.createObjectURL(blob);
      setWebsitePreviewUrl(newPreviewUrl);
      
      // Add to history after successful edit
      addToHistory(newContent);
    } catch (error) {
      console.error('AI edit error:', error);
      setError(`Error applying AI edit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved history and versions on component mount
  useEffect(() => {
    try {
      // Load history
      const savedHistory = localStorage.getItem('generationHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
        setCurrentHistoryIndex(parsedHistory.length - 1);
      }

      // Load versions
      const savedVersions = localStorage.getItem('generationVersions');
      if (savedVersions) {
        const parsedVersions = JSON.parse(savedVersions);
        setVersions(parsedVersions);
      }

      // Load last response if exists
      const lastResponse = localStorage.getItem('lastResponse');
      if (lastResponse) {
        setResponse(lastResponse);
        updatePreview(lastResponse);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Save response to localStorage whenever it changes
  useEffect(() => {
    if (response) {
      localStorage.setItem('lastResponse', response);
    }
  }, [response]);

  // Clean up localStorage when component unmounts
  useEffect(() => {
    return () => {
      // Optional: Clear old data if it's too large
      const historySize = localStorage.getItem('generationHistory')?.length || 0;
      const versionsSize = localStorage.getItem('generationVersions')?.length || 0;
      
      // If total size exceeds 10MB, clear older entries
      if (historySize + versionsSize > 10 * 1024 * 1024) {
        const history = JSON.parse(localStorage.getItem('generationHistory') || '[]');
        const versions = JSON.parse(localStorage.getItem('generationVersions') || '[]');
        
        // Keep only the last 50 entries
        localStorage.setItem('generationHistory', JSON.stringify(history.slice(-50)));
        localStorage.setItem('generationVersions', JSON.stringify(versions.slice(-50)));
      }
    };
  }, []);

  return (
    <main className="min-h-screen">
      <div className="dark:bg-gray-900 min-h-screen relative overflow-hidden">
        {/* Chat Interface Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Share Button */}
            <div className="mb-4 flex justify-end">
              {response && (
                <button
                  onClick={generateShareLink}
                  className="inline-flex items-center px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              )}
            </div>
            
            {/* Share Link Display */}
            {shareLink && (
              <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                <p className="text-sm text-gray-600 dark:text-gray-400">Share Options:</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = shareLink;
                      a.download = 'generated-page.html';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    className="px-3 py-2 text-sm text-white bg-green-600 hover:bg-green-500 rounded"
                  >
                    Download HTML
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      alert('Link copied!');
                    }}
                    className="px-3 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-500 rounded"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            {isLoading && (
              <div className="mb-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="space-y-4">
                  {/* Title and Timer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg className="animate-spin h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Generating Content
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-mono text-indigo-600 dark:text-indigo-400">
                        {Math.max(0, estimatedTime - elapsedTime)}s
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400"> remaining</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200 dark:text-indigo-300 dark:bg-indigo-900/30">
                          Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-indigo-600 dark:text-indigo-400">
                          {Math.min(100, Math.round((elapsedTime / estimatedTime) * 100))}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200 dark:bg-indigo-900/30">
                      <div 
                        style={{ 
                          width: `${Math.min(100, (elapsedTime / estimatedTime) * 100)}%`,
                          transition: 'width 0.5s ease-in-out'
                        }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 dark:bg-indigo-400"
                      ></div>
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      {elapsedTime < 5 ? 'Initializing...' :
                       elapsedTime < estimatedTime * 0.3 ? 'Processing your request...' :
                       elapsedTime < estimatedTime * 0.6 ? 'Generating content...' :
                       elapsedTime < estimatedTime * 0.9 ? 'Finalizing...' :
                       'Almost done...'}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      Model: {selectedModel}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Main content area with split screen layout */}
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
              {/* Left column: AI Chat Interface */}
              <div 
                className={`flex-1 flex flex-col space-y-6 transition-all duration-300 ease-in-out`}
                style={{ width: isPreviewVisible ? `${100 - previewWidth}%` : '100%' }}
              >
                {/* Model selector */}
                <div className="w-full">
                  <ModelSelector 
                    selectedModel={selectedModel} 
                    onSelect={setSelectedModel} 
                    disabled={isLoading}
                    availableModels={availableModels}
                  />
                </div>
                
                {/* Response display */}
                <div className="flex-1 overflow-hidden">
                  <ResponseDisplay 
                    response={response} 
                    isLoading={isLoading}
                    error={error}
                  />
                </div>
                
                {/* Chat input */}
                <div className="w-full">
                  <ChatInput 
                    onSubmit={handleSubmit} 
                    isLoading={isLoading}
                  />
                </div>
              </div>
              
              {/* Resizer handle */}
              {isPreviewVisible && (
                <div
                  className="hidden lg:block w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 cursor-col-resize transition-colors"
                  onMouseDown={handleMouseDown}
                />
              )}
              
              {/* Right column: Browser Preview */}
              <div 
                ref={previewPanelRef}
                className={`transition-all duration-500 ease-in-out ${
                  isPreviewVisible 
                    ? 'opacity-100' 
                    : 'lg:max-w-0 lg:opacity-0 lg:overflow-hidden'
                }`}
                style={{ width: isPreviewVisible ? `${previewWidth}%` : '0%' }}
              >
                <BrowserPreview 
                  url={websitePreviewUrl} 
                  isLoading={isPreviewLoading}
                  onEdit={handleDirectEdit}
                  onAiEdit={handleAiEdit}
                  version={currentVersion}
                  onVersionChange={handleVersionChange}
                  onDownload={handleDownload}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  canUndo={currentHistoryIndex > 0}
                  canRedo={currentHistoryIndex < history.length - 1}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
