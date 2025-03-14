import React, { useState } from 'react';
import { ModelSelector } from './ModelSelector';

interface GuidedWorkflowProps {
  onSubmit: (projectType: string, data: any) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

interface ProjectOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: FormField[];
  gradient: string;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'color' | 'file';
  placeholder?: string;
  required?: boolean;
}

export const GuidedWorkflow: React.FC<GuidedWorkflowProps> = ({
  onSubmit,
  selectedModel,
  onModelChange
}) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [animateIn, setAnimateIn] = useState(true);

  const PROJECT_OPTIONS: ProjectOption[] = [
    {
      id: 'landing',
      title: 'Landing Page',
      description: 'Create a beautiful, responsive landing page for your business or product',
      gradient: 'from-blue-500 to-purple-600',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      fields: [
        { name: 'businessName', label: 'Business Name', type: 'text', required: true, placeholder: 'e.g., Acme Inc.' },
        { name: 'industry', label: 'Industry', type: 'text', required: true, placeholder: 'e.g., Technology, Healthcare, Education' },
        { name: 'features', label: 'Key Features', type: 'textarea', required: true, placeholder: 'Describe the main features or services you want to highlight' },
        { name: 'colorScheme', label: 'Color Scheme', type: 'text', required: true, placeholder: 'e.g., Blue and white, Dark theme, Earthy tones' }
      ]
    },
    {
      id: 'webapp',
      title: 'Web Application',
      description: 'Build a full-featured web application with modern technologies',
      gradient: 'from-green-500 to-teal-600',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      fields: [
        { name: 'appName', label: 'App Name', type: 'text', required: true, placeholder: 'e.g., TaskMaster, BudgetBuddy' },
        { name: 'purpose', label: 'Purpose', type: 'textarea', required: true, placeholder: 'What problem does your app solve?' },
        { name: 'features', label: 'Key Features', type: 'textarea', required: true, placeholder: 'List the main features you want in your app' },
        { name: 'uiPreference', label: 'UI Preference', type: 'text', placeholder: 'e.g., Minimalist, Colorful, Dark theme', required: false }
      ]
    },
    {
      id: 'game',
      title: 'Browser Game',
      description: 'Create an engaging browser-based game with modern graphics and controls',
      gradient: 'from-red-500 to-orange-600',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      fields: [
        { name: 'gameName', label: 'Game Name', type: 'text', required: true, placeholder: 'e.g., Space Invaders, Puzzle Master' },
        { name: 'genre', label: 'Genre', type: 'text', required: true, placeholder: 'e.g., Puzzle, Arcade, Platformer' },
        { name: 'mechanics', label: 'Game Mechanics', type: 'textarea', required: true, placeholder: 'Describe how the game will be played' },
        { name: 'artStyle', label: 'Art Style', type: 'text', required: true, placeholder: 'e.g., Pixel art, Minimalist, Cartoon' }
      ]
    },
    {
      id: 'ai-agent',
      title: 'AI Agent',
      description: 'Build an AI agent powered by Puter.js that can be embedded in any website',
      gradient: 'from-purple-500 to-indigo-600',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      fields: [
        { name: 'agentName', label: 'Agent Name', type: 'text', required: true, placeholder: 'e.g., HelpBot, SalesAssistant' },
        { name: 'purpose', label: 'Purpose', type: 'textarea', required: true, placeholder: 'What will your AI agent help users with?' },
        { name: 'systemPrompt', label: 'System Prompt', type: 'textarea', required: true, placeholder: 'Instructions for how your AI should behave' },
        { name: 'knowledgeBase', label: 'Knowledge Base', type: 'file', required: false }
      ]
    },
    {
      id: 'chat',
      title: 'Simple Chat Interface',
      description: 'Create a basic chat interface that can be embedded in any website',
      gradient: 'from-pink-500 to-rose-600',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      fields: [
        { name: 'chatName', label: 'Chat Name', type: 'text', required: true, placeholder: 'e.g., CustomerSupport, AskMe' },
        { name: 'welcomeMessage', label: 'Welcome Message', type: 'textarea', required: true, placeholder: 'The first message users will see when they open the chat' },
        { name: 'theme', label: 'Theme Color', type: 'color', required: false },
        { name: 'avatarStyle', label: 'Avatar Style', type: 'text', placeholder: 'e.g., Circle, Square, None', required: false }
      ]
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject) {
      onSubmit(selectedProject, formData);
    }
  };

  const handleBackClick = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setSelectedProject(null);
      setAnimateIn(true);
    }, 300);
  };

  const selectedOption = PROJECT_OPTIONS.find(option => option.id === selectedProject);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Code Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Select a template to get started or create your own custom project
          </p>
        </div>

        {!selectedProject ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ${animateIn ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-10'}`}>
            {PROJECT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedProject(option.id)}
                className={`p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 text-left h-full border-2 border-transparent hover:border-indigo-500 dark:hover:border-indigo-400 group overflow-hidden relative`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg mr-4 bg-gradient-to-br ${option.gradient} text-white`}>
                    {option.icon}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {option.title}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{option.description}</p>
                <div className="flex justify-end">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline">
                    Get Started →
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-500 ${animateIn ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-10'}`}>
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={handleBackClick}
                className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to templates
              </button>
              
              <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedOption?.gradient} text-white`}>
                {selectedOption?.icon}
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {selectedOption?.title} Configuration
            </h2>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Select AI Model</h3>
              <ModelSelector
                selectedModel={selectedModel}
                onChange={onModelChange}
                models={[
                  'gpt-4o-mini',
                  'gpt-4o',
                  'o3-mini',
                  'o1-mini',
                  'claude-3-5-sonnet',
                  'deepseek-chat',
                  'deepseek-reasoner',
                  'gemini-2.0-flash',
                  'gemini-1.5-flash',
                  'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                  'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
                  'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
                  'mistral-large-latest',
                  'pixtral-large-latest',
                  'codestral-latest',
                  'google/gemma-2-27b-it',
                  'grok-beta'
                ]}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                All models are powered by Puter.js - no API keys required
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedOption?.fields.map((field) => (
                    <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          required={field.required}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          rows={4}
                          placeholder={field.placeholder}
                        />
                      ) : field.type === 'file' ? (
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-600 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                TXT, PDF, DOC, DOCX (MAX. 5MB)
                              </p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              required={field.required}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleInputChange(field.name, URL.createObjectURL(file));
                                }
                              }}
                              accept=".txt,.pdf,.doc,.docx"
                            />
                          </label>
                        </div>
                      ) : field.type === 'color' ? (
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            required={field.required}
                            value={formData[field.name] || '#4F46E5'}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="h-10 w-10 border-0 rounded-md cursor-pointer"
                          />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formData[field.name] || '#4F46E5'}
                          </span>
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          required={field.required}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`px-8 py-3 bg-gradient-to-r ${selectedOption?.gradient} text-white rounded-md hover:opacity-90 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg`}
                >
                  Generate {selectedOption?.title}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidedWorkflow; 