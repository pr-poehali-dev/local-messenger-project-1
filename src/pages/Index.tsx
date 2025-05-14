
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoginForm from '@/components/auth/LoginForm';
import ChatList, { Chat } from '@/components/messenger/ChatList';
import ChatView from '@/components/messenger/ChatView';
import Icon from '@/components/ui/icon';
import UserProfileForm from '@/components/UserProfileForm';
import AdminPanel from '@/components/AdminPanel';
import { User } from '@/types';
import { MessageType } from '@/components/messenger/Message';

// Демо данные
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Анна Смирнова',
    email: 'anna@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    isAdmin: false,
    isOnline: true,
    status: 'online',
  },
  {
    id: '2',
    name: 'Иван Петров',
    email: 'ivan@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    isAdmin: true,
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    status: 'offline',
  },
  {
    id: '3',
    name: 'Мария Иванова',
    email: 'maria@example.com',
    isAdmin: false,
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 3),
    status: 'offline',
  },
  {
    id: '4',
    name: 'Александр Козлов',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    isAdmin: false,
    status: 'typing',
  },
];

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Анна Смирнова',
    lastMessage: {
      text: 'Привет! Как дела?',
      time: new Date(Date.now() - 1000 * 60 * 5),
      isRead: true,
      isOwn: false,
    },
    unreadCount: 0,
    isGroup: false,
    users: [mockUsers[0]],
    avatar: mockUsers[0].avatar,
  },
  {
    id: '2',
    name: 'Рабочий чат',
    lastMessage: {
      text: 'Давайте обсудим новый проект',
      time: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
      isOwn: true,
    },
    unreadCount: 3,
    isGroup: true,
    users: [mockUsers[0], mockUsers[1], mockUsers[2]],
  },
  {
    id: '3',
    name: 'Иван Петров',
    lastMessage: {
      text: 'Документы готовы, можно забирать',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
      isOwn: false,
    },
    unreadCount: 0,
    isGroup: false,
    users: [mockUsers[1]],
    avatar: mockUsers[1].avatar,
  },
];

