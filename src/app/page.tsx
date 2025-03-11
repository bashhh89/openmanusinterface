'use client';

import { useState, useEffect } from 'react';
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
          functions?: Array<{
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
          }>;
          tools?: Array<{
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

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [previewURL, setPreviewURL] = useState<string | undefined>(undefined);
  const [previewContent, setPreviewContent] = useState<string | undefined>(undefined);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handler);
    return () => darkModeQuery.removeEventListener('change', handler);
  }, []);

  const extractTextContent = async (result: any): Promise<string> => {
    if (typeof result === 'string') {
      return result;
    }

    if (result && typeof result === 'object') {
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

      const text = result.text || result.content || result.completion || 
                   result.message?.content || 
                   (Array.isArray(result.message?.content) 
                     ? result.message.content.map((item: any) => item.text).join('\n') 
                     : null);

      if (typeof text === 'string') {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('weather') || lowerText.includes('temperature')) {
          const cities = ['Paris', 'London', 'New York', 'Tokyo'];
          const mentionedCity = cities.find(city => lowerText.includes(city.toLowerCase()));
          if (mentionedCity) {
            return await getWeather(mentionedCity);
          }

          const cityMatch = text.match(/(?:in|at|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
          if (cityMatch && cityMatch[1]) {
            return await getWeather(cityMatch[1]);
          }

          return "I can only provide weather information for Paris, London, New York, and Tokyo.";
        }

        if (lowerText.includes('date') || lowerText.includes('today') || lowerText.includes('current day')) {
          return getCurrentDate();
        }

        return text;
      }
    }

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
    setPreviewContent(undefined);

    try {
      if (!window.puter?.ai?.chat) {
        throw new Error('Puter.js is not loaded properly. Please refresh the page.');
      }

      console.log(`Sending request to model: ${selectedModel}`);
      
      // First chat call that might trigger a tool call
      const completion = await window.puter.ai.chat(prompt, {
        model: selectedModel,
        tools: [{
          name: 'get_weather',
          description: 'Get current weather for a given location',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'City name e.g. Paris, London'
              }
            },
            required: ['location']
          }
        }, {
          name: 'browse_website',
          description: 'Browse a website and get its content',
          parameters: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'The URL of the website to browse'
              }
            },
            required: ['url']
          }
        }]
      });

      console.log('Response structure:', completion);
      setDebugInfo(`Model: ${selectedModel}, Response type: ${typeof completion}`);

      if (!completion) {
        setError(`Empty response from model: ${selectedModel}`);
        return;
      }

      // Check for refusals
      if (completion.refusal || completion.message?.refusal) {
        const refusalMessage = typeof completion.refusal === 'string' 
          ? completion.refusal 
          : (typeof completion.message?.refusal === 'string' 
              ? completion.message.refusal 
              : 'Request was refused by the AI model.');
        setError(refusalMessage);
        setResponse(null);
        return;
      }

      // Check if there's a tool call in the response
      if (completion.message?.tool_calls && completion.message.tool_calls.length > 0) {
        const toolCall = completion.message.tool_calls[0];
        
        if (toolCall.function.name === 'get_weather') {
          try {
            // Extract location from tool call arguments
            const args = JSON.parse(toolCall.function.arguments);
            const weatherData = await getWeather(args.location);

            // Make second chat call with the tool response
            const finalResponse = await window.puter.ai.chat(prompt, {
              model: selectedModel,
              messages: [
                { role: "user", content: prompt },
                completion.message,
                { 
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: weatherData
                }
              ]
            });

            // Process and set the final response
            const processedResponse = await extractTextContent(finalResponse);
            setResponse(processedResponse);
          } catch (error) {
            console.error('Error processing tool call:', error);
            setError('Error processing weather request');
            setResponse(null);
          }
        } else if (toolCall.function.name === 'browse_website') {
          try {
            // Extract URL from tool call arguments
            const args = JSON.parse(toolCall.function.arguments);
            setPreviewURL(args.url);
            setIsPreviewLoading(true);
            
            // Fetch website content
            const websiteContent = await browse_website(args.url);
            setPreviewContent(websiteContent);
            setIsPreviewLoading(false);

            // Make second chat call with the tool response
            const finalResponse = await window.puter.ai.chat(prompt, {
              model: selectedModel,
              messages: [
                { role: "user", content: prompt },
                completion.message,
                { 
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: websiteContent
                }
              ]
            });

            const processedResponse = await extractTextContent(finalResponse);
            setResponse(processedResponse);
          } catch (error) {
            setIsPreviewLoading(false);
            console.error('Error processing tool call:', error);
            setError('Error processing website browsing request');
            setResponse(null);
          }
        }
      } else {
        // Handle regular text response (no tool calls)
        const processedResponse = await extractTextContent(completion);
        setResponse(processedResponse);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Smooth scroll to chat interface
  const scrollToChat = (e: React.MouseEvent) => {
    e.preventDefault();
    const chatElement = document.getElementById('chat-interface');
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="dark:bg-gray-900 min-h-screen">
        {/* Landing Page Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20 sm:py-32">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Welcome to AI Chat Interface
              </h1>
              <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                Your Gateway to Powerful AI Models - Simple, Fast, and No API Keys Required!
              </p>
              <div className="max-w-xl mx-auto">
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  Get started by scrolling down to explore our powerful AI chat interface. Ask questions, browse websites, and interact with multiple AI models seamlessly.
                </p>
              </div>
              <div className="mt-10">
                <a href="#chat-interface" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                  Get Started
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Chat Interface Section */}
        <section id="chat-interface" className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <header className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                AI Chat Interface
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Interact with various AI models using Puter.js
              </p>
            </header>
            
            <div className="space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Select AI Model
                </h3>
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
        </section>
      </div>
    </div>
  );
}
