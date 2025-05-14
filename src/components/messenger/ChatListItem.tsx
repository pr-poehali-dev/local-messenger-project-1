
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import Avatar from './Avatar';
import { Chat } from './ChatList';
import TypingIndicator from './TypingIndicator';

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

const formatTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true, locale: ru });
};

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, isActive, onClick }) => {
  // Демонстрация разных статусов для пользователей
  const primaryUser = chat.users[0];
  const status = primaryUser?.status || 'offline';
  
  return (
    <div 
      className={`p-2 flex items-center gap-3 rounded-md cursor-pointer transition-colors
        ${isActive ? 'bg-messenger-selected' : 'hover:bg-messenger-hover'}`}
      onClick={onClick}
    >
      <div className="relative">
        {chat.isGroup ? (
          <div className="h-10 w-10 rounded-full bg-messenger-purple/20 flex items-center justify-center text-messenger-purple">
            <Icon name="Users" size={20} />
          </div>
        ) : (
          <Avatar
            src={chat.avatar}
            name={chat.name}
            status={status}
            lastSeen={primaryUser?.lastSeen}
          />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="font-medium truncate">{chat.name}</div>
          {chat.lastMessage && (
            <div className="text-xs text-muted-foreground">
              {formatTime(chat.lastMessage.time)}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground truncate flex items-center gap-1">
            {status === 'typing' ? (
              <div className="flex items-center">
                <span className="mr-1">Печатает</span>
                <TypingIndicator />
              </div>
            ) : chat.lastMessage ? (
              <span>
                {chat.lastMessage.isOwn && "Вы: "}
                {chat.lastMessage.text}
              </span>
            ) : (
              <span>Нет сообщений</span>
            )}
          </div>
          
          {chat.unreadCount > 0 && (
            <Badge variant="default" className="rounded-full px-2 py-0.5 text-xs">
              {chat.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
