import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryEntry {
  id: string;
  content: string;
  timestamp: number;
  url?: string;
  projectName?: string;
  description?: string;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  currentIndex: number;
  onSelectHistory: (entry: HistoryEntry) => void;
  onRenameProject?: (id: string, newName: string) => void;
  onAddDescription?: (id: string, description: string) => void;
}

export default function HistorySidebar({
  isOpen,
  onClose,
  history,
  currentIndex,
  onSelectHistory,
  onRenameProject,
  onAddDescription
}: HistorySidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before animations
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    
    // If it's today, just show the time
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If it's yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show the full date
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const startEditing = (entry: HistoryEntry) => {
    setEditingId(entry.id);
    setEditingName(entry.projectName || '');
    setEditingDescription(entry.description || '');
  };

  const saveEdit = () => {
    if (editingId && onRenameProject && onAddDescription) {
      onRenameProject(editingId, editingName);
      onAddDescription(editingId, editingDescription);
      setEditingId(null);
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-40"
            style={{ backdropFilter: 'blur(4px)' }}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gray-900 shadow-2xl z-50 overflow-hidden rounded-l-xl border-l border-gray-700"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Project History
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-300 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* History List */}
            <div className="overflow-y-auto h-[calc(100vh-4rem)] bg-gray-900 pb-20">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 p-8 text-center">
                  <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium">No project history yet</p>
                  <p className="mt-2">Your generated projects will appear here</p>
                </div>
              ) : (
                history.map((entry, index) => (
                  <motion.div
                    key={`entry-${entry.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                      index === currentIndex ? 'bg-purple-900/20 border-l-4 border-l-purple-500' : ''
                    }`}
                  >
                    {/* Entry Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        {editingId === entry.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Project name"
                            autoFocus
                          />
                        ) : (
                          <h3 className="text-lg font-medium text-white group flex items-center">
                            <span className="mr-2 text-purple-400 group-hover:text-purple-300">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </span>
                            {entry.projectName || `Project ${index + 1}`}
                          </h3>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleExpand(entry.id)}
                          className="p-1 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                          <svg
                            className={`w-5 h-5 transform transition-transform ${
                              expandedItems.has(entry.id) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {editingId === entry.id ? (
                          <button
                            onClick={saveEdit}
                            className="p-1 text-green-400 hover:bg-green-900/30 rounded-full transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditing(entry)}
                            className="p-1 text-blue-400 hover:bg-blue-900/30 rounded-full transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Entry Content */}
                    <AnimatePresence>
                      {expandedItems.has(entry.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3 overflow-hidden"
                        >
                          <div className="text-sm text-gray-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTimestamp(entry.timestamp)}
                          </div>
                          
                          {editingId === entry.id ? (
                            <textarea
                              value={editingDescription}
                              onChange={(e) => setEditingDescription(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[80px] resize-none"
                              placeholder="Add description..."
                            />
                          ) : (
                            entry.description && (
                              <p className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded-md border-l-2 border-purple-500">
                                {entry.description}
                              </p>
                            )
                          )}

                          <div className="flex flex-wrap gap-2 pt-2">
                            <button
                              onClick={() => onSelectHistory(entry)}
                              className="px-3 py-1.5 text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-md transition-colors flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              Load Project
                            </button>
                            {entry.url && (
                              <button
                                onClick={() => copyToClipboard(entry.url!)}
                                className="px-3 py-1.5 text-sm text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 rounded-md transition-colors flex items-center"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Copy URL
                              </button>
                            )}
                            <button
                              onClick={() => copyToClipboard(entry.content)}
                              className="px-3 py-1.5 text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-md transition-colors flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy Content
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 