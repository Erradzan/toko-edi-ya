import React from 'react';
import { useTheme } from '../context/Darkmode';

interface ThemeProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const withTheme = <P extends ThemeProps>(Component: React.ComponentType<P>) => {
  return (props: Omit<P, keyof ThemeProps>) => {
    const { isDarkMode, toggleTheme } = useTheme();
    return <Component {...(props as P)} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  };
};

export default withTheme;