const mockMessages: Record<string, MessageType[]> = {
  '1': [
    {
      id: '1',
      text: 'Привет! Как дела?',
      sender: {
        id: '1',
        name: 'Анна Смирнова',
        avatar: mockUsers[0].avatar,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isRead: true,
      isOwn: false,
    },
    {
      id: '2',
      text: 'Привет! У меня всё отлично, спасибо! А у тебя?',
      sender: {
        id: 'current',
        name: 'Вы',
        avatar: undefined,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      isRead: true,
      isOwn: true,
    },
    {
      id: '3',
      text: 'Тоже неплохо! Работаю над новым проектом.',
      sender: {
        id: '1',
        name: 'Анна Смирнова',
        avatar: mockUsers[0].avatar,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: true,
      isOwn: false,
    },
  ],
  '2': [
    {
      id: '1',
      text: 'Всем привет! У нас новый проект.',
      sender: {
        id: '2',
        name: 'Иван Петров',
        avatar: mockUsers[1].avatar,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isRead: true,
      isOwn: false,
    },
    {
      id: '2',
      text: 'Какие сроки у проекта?',
      sender: {
        id: '1',
        name: 'Анна Смирнова',
        avatar: mockUsers[0].avatar,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
      isRead: true,
      isOwn: false,
    },
    {
      id: '3',
      text: 'Давайте обсудим новый проект на встрече завтра',
      sender: {
        id: 'current',
        name: 'Вы',
        avatar: undefined,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
      isOwn: true,
    },
  ],
  '3': [
    {
      id: '1',
      text: 'Привет! Документы готовы?',
      sender: {
        id: 'current',
        name: 'Вы',
        avatar: undefined,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      isRead: true,
      isOwn: true,
    },
    {
      id: '2',
      text: 'Документы готовы, можно забирать',
      sender: {
        id: '2',
        name: 'Иван Петров',
        avatar: mockUsers[1].avatar,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
      isOwn: false,
    },
  ],
};

// Текущий пользователь
const currentUser: User = {
  id: 'current',
  name: 'Алексей Сидоров',
  email: 'alexey@example.com',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop',
  isAdmin: true,
  status: 'online',
};

const Index = () => {
  // Состояния для управления интерфейсом
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeChat, setActiveChat] = useState<string | undefined>(undefined);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<Record<string, MessageType[]>>(mockMessages);
  const [users, setUsers] = useState<User[]>([...mockUsers, currentUser]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  // Функция для имитации задержки ответа сервера
  const simulateServerDelay = (callback: Function) => {
    setIsLoading(true);
    setTimeout(() => {
      callback();
      setIsLoading(false);
    }, 800);
  };
  
  // Авторизация пользователя
  const handleLogin = (email: string, password: string) => {
    simulateServerDelay(() => {
      // Для демонстрации: любой email и пароль "password" будут успешной авторизацией
      if (password === 'password') {
        setIsAuthenticated(true);
        setLoginError(undefined);
      } else {
        setLoginError('Неверный email или пароль');
      }
    });
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveChat(undefined);
  };
  
  // Обработка отправки сообщения
  const handleSendMessage = (text: string) => {
    if (!activeChat) return;
    
    simulateServerDelay(() => {
      // Создаем новое сообщение
      const newMessage: MessageType = {
        id: `message-${Date.now()}`,
        text,
        sender: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        timestamp: new Date(),
        isRead: false,
        isOwn: true,
      };
      
      // Обновляем список сообщений
      setMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), newMessage],
      }));
      
      // Обновляем последнее сообщение в чате
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            lastMessage: {
              text,
              time: new Date(),
              isRead: false,
              isOwn: true,
            },
          };
        }
        return chat;
      }));
      
      // Имитация отметки "прочитано" через некоторое время
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          [activeChat]: prev[activeChat].map(msg => ({
            ...msg,
            isRead: true,
          })),
        }));
        
        setChats(prev => prev.map(chat => {
          if (chat.id === activeChat && chat.lastMessage) {
            return {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                isRead: true,
              },
              unreadCount: 0,
            };
          }
          return chat;
        }));
      }, 2000);
    });
  };
  
  // Имитация статуса "печатает"
  const handleTyping = () => {
    if (!activeChat) return;
    
    // Находим пользователя из активного чата
    const chat = chats.find(c => c.id === activeChat);
    if (!chat || chat.isGroup) return;
    
    const user = chat.users[0];
    if (!user) return;
    
    // Устанавливаем статус "печатает"
    setUsers(prev => prev.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          status: 'typing',
        };
      }
      return u;
    }));
    
    // Через 3 секунды возвращаем статус "онлайн"
    setTimeout(() => {
      setUsers(prev => prev.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            status: 'online',
          };
        }
        return u;
      }));
    }, 3000);
  };
  
  // Создание нового чата
  const handleCreateChat = (name: string, selectedUsers: User[]) => {
    simulateServerDelay(() => {
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        name,
        unreadCount: 0,
        isGroup: selectedUsers.length > 1,
        users: selectedUsers,
        avatar: selectedUsers.length === 1 ? selectedUsers[0].avatar : undefined,
      };
      
      setChats(prev => [newChat, ...prev]);
      setActiveChat(newChat.id);
    });
  };
  
  // Удаление чата
  const handleDeleteChat = () => {
    if (!activeChat) return;
    
    simulateServerDelay(() => {
      setChats(prev => prev.filter(chat => chat.id !== activeChat));
      setActiveChat(undefined);
    });
  };
  
  // Выход из группового чата
  const handleLeaveChatGroup = () => {
    if (!activeChat) return;
    
    simulateServerDelay(() => {
      setChats(prev => prev.filter(chat => chat.id !== activeChat));
      setActiveChat(undefined);
    });
  };
  
  // Добавление пользователя в чат
  const handleAddUserToChat = (userId: string) => {
    if (!activeChat) return;
    
    simulateServerDelay(() => {
      const userToAdd = users.find(user => user.id === userId);
      if (!userToAdd) return;
      
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            users: [...chat.users, userToAdd],
          };
        }
        return chat;
      }));
    });
  };
  
  // Удаление пользователя из чата
  const handleRemoveUserFromChat = (userId: string) => {
    if (!activeChat) return;
    
    simulateServerDelay(() => {
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            users: chat.users.filter(user => user.id !== userId),
          };
        }
        return chat;
      }));
    });
  };
  
  // Обновление профиля пользователя
  const handleUpdateProfile = (userData: {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
    avatar?: string | File;
  }) => {
    simulateServerDelay(() => {
      // Обновляем данные текущего пользователя
      const updatedCurrentUser: User = {
        ...currentUser,
        name: userData.name,
        email: userData.email,
        avatar: typeof userData.avatar === 'string' ? userData.avatar : currentUser.avatar,
      };
      
      // Обновляем список пользователей
      setUsers(prev => prev.map(user => {
        if (user.id === currentUser.id) {
          return updatedCurrentUser;
        }
        return user;
      }));
      
      setIsProfileOpen(false);
    });
  };
  
  // Создание нового пользователя (админ)
  const handleCreateUser = (userData: {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
  }) => {
    simulateServerDelay(() => {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        isAdmin: userData.isAdmin,
        status: 'offline',
        lastSeen: new Date(),
      };
      
      setUsers(prev => [...prev, newUser]);
    });
  };
  
  // Обновление пользователя (админ)
  const handleUpdateUser = (userId: string, userData: {
    name: string;
    email: string;
    password?: string;
    isAdmin: boolean;
  }) => {
    simulateServerDelay(() => {
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            name: userData.name,
            email: userData.email,
            isAdmin: userData.isAdmin,
          };
        }
        return user;
      }));
    });
  };
  
  // Удаление пользователя (админ)
  const handleDeleteUser = (userId: string) => {
    simulateServerDelay(() => {
      setUsers(prev => prev.filter(user => user.id !== userId));
    });
  };
  
  // Если пользователь не авторизован, показываем форму входа
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-messenger-purple/5 to-blue-100/20">
        <LoginForm 
          onLogin={handleLogin} 
          isLoading={isLoading}
          error={loginError}
        />
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col">
      <header className="h-14 border-b flex items-center justify-between px-4 bg-white">
        <div className="flex items-center">
          <div className="text-xl font-bold text-messenger-purple">Messenger</div>
        </div>
        
        <div className="flex items-center space-x-2">
          {currentUser.isAdmin && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsAdminPanelOpen(true)}
            >
              <Icon name="Shield" size={18} className="mr-1" />
              <span className="hidden sm:inline">Админ панель</span>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsProfileOpen(true)}
          >
            <Icon name="Settings" size={18} className="mr-1" />
            <span className="hidden sm:inline">Настройки</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
          >
            <Icon name="LogOut" size={18} className="mr-1" />
            <span className="hidden sm:inline">Выйти</span>
          </Button>
        </div>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[320px] flex-shrink-0">
          <ChatList 
            chats={chats}
            activeChat={activeChat}
            onChatSelect={setActiveChat}
            onCreateChat={handleCreateChat}
            availableUsers={users.filter(user => user.id !== currentUser.id)}
          />
        </div>
        
        <div className="flex-1 border-l">
          <ChatView 
            chat={chats.find(chat => chat.id === activeChat)}
            messages={activeChat ? messages[activeChat] || [] : []}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            onDeleteChat={handleDeleteChat}
            onLeaveChatGroup={handleLeaveChatGroup}
            onAddUserToChat={handleAddUserToChat}
            onRemoveUserFromChat={handleRemoveUserFromChat}
            currentUserId={currentUser.id}
            availableUsers={users.filter(user => user.id !== currentUser.id)}
          />
        </div>
      </div>
      
      {/* Модальное окно настроек профиля */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <UserProfileForm 
            user={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onCancel={() => setIsProfileOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
      
      {/* Модальное окно админ панели */}
      <Dialog open={isAdminPanelOpen} onOpenChange={setIsAdminPanelOpen}>
        <DialogContent className="sm:max-w-[900px] h-[80vh]">
          <ScrollArea className="h-full pr-4">
            <AdminPanel 
              users={users.filter(user => user.id !== 'current')}
              currentUser={currentUser}
              onCreateUser={handleCreateUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
