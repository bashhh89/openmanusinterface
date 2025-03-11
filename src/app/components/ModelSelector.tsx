interface ModelSelectorProps {
  onSelect: (model: string) => void;
  selectedModel: string;
  disabled?: boolean;
}

const AI_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4O Mini (Default)', vendor: 'OpenAI' },
  { id: 'gpt-4o', name: 'GPT-4O', vendor: 'OpenAI' },
  { id: 'o3-mini', name: 'O3 Mini', vendor: 'OpenAI' },
  { id: 'o1-mini', name: 'O1 Mini', vendor: 'OpenAI' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', vendor: 'Anthropic' },
  { id: 'deepseek-chat', name: 'DeepSeek Chat', vendor: 'High-Flyer' },
  { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', vendor: 'High-Flyer' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', vendor: 'Google' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', vendor: 'Google' },
  { id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', name: 'Llama 3.1 8B', vendor: 'Together.ai' },
  { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', name: 'Llama 3.1 70B', vendor: 'Together.ai' },
  { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', name: 'Llama 3.1 405B', vendor: 'Together.ai' },
  { id: 'mistral-large-latest', name: 'Mistral Large', vendor: 'Mistral AI' },
  { id: 'pixtral-large-latest', name: 'Pixtral Large', vendor: 'Mistral AI' },
  { id: 'codestral-latest', name: 'Codestral', vendor: 'Mistral AI' },
  { id: 'google/gemma-2-27b-it', name: 'Gemma 2 27B', vendor: 'Groq' },
  { id: 'grok-beta', name: 'Grok Beta', vendor: 'xAI' }
];

export default function ModelSelector({ onSelect, selectedModel, disabled = false }: ModelSelectorProps) {
  return (
    <div className="w-full">
      <select
        value={selectedModel}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="w-full p-3 border rounded-lg bg-white text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700"
      >
        {AI_MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} - {model.vendor}
          </option>
        ))}
      </select>
    </div>
  );
}