# Backend Documentation

## Overview

The ChatRoom backend is a Node.js WebSocket server built with TypeScript that handles real-time messaging, room management, and user connections.

## Architecture

### Technology Stack
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **ws** - WebSocket library for real-time communication
- **Express** - Web framework (for future REST endpoints)

### Core Components

#### 1. WebSocket Server
- Listens on port 8080 (configurable via PORT environment variable)
- Handles multiple concurrent connections
- Manages real-time bidirectional communication

#### 2. Data Structures

```typescript
interface User {
  socket: WebSocket;
  room: string;
  userId: string;
}

interface Room {
  id: string;
  users: User[];
  createdAt: Date;
}
```

#### 3. Room Management
- **Room Creation**: Generates unique 8-character room IDs
- **Room Joining**: Validates room existence and adds users
- **User Tracking**: Maintains user lists per room
- **Cleanup**: Removes empty rooms automatically

## API Reference

### WebSocket Message Types

#### Client → Server

##### 1. Create Room
```json
{
  "type": "createRoom"
}
```

##### 2. Join Room
```json
{
  "type": "joinRoom",
  "payload": {
    "roomId": "string"
  }
}
```

##### 3. Send Message
```json
{
  "type": "chat",
  "payload": {
    "message": "string"
  }
}
```

#### Server → Client

##### 1. Room Created
```json
{
  "type": "roomCreated",
  "payload": {
    "roomId": "string",
    "userId": "string"
  }
}
```

##### 2. Room Joined
```json
{
  "type": "roomJoined",
  "payload": {
    "roomId": "string",
    "userId": "string",
    "userCount": "number"
  }
}
```

##### 3. Message Received
```json
{
  "type": "message",
  "payload": {
    "message": "string",
    "userId": "string",
    "timestamp": "string"
  }
}
```

##### 4. User Joined
```json
{
  "type": "userJoined",
  "payload": {
    "userCount": "number"
  }
}
```

##### 5. User Left
```json
{
  "type": "userLeft",
  "payload": {
    "userCount": "number"
  }
}
```

##### 6. Error
```json
{
  "type": "error",
  "payload": {
    "message": "string"
  }
}
```

## Features

### Room ID Generation
- 8-character unique identifiers
- Mix of uppercase letters (A-Z)
- Mix of lowercase letters (a-z)
- Mix of numbers (0-9)
- Guaranteed uniqueness check
- Example: `Kj8mN2pQ`

### User Management
- Unique user ID generation
- Real-time user count tracking
- Automatic cleanup on disconnect

### Message Broadcasting
- Real-time message delivery
- Room-based message isolation
- Timestamp inclusion
- User identification

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
cd backend
npm install
```

### Development Commands
```bash
npm run dev     # Start development server with hot reload
npm run build   # Build for production
npm start       # Start production server
npm run clean   # Clean build directory
```

### Environment Variables
```bash
PORT=8080       # Server port (default: 8080)
```

### Project Structure
```
backend/
├── src/
│   └── index.ts        # Main server file
├── dist/               # Compiled JavaScript
├── package.json
└── tsconfig.json
```

## Deployment

### Render Deployment
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Set environment variables if needed

### Environment Configuration
- **PORT**: Server port (auto-assigned by Render)
- **NODE_ENV**: Set to "production"

### Health Checks
The server logs connection events and statistics:
- New client connections
- Room creation/joining
- Message broadcasting
- User disconnections
- Server statistics every 30 seconds

## Monitoring

### Logs
The server provides comprehensive logging:
- 🚀 Server startup
- 👤 Client connections
- 🏠 Room creation
- 🚪 User join/leave events
- 💬 Message broadcasting
- ❌ Error handling
- 📊 Server statistics

### Performance
- Handles multiple concurrent connections
- Efficient room-based message routing
- Automatic memory cleanup
- Real-time user tracking

## Security Considerations

### Current Implementation
- Basic WebSocket connection handling
- Room-based message isolation
- Automatic user cleanup

### Future Enhancements
- Rate limiting
- Message validation
- User authentication
- Room permissions
- Message encryption

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   Error: listen EADDRINUSE: address already in use :::8080
   ```
   Solution: Change PORT environment variable or kill existing process

2. **WebSocket Connection Failed**
   - Check if server is running
   - Verify port configuration
   - Check firewall settings

3. **Room Not Found**
   - Verify room ID format
   - Check if room was deleted (empty rooms auto-delete)

### Debug Mode
Enable detailed logging by checking console output for:
- Connection events
- Message flow
- Error messages
- Server statistics
