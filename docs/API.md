# API Documentation

## Overview

The ChatRoom API uses WebSocket connections for real-time bidirectional communication between clients and the server. All messages are JSON-formatted.

## Connection

### WebSocket Endpoint
```
Development: ws://localhost:8080
Production: wss://your-backend-url.onrender.com
```

### Connection Example
```javascript
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
  console.log('Connected to ChatRoom server');
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};

socket.onclose = () => {
  console.log('Disconnected from server');
};

socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};
```

## Message Format

All messages follow this structure:
```json
{
  "type": "string",
  "payload": {
    // Message-specific data
  }
}
```

## Client to Server Messages

### 1. Create Room

Creates a new chat room with a unique ID.

**Request:**
```json
{
  "type": "createRoom"
}
```

**Response:**
```json
{
  "type": "roomCreated",
  "payload": {
    "roomId": "Kj8mN2pQ",
    "userId": "abc123def456"
  }
}
```

**Example:**
```javascript
socket.send(JSON.stringify({
  type: "createRoom"
}));
```

### 2. Join Room

Joins an existing chat room.

**Request:**
```json
{
  "type": "joinRoom",
  "payload": {
    "roomId": "Kj8mN2pQ"
  }
}
```

**Success Response:**
```json
{
  "type": "roomJoined",
  "payload": {
    "roomId": "Kj8mN2pQ",
    "userId": "xyz789abc123",
    "userCount": 2
  }
}
```

**Error Response:**
```json
{
  "type": "error",
  "payload": {
    "message": "Room not found"
  }
}
```

**Example:**
```javascript
socket.send(JSON.stringify({
  type: "joinRoom",
  payload: {
    roomId: "Kj8mN2pQ"
  }
}));
```

### 3. Send Message

Sends a chat message to all users in the room.

**Request:**
```json
{
  "type": "chat",
  "payload": {
    "message": "Hello, everyone!"
  }
}
```

**Broadcast Response:**
```json
{
  "type": "message",
  "payload": {
    "message": "Hello, everyone!",
    "userId": "abc123def456",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Example:**
```javascript
socket.send(JSON.stringify({
  type: "chat",
  payload: {
    message: "Hello, everyone!"
  }
}));
```

## Server to Client Messages

### 1. Room Created

Sent when a new room is successfully created.

```json
{
  "type": "roomCreated",
  "payload": {
    "roomId": "Kj8mN2pQ",
    "userId": "abc123def456"
  }
}
```

### 2. Room Joined

Sent when successfully joining a room.

```json
{
  "type": "roomJoined",
  "payload": {
    "roomId": "Kj8mN2pQ",
    "userId": "xyz789abc123",
    "userCount": 2
  }
}
```

### 3. Message

Broadcast to all users in a room when someone sends a message.

```json
{
  "type": "message",
  "payload": {
    "message": "Hello, everyone!",
    "userId": "abc123def456",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. User Joined

Sent to existing users when someone joins the room.

```json
{
  "type": "userJoined",
  "payload": {
    "userCount": 3
  }
}
```

### 5. User Left

Sent to remaining users when someone leaves the room.

```json
{
  "type": "userLeft",
  "payload": {
    "userCount": 2
  }
}
```

### 6. Error

Sent when an error occurs.

```json
{
  "type": "error",
  "payload": {
    "message": "Room not found"
  }
}
```

## Data Types

### Room ID
- **Format**: 8-character string
- **Characters**: Uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9)
- **Example**: `Kj8mN2pQ`
- **Uniqueness**: Guaranteed unique across all active rooms

### User ID
- **Format**: 13-character alphanumeric string
- **Generation**: Random using base36 encoding
- **Example**: `abc123def456`
- **Scope**: Unique per connection

### Timestamp
- **Format**: ISO 8601 string
- **Timezone**: UTC
- **Example**: `2024-01-15T10:30:00.000Z`

## Error Codes

### Room Errors
- **Room not found**: Attempting to join non-existent room
- **Invalid room ID**: Malformed room ID format

### Connection Errors
- **Connection failed**: WebSocket connection issues
- **Message parsing error**: Invalid JSON format

## Rate Limiting

Currently no rate limiting is implemented. Future versions may include:
- Message rate limiting per user
- Connection rate limiting per IP
- Room creation limits

## Best Practices

### Connection Management
```javascript
class ChatRoomClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    this.socket = new WebSocket(this.url);
    
    this.socket.onopen = () => {
      console.log('Connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onclose = () => {
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
    }
  }

  send(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
}
```

### Message Handling
```javascript
socket.onmessage = (event) => {
  try {
    const message = JSON.parse(event.data);
    
    switch (message.type) {
      case 'roomCreated':
        handleRoomCreated(message.payload);
        break;
      case 'message':
        handleNewMessage(message.payload);
        break;
      case 'error':
        handleError(message.payload);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  } catch (error) {
    console.error('Failed to parse message:', error);
  }
};
```

### Error Handling
```javascript
function handleError(payload) {
  switch (payload.message) {
    case 'Room not found':
      showError('The room you\'re trying to join doesn\'t exist.');
      break;
    default:
      showError('An unexpected error occurred.');
  }
}
```

## Testing

### Manual Testing
```javascript
// Test room creation
socket.send(JSON.stringify({ type: "createRoom" }));

// Test joining room
socket.send(JSON.stringify({
  type: "joinRoom",
  payload: { roomId: "TestRoom" }
}));

// Test sending message
socket.send(JSON.stringify({
  type: "chat",
  payload: { message: "Test message" }
}));
```

### Automated Testing
```javascript
// Example test using Jest and ws
const WebSocket = require('ws');

test('should create room and receive roomCreated message', (done) => {
  const ws = new WebSocket('ws://localhost:8080');
  
  ws.on('open', () => {
    ws.send(JSON.stringify({ type: 'createRoom' }));
  });
  
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    expect(message.type).toBe('roomCreated');
    expect(message.payload.roomId).toBeDefined();
    expect(message.payload.userId).toBeDefined();
    ws.close();
    done();
  });
});
```

## Changelog

### Version 1.0.0
- Initial WebSocket API implementation
- Room creation and joining
- Real-time messaging
- User presence tracking
- Error handling
