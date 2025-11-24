// components/ChatHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Phone, Video, Search } from 'lucide-react';
import { User } from '../types/chat';

interface ChatHeaderProps {
  user: User;
  onMenuClick: () => void;
  onCallClick: () => void;
  onVideoClick: () => void;
  onSearchClick: () => void;
  className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  onMenuClick,
  onCallClick,
  onVideoClick,
  onSearchClick,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                user.status === 'online'
                  ? 'bg-green-500'
                  : user.status === 'away'
                  ? 'bg-yellow-500'
                  : 'bg-gray-400'
              }`}
            />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.status === 'online' ? 'En línea' : 'Desconectado'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCallClick}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Phone size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onVideoClick}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Video size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSearchClick}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Search size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <MoreVertical size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};