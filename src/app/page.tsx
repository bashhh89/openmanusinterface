'use client';

import { useState, useEffect, useRef } from 'react';
import ChatInput from './components/ChatInput';
import ResponseDisplay from './components/ResponseDisplay';
import ModelSelector from './components/ModelSelector';
import BrowserPreview from './components/BrowserPreview';
import axios from 'axios';
import HistorySidebar from './components/HistorySidebar';
import { createClient } from '@supabase/supabase-js';
import { GuidedWorkflow } from './components/GuidedWorkflow';
import EnhancedChatInput from './components/EnhancedChatInput';
import LandingPage from './components/LandingPage';

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

// Initialize Supabase client
const supabase = createClient(
  'https://vzqythwfrmjakhvmopyf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cXl0aHdmcm1qYWtodm1vcHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTkwMDQsImV4cCI6MjA1NjU5NTAwNH0.QZRgjjtxLlXsH-6U_bGDb62TfZvtkyIycM1LPapjZ28'
);

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
  id: string;
  content: string;
  timestamp: number;
  url?: string;
  projectName?: string;
  description?: string;
}

interface Version {
  id: string;
  content: string;
  description: string;
  timestamp: number;
  projectName?: string;
  modelUsed?: string;
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
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showGuidedWorkflow, setShowGuidedWorkflow] = useState(true);
  const [projectType, setProjectType] = useState<'ai-agent' | 'webapp' | 'landing' | 'game' | null>(null);
  const [requiresApi, setRequiresApi] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('Untitled Project');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentProjectName, setCurrentProjectName] = useState<string>('Untitled Project');
  const [currentProjectDescription, setCurrentProjectDescription] = useState<string>('');
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [isPuterLoaded, setIsPuterLoaded] = useState(false);
  const [puterLoadError, setPuterLoadError] = useState<string | null>(null);

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

  // Update addToHistory to include project information
  const addToHistory = (content: string) => {
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    const htmlContent = extractHtmlFromResponse(content);
    let url = '';
    
    if (htmlContent) {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      url = URL.createObjectURL(blob);
    }

    // Extract a project name from the content
    let autoProjectName = 'New Project';
    
    // Try to find HTML title
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      autoProjectName = titleMatch[1].trim();
    } else {
      // Try to find a heading
      const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
      if (h1Match && h1Match[1]) {
        autoProjectName = h1Match[1].replace(/<[^>]*>/g, '').trim();
      }
    }
    
    // Limit length
    if (autoProjectName.length > 30) {
      autoProjectName = autoProjectName.substring(0, 27) + '...';
    }
    
    // Add timestamp for uniqueness
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newEntry: HistoryEntry = {
      id: Math.random().toString(36).substring(2, 15),
      content,
      timestamp: Date.now(),
      url,
      projectName: `${autoProjectName} (${timestamp})`,
      description: 'Created with ' + selectedModel
    };

    // Add to the beginning of the array to show most recent first
    newHistory.unshift(newEntry);
    setHistory(newHistory);
    setCurrentHistoryIndex(0);
    
    // Save to localStorage
    localStorage.setItem('generationHistory', JSON.stringify(newHistory));
  };

  // Add handlers for project management
  const handleRenameProject = (id: string, newName: string) => {
    const newHistory = history.map(entry => 
      entry.id === id ? { ...entry, projectName: newName } : entry
    );
    setHistory(newHistory);
    localStorage.setItem('generationHistory', JSON.stringify(newHistory));
  };

  const handleAddDescription = (id: string, description: string) => {
    const newHistory = history.map(entry => 
      entry.id === id ? { ...entry, description } : entry
    );
    setHistory(newHistory);
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
  const saveVersion = async (description: string) => {
    if (!response) {
      setError('No content to save');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const htmlContent = extractHtmlFromResponse(response);
      if (!htmlContent) {
        throw new Error('Could not extract HTML content');
      }

      const versionId = Math.random().toString(36).substring(2, 15);
      
      // Validate data before saving
      if (!description || typeof description !== 'string') {
        throw new Error('Invalid description');
      }

      // Save version to Supabase with proper error handling
      const { data, error: supabaseError } = await supabase
        .from('versions')
        .insert([
          {
            id: versionId,
            content: htmlContent,
            description,
            created_at: new Date().toISOString(),
            project_name: 'Untitled Project', // Default project name
            model_used: selectedModel
          }
        ])
        .select();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error(`Database error: ${supabaseError.message}`);
      }

      // Update local versions state
      const newVersion: Version = {
        id: versionId,
        content: response,
        description,
        timestamp: Date.now(),
        projectName: 'Untitled Project',
        modelUsed: selectedModel
      };
      
      setVersions(prev => [...prev, newVersion]);
      setCurrentVersion(versions.length + 1);
      
      alert('Version saved successfully!');
    } catch (error) {
      console.error('Error saving version:', error);
      setError(error instanceof Error ? error.message : 'Failed to save version');
      alert('Failed to save version. Please try again.');
    } finally {
      setIsLoading(false);
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

  // Update the handleSubmit function to ensure the AI remembers previous conversations
  const handleSubmit = async (prompt: string) => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setError(null);
      startTimer();

      // Create a new message array with the user's message
      const newMessages = [
        ...messages,
        { role: 'user', content: prompt }
      ];
      
      // Update the UI immediately with the user's message
      setMessages(newMessages);

      // Create a conversation history for context
      const conversationHistory = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // If this is a follow-up to a previous generation, add context
      if (messages.length > 0 && response) {
        // Add a system message to provide context about the current project
        conversationHistory.unshift({
          role: 'system',
          content: `You are helping the user with a project. The current state of the project is represented by the previous messages. 
          The user is asking for modifications or enhancements to this existing project. 
          Always acknowledge the existing project and provide improvements based on the user's request.`
        });
      }

      // All models from Puter.js don't require API keys
      const options: any = { 
        model: selectedModel,
        messages: conversationHistory
      };
      
      try {
        console.log(`Sending prompt to ${selectedModel}...`);
        const result = await window.puter.ai.chat(prompt, options);
        console.log('Raw response:', result);
        
        const textContent = result.text || (typeof result === 'string' ? result : JSON.stringify(result));
        
        // Add the AI's response to the messages
        const updatedMessages = [
          ...newMessages,
          { role: 'assistant', content: textContent }
        ];
        setMessages(updatedMessages);
        
        // Also update response for compatibility with existing code
        setResponse(textContent);
        
        // Extract HTML and update preview if available
        const htmlContent = extractHtmlFromResponse(textContent);
        if (htmlContent) {
          updatePreview(textContent);
        }
        
        // Add to history
        addToHistory(textContent);
      } catch (apiError) {
        console.error('API Error:', apiError);
        setError(`Error from AI service: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      stopTimer();
    }
  };

  // Update the generateShareLink function to ensure it works properly
  const generateShareLink = async () => {
    if (!response && messages.length === 0) {
      setError('No content to share');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Get the latest assistant message
      const lastAssistantMessage = [...messages]
        .reverse()
        .find(msg => msg.role === 'assistant');
      
      if (!lastAssistantMessage) {
        throw new Error('No assistant message found to share');
      }
      
      // Extract HTML content
      const htmlContent = extractHtmlFromResponse(lastAssistantMessage.content);
      if (!htmlContent) {
        throw new Error('Could not extract HTML content from response');
      }

      // Create a unique ID for this share
      const shareId = Math.random().toString(36).substring(2, 15);
      
      try {
        // Try to upload to Supabase
        const { data, error } = await supabase
          .storage
          .from('pages')
          .upload(`${shareId}.html`, new Blob([htmlContent], { type: 'text/html' }), {
            contentType: 'text/html',
            cacheControl: '3600',
            upsert: true
          });

        if (error) {
          console.error('Supabase storage error:', error);
          
          // Create a downloadable blob instead
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          setShareUrl(url);
          
          try {
            await navigator.clipboard.writeText(url);
            alert('Local share link created and copied to clipboard! Note: This link will only work on your device.');
          } catch (clipboardError) {
            console.error('Clipboard error:', clipboardError);
            alert('Local share link created! Click the "Copy Link" button to copy it.');
          }
          return;
        }

        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase
          .storage
          .from('pages')
          .getPublicUrl(`${shareId}.html`);

        // Set the share link to the public URL
        setShareUrl(publicUrl);
        
        // Copy to clipboard with better feedback
        try {
          await navigator.clipboard.writeText(publicUrl);
          alert('Share link copied to clipboard!');
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError);
          alert('Share link generated! Click the "Copy Link" button to copy it.');
        }
      } catch (storageError) {
        console.error('Storage error:', storageError);
        
        // Fallback to local blob URL if Supabase storage fails
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setShareUrl(url);
        
        try {
          await navigator.clipboard.writeText(url);
          alert('Local share link created and copied to clipboard! Note: This link will only work on your device.');
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError);
          alert('Local share link created! Click the "Copy Link" button to copy it.');
        }
      }
    } catch (error) {
      console.error('Error generating share link:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate share link');
      alert('Failed to generate share link. Please try again.');
    } finally {
      setIsLoading(false);
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

  // Add cleanup for URLs when component unmounts
  useEffect(() => {
    return () => {
      history.forEach(entry => {
        if (entry.url) {
          URL.revokeObjectURL(entry.url);
        }
      });
    };
  }, [history]);

  // Function to handle project type selection
  const handleProjectTypeSelect = (type: 'ai-agent' | 'webapp' | 'landing' | 'game') => {
    setProjectType(type);
    // Reset API requirement for new project
    setRequiresApi(false);
    setApiKey('');
  };

  // Function to handle API requirement toggle
  const handleApiToggle = (requires: boolean) => {
    setRequiresApi(requires);
    if (!requires) {
      setApiKey('');
    }
  };

  // Function to handle model change
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    // Reset API requirement if switching to Puter model
    if (model.includes('puter')) {
      setRequiresApi(false);
      setApiKey('');
    }
  };

  // Update handleGuidedWorkflowSubmit function to generate better AI agent code
  const handleGuidedWorkflowSubmit = async (projectType: string, data: any) => {
    // Handle the form submission based on project type
    let prompt = '';
    
    switch (projectType) {
      case 'landing':
        prompt = `Create a modern landing page with the following details:
          Business Name: ${data.businessName}
          Industry: ${data.industry}
          Key Features: ${data.features}
          Color Scheme: ${data.colorScheme}
          
          The page should be responsive, use modern HTML, CSS, and minimal JavaScript.
          Include all necessary code to make it work as a standalone page.
          Make sure all assets are loaded from CDNs or use inline SVGs.
          The design should be professional and follow modern web design principles.`;
        break;
        
      case 'webapp':
        prompt = `Create a web application with the following specifications:
          App Name: ${data.appName}
          Purpose: ${data.purpose}
          Key Features: ${data.features}
          UI Preference: ${data.uiPreference || 'Modern and clean'}
          
          The application should use HTML, CSS, and JavaScript only.
          Make it responsive and include all necessary code.
          Ensure all functionality works without requiring a backend.
          Use localStorage for any data persistence needs.`;
        break;
        
      case 'game':
        prompt = `Create a browser game with the following details:
          Game Name: ${data.gameName}
          Genre: ${data.genre}
          Game Mechanics: ${data.mechanics}
          Art Style: ${data.artStyle}
          
          The game should use HTML5 Canvas, CSS, and JavaScript.
          Include all necessary code to make it playable directly in the browser.
          Ensure the game works on both desktop and mobile devices.
          Use requestAnimationFrame for smooth animations.`;
        break;
        
      case 'ai-agent':
        prompt = `Create an AI agent with the following configuration:
          Agent Name: ${data.agentName}
          Purpose: ${data.purpose}
          System Prompt: ${data.systemPrompt}
          
          Create a complete, standalone HTML file that includes:
          1. The Puter.js library via <script src="https://js.puter.com/v2/"></script>
          2. A clean, professional UI for the chat interface
          3. JavaScript code that uses puter.ai.chat() to power the agent
          4. The system prompt should be incorporated exactly as provided
          5. Make it responsive and visually appealing
          6. Include clear instructions on how to embed this as an iframe on any website
          7. Ensure all code is complete and works without requiring any additional dependencies
          
          The final code should be a single HTML file that can be directly embedded as an iframe.`;
        break;
        
      case 'chat':
        prompt = `Create a simple chat interface with the following details:
          Chat Name: ${data.chatName}
          Welcome Message: ${data.welcomeMessage}
          Theme Color: ${data.theme || '#4F46E5'}
          Avatar Style: ${data.avatarStyle || 'Circle'}
          
          Create a complete, standalone HTML file that includes:
          The chat interface should be clean, responsive, and use only HTML, CSS, and JavaScript.
          Include the Puter.js script tag: <script src="https://js.puter.com/v2/"></script>
          Implement the chat functionality using puter.ai.chat with the gpt-4o-mini model.`;
        break;
    }
    
    // Process the prompt and generate code
    setShowGuidedWorkflow(false);
    
    // Call handleSubmit with the generated prompt
    handleSubmit(prompt);
  };

  // Add a useEffect to ensure Puter.js is loaded
  useEffect(() => {
    const checkPuter = () => {
      if (typeof window !== 'undefined' && (window as any).puter) {
        setIsPuterLoaded(true);
      } else {
        // If not loaded after 5 seconds, show error
        setTimeout(() => {
          if (!(window as any).puter) {
            setPuterLoadError('Puter.js failed to load. Please check your internet connection and try again.');
          }
        }, 5000);
      }
    };

    // Check immediately and also after a short delay to ensure script has time to load
    checkPuter();
    const timer = setTimeout(checkPuter, 1000);

    return () => clearTimeout(timer);
  }, []);
  
  // Update the title to reflect that we're using Puter.js
  useEffect(() => {
    document.title = 'AI Code Generator - Powered by Puter.js';
  }, []);

  // Add back the mouse event handlers
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

  // Add a useEffect to scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update the loadProject function to properly load artifacts
  const loadProject = (project: any) => {
    try {
      let content = project.content;
      
      // If content is stored as a string but is actually JSON, parse it
      if (typeof content === 'string' && (content.startsWith('[') || content.startsWith('{'))) {
        try {
          content = JSON.parse(content);
        } catch (e) {
          // If it's not valid JSON, keep it as a string
          console.log('Content is not valid JSON, keeping as string');
        }
      }
      
      // If content is an array of messages, set it directly
      if (Array.isArray(content)) {
        setMessages(content);
        
        // Find the last assistant message to set as response
        const lastAssistantMessage = [...content]
          .reverse()
          .find(msg => msg.role === 'assistant');
          
        if (lastAssistantMessage) {
          setResponse(lastAssistantMessage.content);
          updatePreview(lastAssistantMessage.content);
        }
      } else {
        // If content is a string, create a new messages array
        setResponse(content);
        setMessages([
          { role: 'assistant', content: content }
        ]);
        updatePreview(content);
      }
      
      setCurrentProjectId(project.id);
      setCurrentProjectName(project.name || project.projectName || 'Untitled Project');
      setCurrentProjectDescription(project.description || '');
      
      // If there's a share URL, set it
      if (project.share_url || project.url) {
        setShareUrl(project.share_url || project.url);
      }
      
      setShowHistory(false);
      setIsHistoryOpen(false);
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Failed to load project. The data may be corrupted.');
    }
  };

  if (puterLoadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Error</h2>
          <p className="text-gray-400 mb-4">{puterLoadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative dark:bg-gray-900">
      {showLandingPage ? (
        <LandingPage onGetStarted={() => setShowLandingPage(false)} />
      ) : showGuidedWorkflow ? (
        <div className="relative w-full">
          <button
            onClick={() => setShowGuidedWorkflow(false)}
            className="absolute top-4 right-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors z-10"
          >
            Skip to Chat →
          </button>
          <GuidedWorkflow 
            onSubmit={handleGuidedWorkflowSubmit}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
        </div>
      ) : (
        <div className="flex flex-col w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-black">
          {/* Header with model selector */}
          <div className="bg-gray-900/80 backdrop-blur-sm shadow-lg border-b border-gray-800 p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
              <h1 className="text-xl font-bold text-gradient-primary mb-4 md:mb-0">
                AI Code Generator
              </h1>
              
              <div className="flex items-center space-x-4">
                <div className="w-64">
                  <ModelSelector
                    selectedModel={selectedModel}
                    onChange={handleModelChange}
                    models={availableModels}
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  onClick={() => setShowGuidedWorkflow(true)}
                  className="btn-primary flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="hidden md:inline">Project</span> Templates
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
              <button
                onClick={() => {
                  setMessages([]);
                  setResponse(null);
                  setWebsitePreviewUrl(undefined);
                  setShareUrl(null);
                  setError(null);
                }}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                title="New Chat"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={() => setShowGuidedWorkflow(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                title="Project Templates"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </button>
              <button
                onClick={() => setShowLandingPage(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                title="Back to Home"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
            </div>
            <div className="dark:bg-gray-900 min-h-screen relative overflow-hidden">
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="fixed right-4 top-20 z-30 p-2 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <HistorySidebar
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={history}
                currentIndex={currentHistoryIndex}
                onSelectHistory={(entry) => {
                  // Find the index of the entry
                  const index = history.findIndex(item => item.id === entry.id);
                  if (index !== -1) {
                    setCurrentHistoryIndex(index);
                  }
                  
                  // Load the project
                  loadProject(entry);
                }}
                onRenameProject={handleRenameProject}
                onAddDescription={handleAddDescription}
              />

              <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <div className="mb-4 flex justify-end">
                    {response && (
                      <button
                        onClick={generateShareLink}
                        className="inline-flex items-center px-4 py-2 rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                      </button>
                    )}
                  </div>
                  
                  {shareLink && (
                    <div className="mb-4 p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-md">
                      <p className="text-sm text-gray-400">Share Options:</p>
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
                          className="px-3 py-2 text-sm text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 rounded transition-colors"
                        >
                          Download HTML
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shareLink);
                            alert('Link copied!');
                          }}
                          className="px-3 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded transition-colors"
                        >
                          Copy Link
                        </button>
                      </div>
                    </div>
                  )}

                  {isLoading && (
                    <div className="mb-4 p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <svg className="animate-spin h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <h3 className="text-lg font-semibold text-white">
                              Generating Content
                            </h3>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-mono text-purple-400">
                              {Math.max(0, estimatedTime - elapsedTime)}s
                            </span>
                            <span className="text-sm text-gray-400"> remaining</span>
                          </div>
                        </div>

                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-400 bg-purple-900/30">
                                Progress
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-purple-400">
                                {Math.min(100, Math.round((elapsedTime / estimatedTime) * 100))}%
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-900/30">
                            <div 
                              style={{ 
                                width: `${Math.min(100, (elapsedTime / estimatedTime) * 100)}%`,
                                transition: 'width 0.5s ease-in-out'
                              }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-600 to-indigo-600"
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">
                            {elapsedTime < 5 ? 'Initializing...' :
                             elapsedTime < estimatedTime * 0.3 ? 'Processing your request...' :
                             elapsedTime < estimatedTime * 0.6 ? 'Generating content...' :
                             elapsedTime < estimatedTime * 0.9 ? 'Finalizing...' :
                             'Almost done...'}
                          </span>
                          <span className="text-gray-400">
                            Model: {selectedModel}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
                    <div 
                      className={`flex-1 flex flex-col space-y-6 transition-all duration-300 ease-in-out`}
                      style={{ width: isPreviewVisible ? `${100 - previewWidth}%` : '100%' }}
                    >
                      <div className="flex-1 overflow-hidden">
                        {error && (
                          <div className="mb-4 p-4 bg-red-900/30 border border-red-800 rounded-md">
                            <h3 className="text-lg font-semibold text-red-300 mb-2">Error</h3>
                            <p className="text-red-200">{error}</p>
                            <div className="mt-3">
                              <p className="text-sm text-red-300">
                                All models are provided through Puter.js and don't require API keys. 
                                If you're seeing an error, please try:
                              </p>
                              <ul className="list-disc list-inside mt-2 text-sm text-red-300">
                                <li>Refreshing the page</li>
                                <li>Trying a different model (gpt-4o-mini is recommended)</li>
                                <li>Checking your internet connection</li>
                                <li>Ensuring your browser supports modern JavaScript</li>
                              </ul>
                            </div>
                          </div>
                        )}
                        <ResponseDisplay 
                          response={response} 
                          isLoading={isLoading}
                          error={error}
                        />
                      </div>
                      
                      <div className="w-full">
                        <div className="max-w-4xl mx-auto">
                          {messages.map((message, index) => (
                            <div key={index} className={`mb-6 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                              <div
                                className={`inline-block max-w-[85%] md:max-w-[75%] p-4 rounded-lg ${
                                  message.role === 'user'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none'
                                    : 'bg-gray-800 shadow-sm border border-gray-700 text-gray-200 rounded-tl-none'
                                }`}
                              >
                                <div className="text-sm font-semibold mb-2">
                                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                                </div>
                                <div className="prose dark:prose-invert max-w-none overflow-auto max-h-[500px]">
                                  {message.content.split('```').map((part, i) => {
                                    // If this is an even-indexed part, it's regular text
                                    if (i % 2 === 0) {
                                      return <div key={i} className="whitespace-pre-wrap">{part}</div>;
                                    } 
                                    // If this is an odd-indexed part, it's a code block
                                    else {
                                      // Extract language if specified
                                      const firstLineBreakIndex = part.indexOf('\n');
                                      const language = firstLineBreakIndex > 0 ? part.substring(0, firstLineBreakIndex).trim() : '';
                                      const code = firstLineBreakIndex > 0 ? part.substring(firstLineBreakIndex + 1) : part;
                                      
                                      return (
                                        <div key={i} className="my-4 rounded-md overflow-hidden">
                                          {language && (
                                            <div className="bg-gray-800 text-gray-200 px-4 py-1 text-xs font-mono">
                                              {language}
                                            </div>
                                          )}
                                          <pre className="bg-gray-900 p-4 overflow-x-auto">
                                            <code className="text-gray-200 font-mono text-sm">{code}</code>
                                          </pre>
                                        </div>
                                      );
                                    }
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                          {isLoading && (
                            <div className="flex items-center justify-center py-4">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                        
                        <div className="mt-6">
                          <EnhancedChatInput 
                            onSubmit={handleSubmit} 
                            isLoading={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {isPreviewVisible && (
                      <div
                        className="hidden lg:block w-1 bg-gray-700 hover:bg-purple-500 cursor-col-resize transition-colors"
                        onMouseDown={handleMouseDown}
                      />
                    )}
                    
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
          </div>
        </div>
      )}
    </main>
  );
}
