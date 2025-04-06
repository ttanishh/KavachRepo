import { Server } from 'socket.io';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Check authorization token if needed
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || 
      authHeader.substring(7) !== process.env.SOCKET_SECRET_KEY) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    // Get event data from request
    const { event, data } = req.body;
    
    if (!event || !data) {
      return res.status(400).json({ success: false, error: 'Missing event or data' });
    }

    // Get Socket.IO instance or initialize
    if (!res.socket.server.io) {
      console.log('Initializing Socket.IO server...');
      const io = new Server(res.socket.server, {
        cors: {
          origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
          methods: ['GET', 'POST'],
          credentials: true,
        },
      });
      res.socket.server.io = io;

      // Set up default socket event handlers
      io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        
        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
        });
      });
    }

    // Broadcast the event to all connected clients
    res.socket.server.io.emit(event, data);
    
    return res.status(200).json({ success: true, message: 'Event broadcasted successfully' });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ success: false, error: 'Failed to process webhook' });
  }
}