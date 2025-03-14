'use client';

import React from 'react';

export interface ModelSelectorProps {
  selectedModel: string;
  onChange: (model: string) => void;
  models: string[];
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onChange,
  models,
  disabled = false
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Model
      </label>
      <select
        value={selectedModel}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;