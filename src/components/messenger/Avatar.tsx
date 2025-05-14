
import React from 'react';
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserStatus, { UserStatusType } from './UserStatus';

interface AvatarProps {
  src?: string;
  name: string;
  status?: UserStatusType;
  lastSeen?: Date;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  statusPosition?: 'bottom-right' | 'top-right';
  showStatusText?: boolean;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  status,
  lastSeen,
  size = 'md',
  statusPosition = 'bottom-right',
  showStatusText = false,
  onClick
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20'
  };

  const getFallbackInitials = () => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      <UIAvatar 
        className={`${sizeClasses[size]} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <AvatarImage src={src} alt={name} />
        <AvatarFallback className="bg-primary/20 text-primary">
          {getFallbackInitials()}
        </AvatarFallback>
      </UIAvatar>
      
      {status && (
        <div 
          className={`absolute ${
            statusPosition === 'bottom-right' 
              ? 'bottom-0 right-0' 
              : 'top-0 right-0'
          }`}
        >
          <UserStatus 
            status={status} 
            lastSeen={lastSeen} 
            className={showStatusText ? 'flex' : ''}
            showText={showStatusText}
          />
        </div>
      )}
    </div>
  );
};

export default Avatar;
