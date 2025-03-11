'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SharedPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const encodedContent = searchParams.get('content');
      if (!encodedContent) {
        setError('No content found');
        return;
      }

      // Safely decode the URL-encoded content
      let decodedContent;
      try {
        decodedContent = decodeURIComponent(encodedContent);
      } catch (e) {
        console.error('Error decoding content:', e);
        setError('Invalid content encoding');
        return;
      }

      // Validate that the content is HTML
      if (!decodedContent.includes('<!DOCTYPE html>') && !decodedContent.includes('<html>')) {
        setError('Invalid content format');
        return;
      }
      
      // Create a new document with the content
      document.open();
      document.write(decodedContent);
      document.close();
    } catch (error) {
      console.error('Error displaying shared content:', error);
      setError('Failed to load shared content');
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="p-6 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  // Return empty div as content will be written directly to document
  return <div />;
} 