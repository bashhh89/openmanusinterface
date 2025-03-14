'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    title: 'AI-Powered Creation',
    description: 'Transform any idea into functional tools instantly. From simple automations to complex applications, QanDu's AI understands and implements your vision.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
  },
  {
    title: 'Unified Workspace',
    description: 'Replace multiple subscriptions with a single powerful platform. Build, customize, and launch tools that perfectly match your workflow.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>'
  },
  {
    title: 'Limitless Customization',
    description: 'Every tool is fully customizable through our interactive editor. Make real-time changes and see instant previews of your modifications.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
  }
];

const showcaseTools = [
  {
    title: 'Smart Invoice Generator',
    description: 'Create professional invoices with automatic calculations, custom branding, and multiple export options.',
    preview: 'Generate branded invoices in seconds with smart field detection and tax calculations.',
    icon: '💼'
  },
  {
    title: 'Dynamic Proposal Builder',
    description: 'Build winning proposals with AI-powered content suggestions and beautiful responsive templates.',
    preview: 'Craft compelling proposals that stand out and win more business.',
    icon: '📝'
  },
  {
    title: 'Custom CRM Builder',
    description: 'Design your perfect customer relationship management system with automated workflows and integrations.',
    preview: 'Manage customer relationships your way with a fully customized CRM solution.',
    icon: '🤝'
  },
  {
    title: 'Website Generator',
    description: 'Create stunning websites with AI-powered design suggestions and instant preview capabilities.',
    preview: 'Launch your web presence in minutes with intelligent design assistance.',
    icon: '🌐'
  }
];

const faqItems = [
  {
    question: 'How does QanDu transform ideas into tools?',
    answer: 'QanDu uses advanced AI to understand your requirements and automatically generates the necessary code, functions, and UI components. Simply describe what you want to build, and our autonomous AI agent handles the technical implementation while you focus on your business needs.'
  },
  {
    question: 'Can I customize the tools I create?',
    answer: 'Absolutely! Every tool you create can be fully customized using our interactive editor. Make changes in real-time, see instant previews, and let our AI assist with modifications. You have complete control over the functionality and appearance.'
  },
  {
    question: 'Do I need technical expertise?',
    answer: 'Not at all! QanDu is designed for everyone, from entrepreneurs to small business owners. Simply describe what you want to build in plain language, and our AI will handle all the technical details while you focus on your business goals.'
  },
  {
    question: 'How does QanDu compare to using multiple specialized tools?',
    answer: 'Instead of managing multiple subscriptions and learning different platforms, QanDu lets you create custom tools that perfectly match your needs. Save time and resources while getting exactly what you want - all in one unified platform.'
  }
];

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full animate-slow-spin opacity-20">
          <div className="absolute inset-0 bg-gradient-conic from-purple-500/30 via-transparent to-transparent" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(121,40,202,0.3)_0%,rgba(0,0,0,0)_60%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.3)_0%,rgba(0,0,0,0)_60%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              QanDu
            </div>
            <div className="flex gap-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#showcase" className="text-gray-300 hover:text-white transition-colors">Showcase</a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center max-w-5xl mx-auto pt-20 md:pt-32 pb-16 px-4">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300">
              <span className="mr-2">✨</span>
              <span>Turn Any Idea Into Reality</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-gradient-shift bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-gradient-size pb-2">
              Your AI-Powered Workspace
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              Create custom tools and applications instantly with our autonomous AI agent. Say goodbye to multiple subscriptions - build exactly what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/create" className="group px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-purple-900/30">
                <span className="flex items-center justify-center gap-2">
                  Start Creating
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="transform group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <button 
                onClick={() => setActiveAccordion(0)} 
                className="px-8 py-4 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 font-medium transition-all duration-300 transform hover:scale-105"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <section id="features" className="py-20 md:py-32 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
              Everything You Need
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/10"
                >
                  <div className="text-purple-400 mb-4 transform group-hover:scale-110 transition-transform" dangerouslySetInnerHTML={{ __html: feature.icon }} />
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-300 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Showcase Section */}
        <section id="showcase" className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
              What Will You Create?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {showcaseTools.map((tool, index) => (
                <div
                  key={index}
                  className="relative group rounded-2xl bg-gradient-to-b from-white/10 to-transparent p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="text-4xl mb-4 animate-float">{tool.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-300 transition-colors">{tool.title}</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors mb-4">{tool.description}</p>
                  <div className={`absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8`}>
                    <p className="text-purple-200 font-medium">{tool.preview}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 relative">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
              Common Questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div 
                  key={index} 
                  className="rounded-lg bg-white/5 border border-white/10 overflow-hidden hover:border-purple-500/30 transition-colors"
                >
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/10 transition-colors"
                  >
                    <span className="font-medium text-white">{item.question}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-5 h-5 transform transition-transform ${activeAccordion === index ? 'rotate-180' : ''} text-purple-400`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      activeAccordion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <p className="px-6 py-4 text-gray-400">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300">
              Ready to Transform Your Ideas?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Start creating powerful custom tools that perfectly match your workflow. No coding required.
            </p>
            <Link href="/create" className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-purple-900/30">
              Get Started Now
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} QanDu. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}