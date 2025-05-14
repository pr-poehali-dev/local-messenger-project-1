
import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export interface MessageType {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  isRead: boolean;
  isOwn: boolean;
}

interface MessageProps {
  message: MessageType;
  showSender?: boolean;
}

const Message: React.FC<MessageProps> = ({ message, showSender = false }) => {
  const { text, timestamp, isRead, isOwn, sender } = message;
  
  const formattedTime = format(timestamp, 'HH:mm', { locale: ru });
  
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[80%] rounded-lg py-2 px-3 
          ${isOwn 
            ? 'bg-primary text-white rounded-br-none' 
            : 'bg-secondary text-gray-800 rounded-bl-none'
          }`}
      >
        {showSender && !isOwn && (
          <div className="text-xs font-semibold mb-1">{sender.name}</div>
        )}
        
        <div className="break-words">{text}</div>
        
        <div className="flex items-center justify-end gap-1 text-xs mt-1">
          <span className={isOwn ? 'text-white/70' : 'text-gray-500'}>
            {formattedTime}
          </span>
          
          {isOwn && (
            <span>
              {isRead ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-white/70 h-3 w-3"
                >
                  <path d="M18 6 7 17l-5-5"/>
                  <path d="m22 10-8 8-4-4"/>
                </svg>
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-white/70 h-3 w-3"
                >
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
