
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import Avatar from "./messenger/Avatar";
import { User } from '@/types';

interface UserProfileFormProps {
  user: User;
  onUpdateProfile: (userData: {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
    avatar?: string | File;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  user,
  onUpdateProfile,
  onCancel,
  isLoading = false
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user.avatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка валидности паролей
    if (newPassword && newPassword !== confirmPassword) {
      alert('Новые пароли не совпадают');
      return;
    }
    
    onUpdateProfile({
      name,
      email,
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined,
      avatar: avatarFile || avatarPreview
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Настройки профиля</h2>
        <p className="text-muted-foreground">
          Обновите ваши персональные данные и настройки безопасности
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <Avatar 
              name={name} 
              src={avatarPreview} 
              size="xl" 
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full"
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              <Icon name="PenSquare" size={16} />
            </Button>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          
          <div className="space-y-1 text-center sm:text-left flex-1">
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.isAdmin && (
              <div className="inline-block mt-1 px-2 py-0.5 bg-messenger-purple/10 text-messenger-purple text-xs rounded-full">
                Администратор
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
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
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-medium">Изменение пароля</h3>
          
          <div className="space-y-4">
            <div className="relative">
              <Label htmlFor="current-password">Текущий пароль</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  <Icon name={showPasswords ? "EyeOff" : "Eye"} size={18} />
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">Новый пароль</Label>
                <Input
                  id="new-password"
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтверждение нового пароля</Label>
                <Input
                  id="confirm-password"
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </div>
            ) : "Сохранить изменения"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
