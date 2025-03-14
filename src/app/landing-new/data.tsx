import React, { ReactNode } from 'react';
import { Variants } from 'framer-motion';

export const featureCardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export interface AIModel {
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const aiModels: AIModel[] = [
  {
    name: 'GPT-4',
    description: 'Latest language model with advanced reasoning',
    icon: '🧠',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    name: 'Claude 3',
    description: 'Specialized in analysis and writing',
    icon: '🎯',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    name: 'Gemini',
    description: 'Multimodal understanding and generation',
    icon: '💫',
    color: 'from-emerald-500 to-teal-600'
  }
];

export interface UseCase {
  title: string;
  description: string;
  icon: string;
  demo: string;
}

export const useCases: UseCase[] = [
  {
    title: 'Content Creation',
    description: 'Generate high-quality content effortlessly',
    icon: '✍️',
    demo: '/demos/content.mp4'
  },
  {
    title: 'Code Generation',
    description: 'Transform natural language to code',
    icon: '💻',
    demo: '/demos/code.mp4'
  },
  {
    title: 'Data Analysis',
    description: 'Extract insights from complex datasets',
    icon: '📊',
    demo: '/demos/data.mp4'
  }
];

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
  period?: string;
  cta: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '$29',
    features: ['Basic AI access', '100k tokens/month', 'Email support'],
    popular: false,
    period: '/month',
    cta: 'Get Started'
  },
  {
    name: 'Pro',
    price: '$99',
    features: ['Advanced models', '1M tokens/month', 'Priority support'],
    popular: true,
    period: '/month',
    cta: 'Start Free Trial'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['Custom models', 'Unlimited tokens', 'Dedicated support'],
    popular: false,
    cta: 'Contact Sales'
  }
];

export interface PlaygroundExample {
  title: string;
  prompt: string;
  result: string;
  language?: string;
  preview?: boolean;
}

export const playgroundExamples: PlaygroundExample[] = [
  {
    title: 'Natural Language to Code',
    prompt: 'Create a React button component with hover effects',
    result: 'const Button = ({ children }) => {\n  return (\n    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">\n      {children}\n    </button>\n  );\n};',
    language: 'jsx',
    preview: true
  },
  {
    title: 'Content Generation',
    prompt: 'Write a product description for a smart coffee maker',
    result: 'Introducing the SmartBrew Pro - your personal barista powered by AI. This intelligent coffee maker learns your preferences, schedules your morning brew, and crafts the perfect cup every time.',
    language: 'text',
    preview: false
  }
];

export interface SuccessStory {
  company: string;
  quote: string;
  author: string;
  role: string;
  logo?: string;
  image?: string;
}

export const successStories: SuccessStory[] = [
  {
    company: 'TechCorp',
    quote: 'Increased development speed by 300%',
    author: 'Jane Smith',
    role: 'CTO',
    logo: '/logos/techcorp.svg',
    image: '/testimonials/jane.jpg'
  },
  {
    company: 'CreativeStudio',
    quote: 'Content creation time reduced by 75%',
    author: 'Mike Johnson',
    role: 'Creative Director',
    logo: '/logos/creativestudio.svg',
    image: '/testimonials/mike.jpg'
  }
];

export interface IntegrationPartner {
  name: string;
  icon: ReactNode;
  color: string;
}

export const GitHubIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const VSCodeIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
  </svg>
);

export const integrationPartners: IntegrationPartner[] = [
  {
    name: 'GitHub',
    icon: <GitHubIcon />,
    color: 'from-gray-600 to-gray-800'
  },
  {
    name: 'VS Code',
    icon: <VSCodeIcon />,
    color: 'from-blue-500 to-blue-700'
  }
];

export interface InteractiveFeature {
  title: string;
  description: string;
  icon: string;
  demo: (isHovered: boolean) => ReactNode;
}

export const CodeDemo = ({ isHovered }: { isHovered: boolean }) => (
  <div className="relative h-32 w-full bg-gray-800 rounded-lg p-4 font-mono text-sm">
    <div className="text-green-400">
      {`function hello() {
        console.log('Hello World');
      }`}
    </div>
  </div>
);

export const NLPDemo = ({ isHovered }: { isHovered: boolean }) => (
  <div className="relative h-32 w-full bg-gray-800 rounded-lg p-4">
    <div className="text-blue-400">Processing natural language...</div>
  </div>
);

export const interactiveFeatures: InteractiveFeature[] = [
  {
    title: 'Smart Code Completion',
    description: 'Real-time suggestions as you type',
    icon: '💡',
    demo: (isHovered) => <CodeDemo isHovered={isHovered} />
  },
  {
    title: 'Natural Language Processing',
    description: 'Convert text to working code',
    icon: '🔄',
    demo: (isHovered) => <NLPDemo isHovered={isHovered} />
  }
];

export interface Stat {
  label: string;
  value: string;
}

export const stats: Stat[] = [
  { label: 'Active Users', value: '100K+' },
  { label: 'Code Generated', value: '1M+' },
  { label: 'Time Saved', value: '1000K hrs' }
]; 