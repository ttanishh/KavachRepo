import { NextResponse } from 'next/server';
import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';

// Initialize socket.io if it hasn't been initialized yet
let io;

export async function POST(request) {
  try {
    // Verify authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    if (token !== process.env.SOCKET_SECRET_KEY) {
      return NextResponse.json(
        { message: 'Invalid authorization token' },
        { status: 401 }
      );
    }
    
    // Get event data
    const eventData = await request.json();
    
    // If socket.io isn't initialized, we can't emit events
    if (!global.io) {
      console.log('Socket.io not initialized, storing event for later distribution');
      
      // Store event for later distribution (could be stored in memory or database)
      if (!global.pendingEvents) {
        global.pendingEvents = [];
      }
      global.pendingEvents.push(eventData);
      
      return NextResponse.json(
        { message: 'Event queued for distribution' },
        { status: 200 }
      );
    }
    
    // Emit event based on type
    switch (eventData.type) {
      case 'new_report':
        global.io.to(`station:${eventData.stationId}`).emit('new_report', eventData);
        break;
      case 'urgent_report':
        global.io.to(`station:${eventData.stationId}`).emit('urgent_report', eventData);
        break;
      case 'status_update':
        global.io.to(`report:${eventData.reportId}`).emit('status_update', eventData);
        break;
      case 'new_comment':
        global.io.to(`report:${eventData.reportId}`).emit('new_comment', eventData);
        break;
      default:
        // Broadcast to all connected clients
        global.io.emit('notification', eventData);
    }
    
    return NextResponse.json(
      { message: 'Event emitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error emitting socket event:', error);
    return NextResponse.json(
      { message: 'Failed to emit socket event', error: error.message },
      { status: 500 }
    );
  }
}

// This is a special route handler for socket.io setup
// It initializes socket.io when the server starts
export function GET() {
  // If socket.io is already initialized, return early
  if (global.io) {
    return NextResponse.json(
      { message: 'Socket.io already initialized' },
      { status: 200 }
    );
  }
  
  // Initialize socket.io
  if (global.server) {
    const io = new SocketServer(global.server, {
      path: '/api/socketio',
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    
    // Set up connection handler
    io.on('connection', (socket) => {
      console.log('New client connected', socket.id);
      
      // Join rooms for specific channels
      socket.on('join', (rooms) => {
        if (Array.isArray(rooms)) {
          rooms.forEach(room => socket.join(room));
        } else {
          socket.join(rooms);
        }
      });
      
      // Leave rooms
      socket.on('leave', (rooms) => {
        if (Array.isArray(rooms)) {
          rooms.forEach(room => socket.leave(room));
        } else {
          socket.leave(rooms);
        }
      });
      
      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
      });
    });
    
    // Store io instance globally
    global.io = io;
    
    // Emit any pending events
    if (global.pendingEvents && global.pendingEvents.length > 0) {
      global.pendingEvents.forEach(eventData => {
        switch (eventData.type) {
          case 'new_report':
            io.to(`station:${eventData.stationId}`).emit('new_report', eventData);
            break;
          case 'urgent_report':
            io.to(`station:${eventData.stationId}`).emit('urgent_report', eventData);
            break;
          case 'status_update':
            io.to(`report:${eventData.reportId}`).emit('status_update', eventData);
            break;
          case 'new_comment':
            io.to(`report:${eventData.reportId}`).emit('new_comment', eventData);
            break;
          default:
            io.emit('notification', eventData);
        }
      });
      
      // Clear pending events
      global.pendingEvents = [];
    }
  }
  
  return NextResponse.json(
    { message: 'Socket.io initialized successfully' },
    { status: 200 }
  );
}
