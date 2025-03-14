/** @jsxImportSource react */
import { Variants } from 'framer-motion';
import { ReactNode, FC } from 'react';
import { IconType } from 'react-icons';
import { HiCode, HiCog, HiLightningBolt, HiShieldCheck, HiSparkles, HiUserGroup } from 'react-icons/hi';
import { GitHubIcon, VSCodeIcon } from './components/IntegrationIcons';

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

export interface PlaygroundExample {
  title: string;
  prompt: string;
  response?: string;
}

export const playgroundExamples: PlaygroundExample[] = [
  {
    title: "Text Generation",
    prompt: "Write a creative story about a time-traveling detective."
  },
  {
    title: "Code Assistant",
    prompt: "Create a React component that implements a dark mode toggle."
  },
  {
    title: "Image Analysis",
    prompt: "Describe what you see in this image of a sunset over mountains."
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
  icon: FC;
  color: string;
}

export const integrationPartners: IntegrationPartner[] = [
  {
    name: 'GitHub',
    icon: GitHubIcon,
    color: 'from-gray-600 to-gray-800'
  },
  {
    name: 'VS Code',
    icon: VSCodeIcon,
    color: 'from-blue-500 to-blue-700'
  }
];

export interface InteractiveFeature {
  title: string;
  description: string;
  icon: IconType;
  demo?: () => void;
  onDemoClick?: () => void;
}

export const interactiveFeatures: InteractiveFeature[] = [
  {
    title: "Advanced AI Models",
    description: "Access state-of-the-art language models for various tasks.",
    icon: HiSparkles
  },
  {
    title: "Real-time Processing",
    description: "Get instant responses with our optimized infrastructure.",
    icon: HiLightningBolt
  },
  {
    title: "Secure & Private",
    description: "Enterprise-grade security for your data and communications.",
    icon: HiShieldCheck
  },
  {
    title: "Developer Tools",
    description: "Comprehensive SDKs and APIs for seamless integration.",
    icon: HiCode
  },
  {
    title: "Team Collaboration",
    description: "Built-in features for team workflows and sharing.",
    icon: HiUserGroup
  },
  {
    title: "Custom Solutions",
    description: "Tailored AI solutions for your specific needs.",
    icon: HiCog
  }
];

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our services",
    features: [
      "Access to basic models",
      "100 requests per month",
      "Community support",
      "Basic documentation"
    ],
    cta: "Get Started"
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For professionals and small teams",
    features: [
      "Access to all models",
      "10,000 requests per month",
      "Priority support",
      "Advanced documentation",
      "Team management",
      "Custom integrations"
    ],
    cta: "Start Free Trial",
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per month",
    description: "For large organizations",
    features: [
      "Custom model training",
      "Unlimited requests",
      "24/7 dedicated support",
      "Custom SLA",
      "Advanced security",
      "On-premise deployment"
    ],
    cta: "Contact Sales"
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