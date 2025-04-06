'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiHome, FiFileText, FiMap, FiUser, FiBarChart2, FiSettings, FiLogOut, FiAlertCircle } from 'react-icons/fi';

const Sidebar = ({ 
  role = 'user',
  onLogout,
  userName = '',
  userEmail = '',
  userAvatar = ''
}) => {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();
  
  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Get navigation items based on user role
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { icon: <FiHome size={20} />, label: 'Dashboard', href: '/a/dashboard' },
          { icon: <FiFileText size={20} />, label: 'Crime Reports', href: '/a/reports' },
          { icon: <FiBarChart2 size={20} />, label: 'Analytics', href: '/a/analytics' },
          { icon: <FiSettings size={20} />, label: 'Settings', href: '/a/profile' },
        ];
      case 'superadmin':
        return [
          { icon: <FiHome size={20} />, label: 'Dashboard', href: '/sa/dashboard' },
          { icon: <FiMap size={20} />, label: 'Police Stations', href: '/sa/stations' },
          { icon: <FiFileText size={20} />, label: 'Crime Reports', href: '/sa/reports' },
          { icon: <FiBarChart2 size={20} />, label: 'Analytics', href: '/sa/analytics' },
          { icon: <FiSettings size={20} />, label: 'Settings', href: '/sa/profile' },
        ];
      case 'user':
      default:
        return [
          { icon: <FiFileText size={20} />, label: 'My Reports', href: '/u/reports' },
          { icon: <FiAlertCircle size={20} />, label: 'New Report', href: '/u/reports/new' },
          { icon: <FiMap size={20} />, label: 'Crime Map', href: '/u/map' },
          { icon: <FiUser size={20} />, label: 'Profile', href: '/u/profile' },
        ];
    }
  };
  
  const navItems = getNavItems();

  return (
    <div className={`h-screen flex flex-col bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ${expanded ? 'w-64' : 'w-20'}`}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
        {expanded && (
          <Link href="/" className="text-xl font-bold text-primary-600">
            Kavach
          </Link>
        )}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <FiMenu size={24} />
        </button>
      </div>
      
      {/* User Profile */}
      <div className="flex flex-col items-center p-4 border-b dark:border-gray-700">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden mb-2">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <FiUser size={24} />
            </div>
          )}
        </div>
        {expanded && (
          <div className="text-center">
            <p className="font-medium text-gray-800 dark:text-white">{userName || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full">{userEmail || ''}</p>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={`flex items-center p-3 rounded-md transition-colors ${
                  isActive(item.href) 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {expanded && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t dark:border-gray-700">
        <button 
          onClick={onLogout}
          className={`flex items-center p-3 w-full rounded-md text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-gray-700 transition-colors`}
        >
          <FiLogOut size={20} />
          {expanded && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
