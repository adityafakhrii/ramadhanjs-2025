import React from 'react';
import { Book } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Book className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
              HadithScroll
            </span>
          </div>
          <ThemeToggle isDark={isDark} toggle={toggleTheme} />
        </div>
      </div>
    </nav>
  );
};