
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { User } from '@/types';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';

interface UserFormProps {
  user?: User;
  onSubmit: (userData: {
    name: string;
    email: string;
    password?: string;
    isAdmin: boolean;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
}

const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  error 
}) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(user?.isAdmin || false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isEditMode = !!user;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка валидности паролей при создании нового пользователя
    if (!isEditMode && password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    
    onSubmit({
      name,
      email,
      password: password || undefined, // Отправляем пароль только если он изменен
      isAdmin
    });
  };
  
  return (
    <Card className="w-[450px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">
          {isEditMode ? 'Редактирование пользователя' : 'Создание пользователя'}
        </CardTitle>
        <CardDescription>
          {isEditMode 
            ? 'Измените данные пользователя' 
            : 'Заполните форму для создания нового пользователя'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя пользователя</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditMode ? 'Новый пароль (оставьте пустым, чтобы не менять)' : 'Пароль'}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isEditMode}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
              </Button>
            </div>
          </div>
          
          {!isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="isAdmin" 
              checked={isAdmin} 
              onCheckedChange={setIsAdmin} 
            />
            <Label htmlFor="isAdmin">Администратор</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </div>
              ) : isEditMode ? "Сохранить" : "Создать"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
