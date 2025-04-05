// components/common/Navbar.jsx
import React from 'react';
import Link from 'next/link';
import { Avatar } from './Avatar';

export function Navbar({
  user,
  role = 'user',
  onLogout,
  className = '',
  ...props
}) {
  // Generate navigation links based on user role
  const navLinks = {
    user: [
      { href: '/u/reports', label: 'My Reports' },
      { href: '/u/reports/new', label: 'Report Crime' },
      { href: '/u/profile', label: 'Profile' },
    ],
    admin: [
      { href: '/a/dashboard', label: 'Dashboard' },
      { href: '/a/reports', label: 'Reports' },
      { href: '/a/analytics', label: 'Analytics' },
    ],
    superAdmin: [
      { href: '/sa/dashboard', label: 'Dashboard' },
      { href: '/sa/stations', label: 'Stations' },
      { href: '/sa/reports', label: 'Reports' },
      { href: '/sa/analytics', label: 'Analytics' },
    ],
  };
  
  const links = navLinks[role] || [];
  
  return (
    <nav 
      className={`bg-surface-50 border-b border-surface-200 py-2 px-4 ${className}`}
      {...props}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href={`/${role === 'user' ? 'u' : role === 'admin' ? 'a' : 'sa'}/dashboard`} className="flex items-center">
            <span className="text-primary-500 text-xl font-bold">Kavach</span>
          </Link>
          
          <div className="hidden md:flex ml-10 space-x-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-surface-700 hover:text-primary-500 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <span className="text-sm text-surface-700 mr-2">{user.name}</span>
              <Avatar src={user.avatar} name={user.name} size="sm" />
            </div>
          )}
          
          <button 
            onClick={onLogout}
            className="text-sm text-surface-700 hover:text-primary-500"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}