import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem('token');
    setIsAuth(!!token); // !! преобразует значение в boolean
  }, []);

  return { isAuth, setIsAuth };
};