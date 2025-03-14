'use client';

import React, { useState, useEffect } from 'react';
import SelectionEditor from './SelectionEditor';

interface BrowserPreviewProps {
  url?: string;
  isLoading?: boolean;
  onEdit?: (selection: string, replacement: string) => void;
  onAiEdit?: (selection: string, prompt: string) => Promise<void>;
  version?: number;
  onVersionChange?: (version: number) => void;
  onDownload?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const BrowserPreview: React.FC<BrowserPreviewProps> = ({ 
  url, 
  isLoading = false, 
  onEdit, 
  onAiEdit,
  version = 1,
  onVersionChange = () => {},
  onDownload = () => {},
  onUndo = () => {},
  onRedo = () => {},
  canUndo = false,
  canRedo = false
}) => {
  const [iframeLoading, setIframeLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (url) {
      setIframeLoading(true);
      setIframeError(false);
    }
  }, [url]);

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  const handleIframeError = () => {
    setIframeLoading(false);
    setIframeError(true);
  };

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 border border-gray-800 rounded-lg">
        <div className="text-center p-8">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400">No preview available yet</p>
          <p className="text-gray-500 text-sm mt-2">Generate content to see a preview</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 border border-gray-800 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <SelectionEditor 
        previewUrl={url}
        onEdit={(selection, replacement) => onEdit?.(selection, replacement)}
        onAiEdit={(selection, prompt) => onAiEdit?.(selection, prompt) || Promise.resolve()}
        version={version}
        onVersionChange={onVersionChange}
        onDownload={onDownload}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </div>
  );
};

export default BrowserPreview;