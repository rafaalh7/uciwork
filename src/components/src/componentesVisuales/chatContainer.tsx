// components/ChatContainer.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message, User, ChatTheme } from '../types/chat';

interface ChatContainerProps {
  user: User;
  messages: Message[];
  onSendMessage: (message: string) => void;
  theme?: ChatTheme;
  className?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  user,
  messages,
  onSendMessage,
  theme,
  className = ''
}) => {
  const handleMenuClick = () => console.log('Menu clicked');
  const handleCallClick = () => console.log('Call clicked');
  const handleVideoClick = () => console.log('Video clicked');
  const handleSearchClick = () => console.log('Search clicked');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col h-screen bg-gray-50 dark:bg-gray-900 ${className}`}
    >
      <ChatHeader
        user={user}
        onMenuClick={handleMenuClick}
        onCallClick={handleCallClick}
        onVideoClick={handleVideoClick}
        onSearchClick={handleSearchClick}
      />
      
      <MessageList messages={messages} />
      
      <MessageInput onSendMessage={onSendMessage} />
    </motion.div>
  );
};