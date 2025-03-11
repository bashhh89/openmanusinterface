'use client';

interface ModelSelectorProps {
  selectedModel: string;
  onSelect: (model: string) => void;
  disabled?: boolean;
  availableModels?: string[];
}

const models = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', tier: 'premium' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', tier: 'standard' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', tier: 'premium' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', tier: 'premium' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', tier: 'standard' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google', tier: 'standard' },
  { id: 'mistral-large-latest', name: 'Mistral Large', provider: 'Mistral AI', tier: 'premium' },
  { id: 'mistral-medium-latest', name: 'Mistral Medium', provider: 'Mistral AI', tier: 'standard' }
];

export default function ModelSelector({ selectedModel, onSelect, disabled = false, availableModels = [] }: ModelSelectorProps) {
  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <select
          value={selectedModel}
          onChange={(e) => onSelect(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                   rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   text-gray-900 dark:text-gray-100 cursor-pointer disabled:cursor-not-allowed
                   disabled:opacity-50 appearance-none transition-colors duration-200"
          aria-label="Select AI model"
        >
          {availableModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 pl-1">
        ★ Premium models may provide better results but could be slower
      </p>
    </div>
  );
}