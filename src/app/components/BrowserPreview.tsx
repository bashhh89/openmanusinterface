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
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No preview available</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
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