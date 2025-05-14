
// Этот файл будет использоваться для взаимодействия с Flask API
// Замените URL_BASE на реальный URL вашего API

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' // для продакшена - относительный путь к API
  : 'http://localhost:5000/api'; // для разработки - локальный сервер Flask

// Утилиты для работы с API
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    const error = contentType?.includes('json') 
      ? await response.json() 
      : { message: response.statusText };
    throw new Error(error.message || 'Произошла ошибка при выполнении запроса');
  }
  
  if (contentType?.includes('json')) {
    return await response.json();
  }
  
  return await response.text();
};

// Вспомогательная функция для добавления авторизационного токена к запросам
const getHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// API для работы с пользователями
export const usersApi = {
  // Авторизация
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await handleResponse(response);
    
    // Сохраняем токен в localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  },
  
  // Выход из системы
  logout: () => {
    localStorage.removeItem('authToken');
  },
  
  // Получение текущего пользователя
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getHeaders(),
    });
    
    return handleResponse(response);
  },
  
  // Обновление профиля пользователя
  updateProfile: async (userData: {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
    avatar?: File | string;
  }) => {
    // Если аватар - это File, используем FormData
    if (userData.avatar instanceof File) {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      if (userData.currentPassword) formData.append('currentPassword', userData.currentPassword);
      if (userData.newPassword) formData.append('newPassword', userData.newPassword);
      formData.append('avatar', userData.avatar);
      
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          Authorization: getHeaders().Authorization,
        },
        body: formData,
      });
      
      return handleResponse(response);
    }
    
    // Если аватар - это строка (URL) или его нет, используем JSON
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  }
};

// API для работы с чатами и сообщениями
export const chatsApi = {
  // Получение всех чатов пользователя
  getChats: async () => {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      headers: getHeaders(),
    });
    
    return handleResponse(response);
  },
  
  // Создание нового чата
  createChat: async (data: { name: string, userIds: string[] }) => {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
  
  // Удаление чата
  deleteChat: async (chatId: string) => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    return handleResponse(response);
  },
  
  // Получение сообщений чата
  getMessages: async (chatId: string) => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      headers: getHeaders(),
    });
    
    return handleResponse(response);
  },
  
  // Отправка сообщения
  sendMessage: async (chatId: string, text: string) => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text }),
    });
    
    return handleResponse(response);
  },
  
  // Отметка сообщения как прочитанного
  markAsRead: async (chatId: string, messageId: string) => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages/${messageId}/read`, {
      method: 'POST',
      headers: getHeaders(),
    });
    
    return handleResponse(response);
  }
};

// API для админ-панели
export const adminApi = {
  // Создание нового пользователя (админ)
  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
  }) => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  },
  
  // Обновление пользователя (админ)
  updateUser: async (userId: string, userData: {
    name: string;
    email: string;
    password?: string;
    isAdmin: boolean;
  }) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  },
  
  // Удаление пользователя (админ)
  deleteUser: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    return handleResponse(response);
  }
};

// Экспортируем все API для использования в приложении
export default {
  users: usersApi,
  chats: chatsApi,
  admin: adminApi
};
