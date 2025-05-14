
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import MessageInput from './MessageInput';
import Message, { MessageType } from './Message';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from '@/types';
import { Chat } from './ChatList';

interface ChatViewProps {
  chat?: Chat;
  messages: MessageType[];
  onSendMessage: (text: string) => void;
  onTyping: () => void;
  onDeleteChat?: () => void;
  onLeaveChatGroup?: () => void;
  onAddUserToChat?: (userId: string) => void;
  onRemoveUserFromChat?: (userId: string) => void;
  currentUserId: string;
  availableUsers: User[];
}

const ChatView: React.FC<ChatViewProps> = ({
  chat,
  messages,
  onSendMessage,
  onTyping,
  onDeleteChat,
  onLeaveChatGroup,
  onAddUserToChat,
  onRemoveUserFromChat,
  currentUserId,
  availableUsers
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Прокручиваем к последнему сообщению при обновлении списка сообщений
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center flex-col p-4 text-center text-muted-foreground">
        <Icon name="MessagesSquare" size={64} className="mb-4 text-messenger-purple/30" />
        <h3 className="text-xl font-medium">Выберите чат для начала общения</h3>
        <p className="mt-2">Или создайте новый чат, нажав на кнопку в левом меню</p>
      </div>
    );
  }

  // Определяем, является ли текущий пользователь админом группы
  const isCurrentUserAdmin = chat.isGroup && chat.users.some(
    user => user.id === currentUserId && user.isAdmin
  );

  // Пользователи, которых можно добавить в чат (те, которых ещё нет в чате)
  const usersToAdd = availableUsers.filter(
    user => user.id !== currentUserId && !chat.users.some(chatUser => chatUser.id === user.id)
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          {chat.isGroup ? (
            <div className="h-10 w-10 rounded-full bg-messenger-purple/20 flex items-center justify-center text-messenger-purple">
              <Icon name="Users" size={20} />
            </div>
          ) : (
            <Avatar
              src={chat.avatar}
              name={chat.name}
              status={chat.users[0]?.status || 'offline'}
              lastSeen={chat.users[0]?.lastSeen}
              showStatusText
            />
          )}
          
          <div>
            <div className="font-medium">{chat.name}</div>
            {chat.isGroup && (
              <div className="text-xs text-muted-foreground">
                {chat.users.length} участников
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <Icon name="MoreVertical" size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {chat.isGroup && (
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Icon name="Users" className="mr-2 h-4 w-4" />
                        <span>Участники</span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Участники чата</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 space-y-2">
                        {chat.users.map(user => (
                          <div key={user.id} className="flex items-center justify-between p-2 rounded-md hover:bg-messenger-hover">
                            <div className="flex items-center gap-2">
                              <Avatar
                                name={user.name}
                                src={user.avatar}
                                size="sm"
                                status={user.status}
                              />
                              <div>
                                <div className="font-medium">{user.name}</div>
                                {user.isAdmin && (
                                  <div className="text-xs text-messenger-purple">Админ</div>
                                )}
                              </div>
                            </div>
                            
                            {isCurrentUserAdmin && user.id !== currentUserId && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => onRemoveUserFromChat && onRemoveUserFromChat(user.id)}
                              >
                                <Icon name="UserMinus" size={16} />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {isCurrentUserAdmin && usersToAdd.length > 0 && (
                        <>
                          <div className="mt-6 mb-2 font-medium">Добавить пользователей</div>
                          <div className="space-y-2">
                            {usersToAdd.map(user => (
                              <div key={user.id} className="flex items-center justify-between p-2 rounded-md hover:bg-messenger-hover">
                                <div className="flex items-center gap-2">
                                  <Avatar
                                    name={user.name}
                                    src={user.avatar}
                                    size="sm"
                                  />
                                  <div className="font-medium">{user.name}</div>
                                </div>
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => onAddUserToChat && onAddUserToChat(user.id)}
                                >
                                  <Icon name="UserPlus" size={16} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  {isCurrentUserAdmin && (
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onSelect={() => onDeleteChat && onDeleteChat()}
                    >
                      <Icon name="Trash2" className="mr-2 h-4 w-4" />
                      <span>Удалить чат</span>
                    </DropdownMenuItem>
                  )}
                  
                  {!isCurrentUserAdmin && (
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onSelect={() => onLeaveChatGroup && onLeaveChatGroup()}
                    >
                      <Icon name="LogOut" className="mr-2 h-4 w-4" />
                      <span>Покинуть чат</span>
                    </DropdownMenuItem>
                  )}
                </>
              )}
              
              {!chat.isGroup && (
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onSelect={() => onDeleteChat && onDeleteChat()}
                >
                  <Icon name="Trash2" className="mr-2 h-4 w-4" />
                  <span>Удалить чат</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {messages.length > 0 ? (
          <div>
            {messages.map((message, index) => {
              // Определяем, нужно ли показывать имя отправителя
              // (в групповых чатах для не своих сообщений)
              const showSender = chat.isGroup && !message.isOwn;
              
              return (
                <Message 
                  key={message.id} 
                  message={message} 
                  showSender={showSender}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center text-muted-foreground">
            <div>
              <p>Нет сообщений</p>
              <p className="text-sm">Начните общение прямо сейчас</p>
            </div>
          </div>
        )}
      </ScrollArea>
      
      <MessageInput onSendMessage={onSendMessage} onTyping={onTyping} />
    </div>
  );
};

export default ChatView;
