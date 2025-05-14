
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";
import ChatListItem from './ChatListItem';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from '@/types';

// Демо данные для чатов
export interface Chat {
  id: string;
  name: string;
  lastMessage?: {
    text: string;
    time: Date;
    isRead: boolean;
    isOwn: boolean;
  };
  unreadCount: number;
  isGroup: boolean;
  users: User[];
  avatar?: string;
}

interface ChatListProps {
  chats: Chat[];
  activeChat?: string;
  onChatSelect: (chatId: string) => void;
  onCreateChat: (name: string, users: User[]) => void;
  availableUsers: User[];
}

const ChatList: React.FC<ChatListProps> = ({ 
  chats, 
  activeChat, 
  onChatSelect,
  onCreateChat,
  availableUsers
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateChat = () => {
    if (newChatName.trim() && selectedUsers.length > 0) {
      onCreateChat(newChatName, selectedUsers);
      setNewChatName('');
      setSelectedUsers([]);
      setIsCreateChatOpen(false);
    }
  };

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="p-3 flex items-center justify-between">
        <div className="text-lg font-medium">Сообщения</div>
        
        <Dialog open={isCreateChatOpen} onOpenChange={setIsCreateChatOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <Icon name="PenSquare" size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новый чат</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Название чата"
                value={newChatName}
                onChange={e => setNewChatName(e.target.value)}
              />
              
              <div className="text-sm font-medium mb-2">Добавить участников:</div>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {availableUsers.map(user => (
                    <div 
                      key={user.id}
                      className={`p-2 flex items-center gap-2 rounded-md cursor-pointer ${
                        selectedUsers.some(u => u.id === user.id) 
                          ? 'bg-messenger-selected' 
                          : 'hover:bg-messenger-hover'
                      }`}
                      onClick={() => toggleUserSelection(user)}
                    >
                      <div className="flex-shrink-0">
                        <input 
                          type="checkbox" 
                          checked={selectedUsers.some(u => u.id === user.id)}
                          readOnly
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full bg-messenger-purple/20 flex items-center justify-center text-messenger-purple"
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>{user.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="flex justify-end">
                <Button onClick={handleCreateChat} disabled={!newChatName.trim() || selectedUsers.length === 0}>
                  Создать
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="px-3 py-2">
        <div className="relative">
          <Input
            placeholder="Поиск..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          <Icon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            size={16} 
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-1">
          {filteredChats.length > 0 ? (
            filteredChats.map(chat => (
              <ChatListItem 
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChat}
                onClick={() => onChatSelect(chat.id)}
              />
            ))
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              {searchTerm ? 'Чатов не найдено' : 'Нет доступных чатов'}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatList;
