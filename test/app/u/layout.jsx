'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { auth } from '@/lib/firebase';
import Sidebar from '@/components/common/Sidebar';

export default function UserLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Verify session with backend
          const response = await fetch('/api/auth/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Authentication failed');
          }

          // If not a user, redirect to appropriate dashboard
          if (data.role === 'admin') {
            router.replace('/a/dashboard');
            return;
          }
          
          if (data.role === 'superadmin') {
            router.replace('/sa/dashboard');
            return;
          }

          // Valid user, set user state
          setUser(data);
        } catch (err) {
          console.error('Session verification error:', err);
          toast.error('Your session has expired. Please log in again.');
          await auth.signOut();
          router.replace('/auth/login');
        } finally {
          setLoading(false);
        }
      } else {
        // Not authenticated, redirect to login
        setUser(null);
        setLoading(false);
        router.replace('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // Sign out from Firebase
      await auth.signOut();
      
      toast.success('Successfully logged out');
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Only render layout if user is authenticated
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        role="user"
        onLogout={handleLogout}
        userName={user.fullName}
        userEmail={user.email}
        userAvatar={user.photoURL}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
