
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import UserList from './admin/UserList';
import UserForm from './admin/UserForm';
import { User } from '@/types';

interface AdminPanelProps {
  users: User[];
  currentUser: User;
  onCreateUser: (userData: {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
  }) => void;
  onUpdateUser: (userId: string, userData: {
    name: string;
    email: string;
    password?: string;
    isAdmin: boolean;
  }) => void;
  onDeleteUser: (userId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  currentUser,
  onCreateUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };
  
  const handleCreateUser = () => {
    setSelectedUser(undefined);
    setIsUserFormOpen(true);
  };
  
  const handleSubmitUser = async (userData: {
    name: string;
    email: string;
    password?: string;
    isAdmin: boolean;
  }) => {
    setIsLoading(true);
    try {
      if (selectedUser) {
        await onUpdateUser(selectedUser.id, userData);
      } else {
        if (!userData.password) return; // Убедимся, что пароль задан при создании
        await onCreateUser(userData as any);
      }
      setIsUserFormOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await onDeleteUser(userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
  
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Панель администратора</h1>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Управление пользователями</h2>
            <Button onClick={handleCreateUser}>
              <Icon name="UserPlus" className="mr-2 h-4 w-4" />
              Добавить пользователя
            </Button>
          </div>
          
          <UserList 
            users={users} 
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            currentUserId={currentUser.id}
          />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Настройки системы</h2>
            <p className="text-muted-foreground">
              Настройки системы находятся в разработке.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
        <DialogContent className="sm:max-w-[475px]" hideCloseButton>
          <UserForm
            user={selectedUser}
            onSubmit={handleSubmitUser}
            onCancel={() => setIsUserFormOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
