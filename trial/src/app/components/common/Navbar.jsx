'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import Button from './Button';

const Navbar = ({ 
  user = null, 
  role = 'user', 
  onLogout,
  notificationCount = 0,
  onNotificationClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  // Determine navigation links based on user role
  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { href: '/a/dashboard', label: 'Dashboard' },
          { href: '/a/reports', label: 'Reports' },
          { href: '/a/analytics', label: 'Analytics' },
        ];
      case 'superadmin':
        return [
          { href: '/sa/dashboard', label: 'Dashboard' },
          { href: '/sa/stations', label: 'Police Stations' },
          { href: '/sa/reports', label: 'Reports' },
          { href: '/sa/analytics', label: 'Analytics' },
        ];
      case 'user':
      default:
        return [
          { href: '/u/reports', label: 'My Reports' },
          { href: '/u/reports/new', label: 'New Report' },
          { href: '/u/map', label: 'Map' },
        ];
    }
  };
  
  const navLinks = getNavLinks();
  
  const profilePath = role === 'admin' ? '/a/profile' : 
                      role === 'superadmin' ? '/sa/profile' : 
                      '/u/profile';
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href={role === 'admin' ? '/a/dashboard' : 
                   role === 'superadmin' ? '/sa/dashboard' : 
                   '/u/reports'}
              className="text-2xl font-bold text-primary-600"
            >
              Kavach
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href) 
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            {user && (
              <>
                {/* Notification Bell */}
                <button 
                  onClick={onNotificationClick} 
                  className="relative p-2 rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <FiBell className="h-6 w-6" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-danger-600 rounded-full">
                      {notificationCount}
                    </span>
                  )}
                </button>
                
                {/* User Profile */}
                <Link
                  href={profilePath}
                  className="ml-3 p-2 rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  <FiUser className="h-6 w-6" />
                </Link>
                
                {/* Logout Button */}
                <button 
                  onClick={onLogout}
                  className="ml-3 md:ml-4 p-2 text-gray-500 hover:text-danger-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-danger-500 dark:hover:bg-gray-700 rounded-full"
                >
                  <FiLogOut className="h-6 w-6" />
                </button>
              </>
            )}
            
            {!user && (
              <>
                <Link href="/auth/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2">
                  Login
                </Link>
                <Button href="/auth/signup" variant="primary" className="ml-3">
                  Sign Up
                </Button>
              </>
            )}
            
            {/* Mobile menu button */}
            <div className="ml-3 md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                {isMenuOpen ? (
                  <FiX className="block h-6 w-6" />
                ) : (
                  <FiMenu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
