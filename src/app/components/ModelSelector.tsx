'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface ModelSelectorProps {
  selectedModel: string;
  onChange: (model: string) => void;
  models: string[];
  disabled?: boolean;
}

export default function ModelSelector({ selectedModel, onChange, models, disabled = false }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get vendor name from model
  const getVendorName = (model: string): string => {
    if (model.includes('gpt') || model.includes('o1') || model.includes('o3')) return 'OpenAI';
    if (model.includes('claude')) return 'Anthropic';
    if (model.includes('gemini')) return 'Google';
    if (model.includes('mistral') || model.includes('codestral') || model.includes('pixtral')) return 'Mistral AI';
    if (model.includes('llama')) return 'Meta';
    if (model.includes('deepseek')) return 'DeepSeek';
    if (model.includes('grok')) return 'xAI';
    return 'Other';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300 mb-1">Select Model</label>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border ${
          isOpen ? 'border-purple-500/50' : 'border-gray-700'
        } bg-gray-800/50 backdrop-blur-sm text-white ${
          disabled ? 'opacity-70 cursor-not-allowed' : 'hover:border-purple-500/50'
        } transition-all`}
        disabled={disabled}
      >
        <div className="flex items-center">
          <span className="mr-2">{selectedModel}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
            {getVendorName(selectedModel)}
          </span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg shadow-lg bg-gray-800 border border-gray-700 py-1 max-h-60 overflow-auto animate-fade-in">
          {models.map((model) => (
            <button
              key={model}
              onClick={() => {
                onChange(model);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-700 ${
                selectedModel === model ? 'bg-purple-900/30 text-purple-300' : 'text-white'
              }`}
            >
              <span className="truncate">{model}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 ml-2 flex-shrink-0">
                {getVendorName(model)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}