import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { toggleTheme, setTheme, selectTheme } from '@/store/slices/uiSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  // Sync with localStorage and html class
  useEffect(() => {
    const saved = localStorage.getItem('mm-theme');
    if (saved && (saved === 'light' || saved === 'dark')) {
      dispatch(setTheme(saved));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('mm-theme', theme);
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme, isDark]);

  return {
    theme,
    isDark,
    toggle: () => dispatch(toggleTheme()),
    setLight: () => dispatch(setTheme('light')),
    setDark: () => dispatch(setTheme('dark')),
  };
};
