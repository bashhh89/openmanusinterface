'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// Testimonial data
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "AI Developer",
    company: "TechCorp",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23718096'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='white' text-anchor='middle' dy='.3em'%3ESJ%3C/text%3E%3C/svg%3E",
    quote: "This platform has revolutionized how we interact with AI models. The no-API-key approach is brilliant!"
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "InnovateLabs",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%234A5568'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='white' text-anchor='middle' dy='.3em'%3EMC%3C/text%3E%3C/svg%3E",
    quote: "The variety of AI models and the seamless interface make this an indispensable tool for our team."
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist",
    company: "DataFlow",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%232D3748'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='white' text-anchor='middle' dy='.3em'%3EER%3C/text%3E%3C/svg%3E",
    quote: "I've tried many AI platforms, but this one stands out for its simplicity and powerful features."
  }
];

// Pricing plans
const pricingPlans = [
  {
    name: "Free",
    price: "0",
    features: [
      "Access to GPT-4o-mini",
      "Basic chat interface",
      "Standard response time",
      "Community support"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "19",
    features: [
      "All Free features",
      "Access to all AI models",
      "Priority response time",
      "Advanced chat features",
      "Email support"
    ],
    cta: "Try Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "All Pro features",
      "Custom model fine-tuning",
      "Dedicated support",
      "SLA guarantees",
      "Custom integrations"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export default function LandingPage() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(testimonialInterval);
  }, []);

  return (
    <main className="min-h-screen">
      <div className="dark:bg-gray-900 min-h-screen relative overflow-hidden">
        {/* Enhanced animated background gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(121,40,202,0.3)_0%,rgba(0,0,0,0)_60%)] dark:opacity-60 animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.3)_0%,rgba(0,0,0,0)_60%)] dark:opacity-60 animate-pulse delay-1000"></div>
          <div className="absolute w-full h-full bg-[linear-gradient(40deg,rgba(121,40,202,0.05),rgba(59,130,246,0.05))] dark:opacity-30"></div>
        </div>

        {/* Enhanced Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8 relative z-10">
              <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Powered by 17+ AI Models
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400 pb-2 animate-gradient-shift">
                  AI Web Explorer
                </h1>
                <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Experience the future of AI interaction with our seamless interface.
                  No API keys required - just pure innovation at your fingertips.
                </p>
              </div>

              <div className={`flex justify-center gap-4 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <Link 
                  href="/"
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-500 hover:to-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Start Exploring
                </Link>
                <a 
                  href="#features" 
                  className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-sm text-gray-700 dark:text-gray-200 font-medium hover:bg-white/20 transition-all duration-200"
                >
                  Learn More
                </a>
              </div>

              {/* Demo Preview */}
              <div className={`mt-12 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="relative mx-auto max-w-5xl">
                  <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10">
                    <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white/50 text-lg">Demo Preview</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              AI Web Explorer
            </div>
            <div className="hidden md:flex gap-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#demo" className="text-gray-300 hover:text-white transition-colors">Demo</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
            </div>
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          <div 
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen 
                ? 'max-h-64 opacity-100 mt-4' 
                : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-white/10">
              <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#demo" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Demo</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Testimonials</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="block px-3 py-2 text-gray-300 hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
        </nav>

        {/* Features Grid */}
        <section id="features" className="relative py-20 bg-gray-50/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Powered by Leading AI Models
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Access the most advanced AI models from top providers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* OpenAI Card */}
              <div className="group bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">OpenAI Models</h3>
                <p className="text-gray-600 dark:text-gray-400">GPT-4O Mini, GPT-4O, O3-Mini, and O1-Mini for versatile AI interactions.</p>
              </div>

              {/* Anthropic Card */}
              <div className="group bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Claude 3.5 Sonnet</h3>
                <p className="text-gray-600 dark:text-gray-400">Advanced language model from Anthropic for sophisticated AI conversations.</p>
              </div>

              {/* Google Card */}
              <div className="group bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/10 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Gemini Models</h3>
                <p className="text-gray-600 dark:text-gray-400">Gemini 2.0 Flash and 1.5 Flash for rapid, powerful AI processing.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="relative py-20 bg-gradient-to-b from-transparent to-gray-50/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                See It in Action
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Experience the power of our AI models with these interactive demos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/10 hover:border-purple-500/30 transition-all duration-300">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/50 text-lg">Chat Demo</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  AI Chat Interface
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Experience natural conversations with our AI models. Try different personas and see the magic happen.
                </p>
                <Link
                  href="/demo/chat"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Try the Demo
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/10 hover:border-blue-500/30 transition-all duration-300">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/50 text-lg">Web Navigation Demo</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  AI Web Navigation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Watch as our AI navigates and interacts with web content in real-time.
                </p>
                <Link
                  href="/demo/web"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Try the Demo
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="relative py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                What Our Users Say
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Join thousands of satisfied users who have transformed their AI workflow
              </p>
            </div>

            <div className="relative">
              <div className="flex overflow-hidden">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`w-full flex-shrink-0 transition-all duration-500 transform ${
                      index === currentTestimonial ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    }`}
                    style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                  >
                    <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/10">
                      <div className="flex items-center mb-6">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {testimonial.role} at {testimonial.company}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-purple-500 w-6'
                        : 'bg-gray-400 hover:bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="relative py-20 bg-gradient-to-b from-transparent to-gray-50/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Choose the plan that best fits your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border transition-all duration-300 ${
                    plan.popular
                      ? 'border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : 'border-gray-200/10 hover:border-purple-500/30'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-gray-600 dark:text-gray-400">/month</span>
                    )}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500'
                        : 'bg-white/10 text-gray-900 dark:text-white hover:bg-white/20'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Accordion */}
        <section id="faq" className="relative py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Key Features
            </h2>

            <div className="space-y-4">
              {/* No API Keys Required */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200/10 overflow-hidden">
                <button 
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50/5"
                  onClick={() => setActiveAccordion(activeAccordion === 1 ? null : 1)}
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-white">No API Keys Required</span>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${activeAccordion === 1 ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`px-6 py-4 bg-gray-50/5 transition-all duration-200 ${activeAccordion === 1 ? 'block' : 'hidden'}`}>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start using advanced AI models instantly without any API key setup or configuration.
                  </p>
                </div>
              </div>

              {/* User-Friendly Interface */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200/10 overflow-hidden">
                <button 
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50/5"
                  onClick={() => setActiveAccordion(activeAccordion === 2 ? null : 2)}
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-white">Modern Interface</span>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${activeAccordion === 2 ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`px-6 py-4 bg-gray-50/5 transition-all duration-200 ${activeAccordion === 2 ? 'block' : 'hidden'}`}>
                  <p className="text-gray-600 dark:text-gray-400">
                    Clean, modern design with dark mode support, real-time response streaming, and intuitive model selection.
                  </p>
                </div>
              </div>

              {/* Enhanced Experience */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200/10 overflow-hidden">
                <button 
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50/5"
                  onClick={() => setActiveAccordion(activeAccordion === 3 ? null : 3)}
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-white">Smart Features</span>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${activeAccordion === 3 ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`px-6 py-4 bg-gray-50/5 transition-all duration-200 ${activeAccordion === 3 ? 'block' : 'hidden'}`}>
                  <p className="text-gray-600 dark:text-gray-400">
                    Smart keyboard shortcuts, loading states, error handling, and beautiful animations for an enhanced user experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-gray-50 dark:bg-gray-800/50 py-16 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                  AI Web Explorer
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                  Revolutionizing how developers and businesses interact with AI. No API keys, no hassle - just pure innovation.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                    <span className="sr-only">GitHub</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                  Product
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="/docs" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="/api" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      API
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                  Company
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200/10">
              <p className="text-center text-gray-400">
                © {new Date().getFullYear()} AI Web Explorer • Powered by Puter.js
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
} 