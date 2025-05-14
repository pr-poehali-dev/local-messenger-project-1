
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoginForm from '@/components/auth/LoginForm';
import { User } from '@/types';

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
      </header>
      
      <div className="flex-1 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Добро пожаловать в Messenger!</h1>
          <p>Чтобы продолжить разработку, добавьте компоненты ChatList и ChatView.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
