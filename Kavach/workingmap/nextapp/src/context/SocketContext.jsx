"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create socket connection
    const socketConnection = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      withCredentials: true,
    });

    // Set up event listeners
    socketConnection.on('connect', () => {
      console.log('Socket connected');
    });

    socketConnection.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketConnection.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Save socket to state
    setSocket(socketConnection);

    // Clean up on unmount
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};