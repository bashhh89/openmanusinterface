import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  return (
    <div className={`mb-6 ${role === 'user' ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block max-w-[85%] md:max-w-[75%] p-4 rounded-lg ${
          role === 'user'
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
        }`}
      >
        <div className="text-sm font-semibold mb-2">
          {role === 'user' ? 'You' : 'AI Assistant'}
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              pre({ children }) {
                return <div className="overflow-auto">{children}</div>;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 