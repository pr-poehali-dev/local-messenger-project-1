
import React from 'react';
import Icon from '@/components/ui/icon';

export type UserStatusType = 'online' | 'offline' | 'idle' | 'typing';

interface LastSeenProps {
  timestamp: Date;
}

export const LastSeen: React.FC<LastSeenProps> = ({ timestamp }) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  let statusText = '';
  
  if (diffInMinutes < 1) {
    statusText = 'только что';
  } else if (diffInMinutes < 60) {
    statusText = `был ${diffInMinutes} ${getRussianMinutesForm(diffInMinutes)} назад`;
  } else if (diffInHours < 24) {
    statusText = `был ${diffInHours} ${getRussianHoursForm(diffInHours)} назад`;
  } else if (diffInDays === 1) {
    statusText = 'был вчера';
  } else {
    statusText = `был ${diffInDays} ${getRussianDaysForm(diffInDays)} назад`;
  }
  
  return <span className="text-xs text-muted-foreground">{statusText}</span>;
};

function getRussianMinutesForm(minutes: number): string {
  if (minutes % 10 === 1 && minutes % 100 !== 11) {
    return 'минуту';
  } else if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100)) {
    return 'минуты';
  } else {
    return 'минут';
  }
}

function getRussianHoursForm(hours: number): string {
  if (hours % 10 === 1 && hours % 100 !== 11) {
    return 'час';
  } else if ([2, 3, 4].includes(hours % 10) && ![12, 13, 14].includes(hours % 100)) {
    return 'часа';
  } else {
    return 'часов';
  }
}

function getRussianDaysForm(days: number): string {
  if (days % 10 === 1 && days % 100 !== 11) {
    return 'день';
  } else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
    return 'дня';
  } else {
    return 'дней';
  }
}

interface UserStatusProps {
  status: UserStatusType;
  lastSeen?: Date;
  className?: string;
  showText?: boolean;
}

const UserStatus: React.FC<UserStatusProps> = ({ 
  status, 
  lastSeen, 
  className = "",
  showText = false
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-messenger-online';
      case 'typing':
        return 'bg-messenger-typing';
      case 'idle':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    if (!showText) return null;
    
    switch (status) {
      case 'online':
        return <span className="text-xs text-messenger-online">Онлайн</span>;
      case 'typing':
        return <span className="text-xs text-messenger-typing">Печатает...</span>;
      case 'idle':
        return <span className="text-xs text-yellow-400">Неактивен</span>;
      case 'offline':
        return lastSeen ? <LastSeen timestamp={lastSeen} /> : <span className="text-xs text-gray-400">Не в сети</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor()}`} />
      {getStatusText()}
    </div>
  );
};

export default UserStatus;
