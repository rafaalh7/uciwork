// components/MessageBubble.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck, AlertCircle } from 'lucide-react';
import { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  className = ''
}) => {
  const isUser = message.sender === 'user';

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <Check size={16} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={16} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={16} className="text-blue-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
        }`}
      >
        <p className="text-sm break-words">{message.content}</p>
        <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
          isUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span>
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          {isUser && getStatusIcon()}
        </div>
      </div>
    </motion.div>
  );
};