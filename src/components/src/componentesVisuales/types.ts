// types/chat.ts
export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'other';
  status: 'sent' | 'delivered' | 'read' | 'error';
  type: 'text' | 'image' | 'file';
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

export interface ChatTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  rounded: string;
  shadows: string;
}