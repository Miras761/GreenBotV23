import React from 'react';
import { Message, Role } from '../types';
import { BotIcon, UserIcon, ErrorIcon } from './icons';

interface MessageBubbleProps {
  message: Message;
}

const getRoleStyles = (role: Role) => {
  switch (role) {
    case Role.User:
      return {
        container: 'justify-end',
        bubble: 'bg-green-600 text-white rounded-br-none',
        icon: <UserIcon className="h-8 w-8 text-green-400"/>,
        order: 'order-2',
      };
    case Role.Model:
      return {
        container: 'justify-start',
        bubble: 'bg-gray-700 border-gray-600 text-gray-200 rounded-bl-none',
        icon: <BotIcon className="h-8 w-8 text-green-400"/>,
        order: '',
      };
    case Role.Error:
      return {
        container: 'justify-start',
        bubble: 'bg-red-900/50 border-red-500/50 text-red-300 rounded-bl-none',
        icon: <ErrorIcon className="h-8 w-8 text-red-400"/>,
        order: '',
      };
  }
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { container, bubble, icon, order } = getRoleStyles(message.role);

  return (
    <div className={`flex items-start gap-3 ${container}`}>
      {message.role !== Role.User && <div className="flex-shrink-0">{icon}</div>}
      <div className={`p-4 border rounded-lg max-w-xl ${bubble} ${order}`}>
        {message.image && (
          <img
            src={message.image}
            alt="User upload"
            className="rounded-md mb-2 max-h-48"
          />
        )}
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
       {message.role === Role.User && <div className="flex-shrink-0">{icon}</div>}
    </div>
  );
};
