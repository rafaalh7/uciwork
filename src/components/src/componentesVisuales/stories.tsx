// stories/Chat.stories.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChatContainer } from '../components/ChatContainer';
import { chatThemes } from '../themes/chatThemes';
import { Message, User } from '../types/chat';

const meta: Meta<typeof ChatContainer> = {
  title: 'Chat/Components',
  component: ChatContainer,
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;
type Story = StoryObj<typeof ChatContainer>;

// Datos de ejemplo
const sampleUser: User = {
  id: '1',
  name: 'Ana García',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
  status: 'online'
};

const sampleMessages: Message[] = [
  {
    id: '1',
    content: '¡Hola! ¿Cómo estás?',
    timestamp: new Date(Date.now() - 3600000),
    sender: 'other',
    status: 'read',
    type: 'text'
  },
  {
    id: '2',
    content: '¡Hola Ana! Estoy bien, gracias. ¿Y tú?',
    timestamp: new Date(Date.now() - 3500000),
    sender: 'user',
    status: 'read',
    type: 'text'
  },
  {
    id: '3',
    content: 'Estoy trabajando en el nuevo proyecto. ¿Podrías revisar los diseños cuando tengas un momento?',
    timestamp: new Date(Date.now() - 3400000),
    sender: 'other',
    status: 'read',
    type: 'text'
  },
  {
    id: '4',
    content: 'Claro, los reviso esta tarde y te comento.',
    timestamp: new Date(Date.now() - 3300000),
    sender: 'user',
    status: 'delivered',
    type: 'text'
  },
  {
    id: '5',
    content: 'Perfecto, gracias. ¿A qué hora aproximadamente?',
    timestamp: new Date(Date.now() - 3200000),
    sender: 'other',
    status: 'read',
    type: 'text'
  }
];

export const ModernTheme: Story = {
  args: {
    user: sampleUser,
    messages: sampleMessages,
    onSendMessage: (message) => console.log('Mensaje enviado:', message)
  }
};

export const DarkElegant: Story = {
  args: {
    user: sampleUser,
    messages: sampleMessages,
    onSendMessage: (message) => console.log('Mensaje enviado:', message)
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    )
  ]
};

export const WithErrorMessages: Story = {
  args: {
    user: sampleUser,
    messages: [
      ...sampleMessages,
      {
        id: '6',
        content: 'Este mensaje no se pudo enviar',
        timestamp: new Date(),
        sender: 'user',
        status: 'error',
        type: 'text'
      }
    ],
    onSendMessage: (message) => console.log('Mensaje enviado:', message)
  }
};

export const MobileView: Story = {
  args: {
    user: sampleUser,
    messages: sampleMessages,
    onSendMessage: (message) => console.log('Mensaje enviado:', message)
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  }
};