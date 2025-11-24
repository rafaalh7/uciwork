// themes/chatThemes.ts
import { ChatTheme } from '../types/chat';

export const chatThemes: Record<string, ChatTheme> = {
  modern: {
    name: 'Modern',
    colors: {
      primary: 'rgb(59 130 246)',
      secondary: 'rgb(99 102 241)',
      background: 'rgb(249 250 251)',
      surface: 'rgb(255 255 255)',
      text: 'rgb(17 24 39)',
      textSecondary: 'rgb(107 114 128)'
    },
    rounded: 'rounded-xl',
    shadows: 'shadow-lg'
  },
  darkElegant: {
    name: 'Dark Elegant',
    colors: {
      primary: 'rgb(139 92 246)',
      secondary: 'rgb(168 85 247)',
      background: 'rgb(17 24 39)',
      surface: 'rgb(31 41 55)',
      text: 'rgb(243 244 246)',
      textSecondary: 'rgb(156 163 175)'
    },
    rounded: 'rounded-2xl',
    shadows: 'shadow-2xl'
  },
  minimal: {
    name: 'Minimal',
    colors: {
      primary: 'rgb(22 163 74)',
      secondary: 'rgb(34 197 94)',
      background: 'rgb(255 255 255)',
      surface: 'rgb(248 250 252)',
      text: 'rgb(15 23 42)',
      textSecondary: 'rgb(100 116 139)'
    },
    rounded: 'rounded-lg',
    shadows: 'shadow-sm'
  }
};