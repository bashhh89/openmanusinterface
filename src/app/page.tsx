'use client';

import { useState, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import ResponseDisplay from './components/ResponseDisplay';
import ModelSelector from './components/ModelSelector';
import axios from 'axios';

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (prompt: string, options: { 
          model: string,
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

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

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
              case 'getWeather':
                return await getWeather(args.location);
              case 'getCurrentDate':
                return getCurrentDate();
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

    try {
      if (!window.puter?.ai?.chat) {
        throw new Error('Puter.js is not loaded properly. Please refresh the page.');
      }

      console.log(`Sending request to model: ${selectedModel}`);
      const result = await window.puter.ai.chat(prompt, {
        model: selectedModel,
        functions: [
          {
            name: 'getWeather',
            description: 'Get the current weather for a specific location. Use this function whenever users ask about weather in any city.',
            parameters: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'The city name to get weather for. Available cities: Paris, London, New York, Tokyo'
                }
              },
              required: ['location']
            }
          },
          {
            name: 'getCurrentDate',
            description: 'Get the current date. Use this function whenever users ask about the current date, today\'s date, or what day it is.',
            parameters: {
              type: 'object',
              properties: {},
              required: []
            }
          }
        ]
      });

      console.log('Response structure:', result);
      setDebugInfo(`Model: ${selectedModel}, Response type: ${typeof result}`);

      if (!result) {
        setError(`Empty response from model: ${selectedModel}`);
        return;
      }

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

      const processedResponse = await extractTextContent(result);
      setResponse(processedResponse);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setResponse(null);
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
