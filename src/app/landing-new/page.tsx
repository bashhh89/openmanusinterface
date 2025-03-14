'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ParticleEffect } from './components/ParticleEffect';
import {
  featureCardVariants,
  aiModels,
  useCases,
  playgroundExamples,
  successStories,
  integrationPartners,
  interactiveFeatures,
  pricingPlans,
  stats,
  type PlaygroundExample,
  type PricingPlan,
  type InteractiveFeature
} from './data';

// Hero section animations
const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

// Stats animation
const statsData = [
  { value: 1000000, label: "API Calls Daily" },
  { value: 50000, label: "Active Users" },
  { value: 99.9, label: "Uptime %" },
  { value: 150, label: "Countries" }
];

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDemoIndex, setActiveDemoIndex] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [activePlayground, setActivePlayground] = useState<PlaygroundExample | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const demoInterval = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const statsRef = useRef<HTMLDivElement>(null);
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate demos
  useEffect(() => {
    demoInterval.current = setInterval(() => {
      setActiveDemoIndex(prev => (prev + 1) % useCases.length);
    }, 5000);

    return () => {
      if (demoInterval.current) {
        clearInterval(demoInterval.current);
      }
    };
  }, []);

  // Animated counter for stats
  const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(count);

    useEffect(() => {
      if (isStatsVisible) {
        const steps = 60;
        const increment = value / steps;
        const interval = duration * 1000 / steps;

        const timer = setInterval(() => {
          if (countRef.current < value) {
            setCount(prev => {
              const next = Math.min(prev + increment, value);
              countRef.current = next;
              return next;
            });
          } else {
            clearInterval(timer);
          }
        }, interval);

        return () => clearInterval(timer);
      }
    }, [isStatsVisible, value, duration]);

    return <span>{Math.round(count).toLocaleString()}</span>;
  };

  // Intersection observer for stats section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStatsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  // Add smooth scrolling behavior through CSS
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.documentElement.style.scrollBehavior = '';
      }
    };
  }, []);

  const handlePlaygroundSubmit = async () => {
    if (!activePlayground) return;
    setIsGenerating(true);
    try {
      const response = await puter.ai.chat(activePlayground.prompt);
      setActivePlayground({
        ...activePlayground,
        response: response.text
      });
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(121,40,202,0.3)_0%,rgba(0,0,0,0)_60%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.3)_0%,rgba(0,0,0,0)_60%)] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 opacity-90"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/80 backdrop-blur-md py-4' : 'py-6'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              AI Explorer
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#models" className="text-gray-300 hover:text-white transition-colors">Models</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <Link 
                href="/login"
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                Sign In
              </Link>
              <Link 
                href="/signup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            {/* Floating Code Elements */}
            <motion.div 
              className="absolute top-0 left-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 opacity-60"
              animate={{
                y: [0, 20, 0],
                rotate: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg backdrop-blur-xl p-4">
                <pre className="text-xs text-blue-400">
                  {`function ai() {
  return magic();
}`}
                </pre>
              </div>
            </motion.div>

            <motion.div 
              className="absolute top-1/2 right-0 w-40 h-40 translate-x-1/2 opacity-60"
              animate={{
                y: [0, -20, 0],
                rotate: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <div className="w-full h-full bg-gradient-to-bl from-blue-500/20 to-purple-500/20 rounded-lg backdrop-blur-xl p-4">
                <pre className="text-xs text-purple-400">
                  {`const future = {
  ai: "unlimited"
};`}
                </pre>
              </div>
            </motion.div>

            {/* Main Hero Content */}
            <div className="relative z-10">
              <motion.div 
                className="inline-block mb-6"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-xl">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-medium">
                    Powered by Advanced AI Models
                  </span>
                </div>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200">
                  Your Gateway to
                </span>
                <br />
                <motion.span 
                  className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[size:200%]"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  AI Innovation
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-400 mb-12 leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Experience the power of multiple AI models in one unified interface.
                <br />
                No API keys required - just pure innovation at your fingertips.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <Link 
                  href="/signup"
                  className="group relative w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105 font-medium text-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-blue-600/50 blur-xl group-hover:blur-2xl transition-all"></div>
                  <span className="relative">Start Building for Free</span>
                </Link>
                
                <a 
                  href="#demo"
                  className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-medium text-lg flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  <span>Watch Demo</span>
                  <motion.svg 
                    className="w-5 h-5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </motion.svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(121,40,202,0.3)_0%,rgba(0,0,0,0)_60%)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.3)_0%,rgba(0,0,0,0)_60%)] animate-pulse delay-1000"></div>
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 50% 50%, rgba(121,40,202,0.1) 0%, rgba(0,0,0,0) 50%)",
                "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 50%)",
                "radial-gradient(circle at 50% 50%, rgba(121,40,202,0.1) 0%, rgba(0,0,0,0) 50%)",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          ></motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 opacity-90"></div>
        </div>

        {/* Particle Effect */}
        <ParticleEffect />
      </section>

      {/* Interactive Playground Section */}
      <section id="demo" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Experience AI in Action
            </h2>
            <p className="text-xl text-gray-400">
              Try out our AI models with these interactive examples. No signup required.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Interactive Demo */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
              }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm text-gray-500">AI Playground</div>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <div className="relative p-8 rounded-2xl bg-gray-900/50 border border-gray-800">
                    <textarea
                      value={activePlayground?.prompt || ""}
                      onChange={(e) => {
                        if (!activePlayground) return;
                        setActivePlayground({
                          ...activePlayground,
                          prompt: e.target.value
                        });
                      }}
                      placeholder="Ask anything..."
                      className="w-full h-32 bg-gray-950 rounded-xl p-4 text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                    />
                    <button
                      onClick={handlePlaygroundSubmit}
                      disabled={!activePlayground || isGenerating}
                      className={`absolute bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !activePlayground || isGenerating
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-500 text-white'
                      }`}
                    >
                      {isGenerating ? 'Generating...' : 'Generate →'}
                    </button>
                  </div>
                </div>

                {activePlayground?.response && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 rounded-xl bg-gray-900/50 border border-gray-800"
                  >
                    <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">
                      {activePlayground.response}
                    </pre>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Example Cards */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {playgroundExamples.map((example) => (
                  <motion.div
                    key={example.title}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActivePlayground(example)}
                    className={`cursor-pointer p-4 rounded-xl transition-colors ${
                      activePlayground === example
                        ? 'bg-purple-600/20 border border-purple-500/30'
                        : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <h3 className="font-medium text-lg mb-2">{example.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{example.prompt}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(121,40,202,0.2)_0%,rgba(0,0,0,0)_60%)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2)_0%,rgba(0,0,0,0)_60%)] animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            className="max-w-4xl mx-auto text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Powerful Features at Your Fingertips
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to build amazing AI-powered applications
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {interactiveFeatures.map((feature: InteractiveFeature, index) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: index * 0.1 }
                  }
                }}
                whileHover="hover"
                className="relative"
              >
                <motion.div
                  className="group relative h-full bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 overflow-hidden"
                  variants={{
                    hover: {
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }
                  }}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Icon */}
                  <motion.div
                    className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center"
                    variants={{
                      hover: {
                        scale: 1.1,
                        rotate: [0, 5, -5, 0],
                        transition: {
                          rotate: {
                            duration: 0.5,
                            ease: 'easeInOut',
                            repeat: Infinity,
                          }
                        }
                      }
                    }}
                  >
                    <feature.icon className="w-6 h-6 text-purple-400" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 mb-6">{feature.description}</p>

                  {/* Interactive Demo Button */}
                  <motion.button
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2"
                    variants={{
                      hover: {
                        x: 5,
                        transition: { duration: 0.2 }
                      }
                    }}
                    onClick={() => feature.onDemoClick?.()}
                  >
                    Try it out
                    <motion.svg
                      className="w-4 h-4"
                      variants={{
                        hover: {
                          x: [0, 5, 0],
                          transition: {
                            duration: 1,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }
                        }
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </motion.button>

                  {/* Feature Demo */}
                  {feature.demo && (
                    <motion.div
                      className="mt-6 p-4 bg-gray-950 rounded-xl"
                      variants={{
                        hover: {
                          y: [0, -5, 0],
                          transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }
                        }
                      }}
                    >
                      {feature.demo}
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(121,40,202,0.15)_0%,rgba(0,0,0,0)_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.15)_0%,rgba(0,0,0,0)_50%)]"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  <AnimatedCounter value={stat.value} />
                  {stat.label === "Uptime %" && "%"}
                </div>
                <div className="mt-2 text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-gray-400">See how others are transforming their workflow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.company}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative p-8 rounded-2xl bg-gray-900/50 border border-gray-800">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-16 rounded-full bg-gray-800 p-2">
                      <div className="w-full h-full rounded-full bg-gray-700" />
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <blockquote className="text-xl font-medium mb-6">"{story.quote}"</blockquote>
                    <div className="text-gray-400">
                      <div className="font-semibold">{story.author}</div>
                      <div>{story.role}</div>
                      <div className="font-medium text-purple-400">{story.company}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Partners Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Seamless Integrations</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Connect with your favorite tools and platforms
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {integrationPartners.map((partner) => {
              const Icon = partner.icon;
              return (
                <motion.div
                  key={partner.name}
                  className={`relative p-6 rounded-xl bg-gradient-to-br ${partner.color}`}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Icon />
                  <p className="mt-4 text-white font-medium">{partner.name}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="relative py-20 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-full max-w-2xl"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    {/* Interactive Terminal Demo */}
                    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                      <div className="flex items-center px-4 py-2 bg-gray-800">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                      <div className="p-4 font-mono text-sm">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <span className="text-green-400">$</span> ai generate landing page
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <span className="text-blue-400">AI:</span> Creating a modern landing page...
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                          >
                            <span className="text-purple-400">→</span> Generated components
                            <br />
                            <span className="text-purple-400">→</span> Added animations
                            <br />
                            <span className="text-purple-400">→</span> Optimized for mobile
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                          >
                            <span className="text-green-400">✓</span> Landing page ready!
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section id="models" className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Supported AI Models</h2>
            <p className="text-xl text-gray-400">Access the most powerful AI models through a single interface</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiModels.map((model, index) => (
              <motion.div
                key={model.name}
                variants={featureCardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/30 transition-all">
                  <div className="text-4xl mb-4">{model.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{model.name}</h3>
                  <p className="text-gray-400">{model.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="relative py-20 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What You Can Build</h2>
            <p className="text-xl text-gray-400">Transform your workflow with AI-powered solutions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                variants={featureCardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="aspect-video bg-gray-800 flex items-center justify-center text-4xl">
                    {useCase.icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                    <p className="text-gray-400">{useCase.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan: PricingPlan) => (
              <motion.div
                key={plan.name}
                className={`relative p-8 rounded-2xl border ${
                  plan.highlighted
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-gray-800 bg-gray-900/50'
                }`}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 ml-2">{plan.period}</span>}
                </div>
                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of developers and businesses already using our platform
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all font-medium text-lg"
              >
                Start Building for Free
              </Link>
              <Link 
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-medium text-lg"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4 inline-block">
                AI Explorer
              </Link>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering developers and businesses with advanced AI capabilities through a simple, unified interface.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#models" className="text-gray-400 hover:text-white transition-colors">Models</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/docs" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-center text-gray-400">
              © {new Date().getFullYear()} AI Explorer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 