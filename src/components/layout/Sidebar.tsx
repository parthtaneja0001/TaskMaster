import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  CalendarIcon, 
  Cog6ToothIcon, 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();

  const navigation = [
    { name: 'Dashboard', href: 'dashboard', icon: HomeIcon },
    { name: 'Tasks', href: 'tasks', icon: ClipboardDocumentListIcon },
    { name: 'Habits', href: 'habits', icon: ClipboardDocumentListIcon },
    { name: 'Notes', href: 'notes', icon: ClipboardDocumentListIcon },
    { name: 'Calendar', href: 'calendar', icon: CalendarIcon },
    { name: 'Settings', href: 'settings', icon: Cog6ToothIcon },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          {isMobileMenuOpen ? (
            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-white">TaskMaster</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onPageChange(item.href)}
                    className={`${
                      activePage === item.href
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                  >
                    <item.icon
                      className={`${
                        activePage === item.href ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex bg-gray-700 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <UserCircleIcon className="inline-block h-9 w-9 rounded-full text-gray-300" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {user?.displayName || 'User'}
                    </p>
                    <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="mt-3 flex items-center text-sm font-medium text-gray-300 hover:text-white"
                >
                  <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
                  Sign out
                </button>
                <button
                  onClick={toggleTheme}
                  className="mt-2 flex items-center text-sm font-medium text-gray-300 hover:text-white"
                >
                  {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMobileMenuOpen ? 'fixed inset-0 flex z-40' : 'hidden'
        } lg:hidden`}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-white">TaskMaster</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onPageChange(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${
                    activePage === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
                >
                  <item.icon
                    className={`${
                      activePage === item.href ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                    } mr-4 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <UserCircleIcon className="inline-block h-9 w-9 rounded-full text-gray-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="mt-3 flex items-center text-sm font-medium text-gray-300 hover:text-white"
              >
                <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
                Sign out
              </button>
              <button
                onClick={toggleTheme}
                className="mt-2 flex items-center text-sm font-medium text-gray-300 hover:text-white"
              >
                {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>
    </>
  );
};

export default Sidebar;