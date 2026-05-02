import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAppSelector } from './store';
import { router } from './routes/router';
export default function App() {
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <RouterProvider router={router} />
  );
}
