'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vzqythwfrmjakhvmopyf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cXl0aHdmcm1qYWtodm1vcHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTkwMDQsImV4cCI6MjA1NjU5NTAwNH0.QZRgjjtxLlXsH-6U_bGDb62TfZvtkyIycM1LPapjZ28'
);

export default function SharedPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Get the file from Supabase Storage
        const { data, error } = await supabase
          .storage
          .from('generated-pages')
          .download(`${params.id}.html`);

        if (error) throw error;

        // Convert the blob to text
        const text = await data.text();
        setContent(text);
      } catch (err) {
        console.error('Error fetching shared content:', err);
        setError('Failed to load shared content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading shared content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <a 
            href="/" 
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Shared Content</h2>
                <a 
                  href="/" 
                  className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Create Your Own
                </a>
              </div>
            </div>
            <div className="p-4">
              <iframe
                srcDoc={content || ''}
                className="w-full h-[calc(100vh-200px)] border-0"
                title="Shared Content"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 