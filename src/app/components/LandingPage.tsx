'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-72 h-72 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-600 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              QanDu
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#examples" className="text-gray-300 hover:text-white transition-colors">Examples</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
            <button 
              onClick={onGetStarted}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-md transition-colors"
            >
              Get Started
            </button>
          </nav>
          <button 
            onClick={onGetStarted}
            className="md:hidden px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-md transition-colors"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-6xl font-bold leading-tight mb-6"
              >
                Transform Your Ideas into <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Beautiful Solutions</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-gray-300 mb-8 max-w-lg"
              >
                Create stunning business documents, proposals, and digital solutions instantly. One platform for all your business needs.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.button
                  onClick={onGetStarted}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-lg transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10">Get Started Now</span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                  />
                </motion.button>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-gray-900 to-purple-900/40 rounded-xl shadow-2xl overflow-hidden border border-purple-500/20 p-6">
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-3 h-20 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-48 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded"></div>
                      <div className="h-4 w-36 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded"></div>
                    </div>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="transform-preview relative"
                  >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500/20 px-4 py-1 rounded-full text-sm">
                      Your Idea
                    </div>
                    <div className="text-gray-400 mb-6 p-4 bg-black/20 rounded-lg">
                      "Create a professional business proposal for a tech startup"
                    </div>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      transition={{ delay: 0.8 }}
                      className="overflow-hidden"
                    >
                      <div className="absolute left-1/2 -translate-x-1/2 h-16 w-px bg-gradient-to-b from-purple-400 to-transparent"></div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-pink-500/20 px-4 py-1 rounded-full text-sm">
                        Beautiful Result
                      </div>
                      <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"></div>
                        <div className="h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"></div>
                        <div className="h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"></div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-purple-600 rounded-full opacity-20 blur-3xl -z-10"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 px-6 py-20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">How We Transform Your Ideas</span>
          </h2>
          <p className="text-gray-300 text-center mb-16 max-w-2xl mx-auto text-lg">
            Watch your concepts evolve into stunning, practical solutions through our seamless process
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Share Your Vision",
                description: "Tell us what you want to create - from business documents to digital solutions",
                icon: "💭"
              },
              {
                step: "2",
                title: "AI Magic",
                description: "Our AI transforms your idea into a structured framework",
                icon: "✨"
              },
              {
                step: "3",
                title: "Beautiful Design",
                description: "We apply stunning visuals and professional styling",
                icon: "🎨"
              },
              {
                step: "4",
                title: "Ready to Use",
                description: "Get your polished, practical solution instantly",
                icon: "🚀"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20 h-full">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-purple-400 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Showcase */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">See the Magic Happen</span>
          </h2>
          <p className="text-gray-300 text-center mb-16 max-w-2xl mx-auto text-lg">
            Watch how we transform simple ideas into stunning, practical solutions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-purple-900/40 rounded-xl p-8 border border-purple-500/20"
            >
              <div className="text-sm text-gray-400 mb-2">Input:</div>
              <div className="text-lg mb-6">"Create a modern sales presentation"</div>
              <div className="text-sm text-gray-400 mb-2">Result:</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"></div>
                <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"></div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-purple-900/40 rounded-xl p-8 border border-purple-500/20"
            >
              <div className="text-sm text-gray-400 mb-2">Input:</div>
              <div className="text-lg mb-6">"Design a professional invoice template"</div>
              <div className="text-sm text-gray-400 mb-2">Result:</div>
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">What Our Users Say</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                quote: "QanDu transformed how we create business documents. What used to take days now takes minutes.",
                author: "Sarah Chen",
                role: "Marketing Director"
              },
              {
                quote: "The quality of the generated content is incredible. It's like having a professional design team on demand.",
                author: "Michael Rodriguez",
                role: "Startup Founder"
              },
              {
                quote: "This tool has revolutionized our proposal process. Our close rate has improved significantly.",
                author: "Emily Thompson",
                role: "Sales Manager"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/20"
              >
                <div className="text-purple-400 text-4xl mb-4">"</div>
                <p className="text-gray-300 mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                  <div className="ml-4">
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Powerful Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Document Generation",
                description: "Create professional business proposals, reports, and presentations in seconds.",
                icon: (
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
              {
                title: "Custom Business Solutions",
                description: "Get tailored solutions for your specific business needs without complex setups.",
                icon: (
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )
              },
              {
                title: "Instant Results",
                description: "See your generated content immediately with our real-time preview feature.",
                icon: (
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/80 transition-colors"
              >
                <div className="bg-purple-900/30 p-3 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">What You Can Build</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Business Proposals",
                description: "Generate professional proposals that win clients.",
                image: "https://placehold.co/600x400/3a1c71/ffffff?text=Business+Proposal"
              },
              {
                title: "Marketing Materials",
                description: "Create compelling marketing content and presentations.",
                image: "https://placehold.co/600x400/4a1d95/ffffff?text=Marketing+Content"
              },
              {
                title: "Custom Reports",
                description: "Generate detailed business reports and analytics summaries.",
                image: "https://placehold.co/600x400/662d91/ffffff?text=Business+Reports"
              },
              {
                title: "Digital Solutions",
                description: "Build custom digital solutions for your business needs.",
                image: "https://placehold.co/600x400/8a2be2/ffffff?text=Digital+Solutions"
              }
            ].map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden group hover:bg-gray-800/50 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={example.image} 
                    alt={example.title} 
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{example.title}</h3>
                  <p className="text-gray-400 mb-4">{example.description}</p>
                  <button 
                    onClick={onGetStarted}
                    className="text-purple-400 hover:text-purple-300 transition-colors flex items-center"
                  >
                    Try it now
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border border-purple-700/50 rounded-2xl p-12 relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Transforming Your Business Today</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join businesses that are streamlining their operations and creating professional content with QanDu.
            </p>
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-lg transition-all duration-300"
            >
              Get Started for Free
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                QanDu
              </div>
              <p className="text-gray-400 mt-2">Transform Ideas into Reality</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} QanDu. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 