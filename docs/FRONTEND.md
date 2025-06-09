# Frontend Documentation

## Overview

The ChatRoom frontend is a modern React application built with TypeScript, Vite, and Tailwind CSS that provides a clean, responsive interface for real-time messaging.

## Architecture

### Technology Stack
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### Design System
- **Color Scheme**: Clean black and white theme
- **Typography**: Modern, readable fonts
- **Layout**: Responsive design for all screen sizes
- **Animations**: Smooth transitions and loading states

## Components

### Main Application (`App.tsx`)

#### State Management
```typescript
const [appState, setAppState] = useState<AppState>("landing");
const [messages, setMessages] = useState<Message[]>([]);
const [socket, setSocket] = useState<WebSocket | null>(null);
const [roomId, setRoomId] = useState<string>("");
const [userId, setUserId] = useState<string>("");
const [userCount, setUserCount] = useState<number>(1);
const [isConnecting, setIsConnecting] = useState<boolean>(false);
const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
const [isLeavingRoom, setIsLeavingRoom] = useState<boolean>(false);
const [error, setError] = useState<string>("");
```

#### Application States
1. **Landing Page**: Room creation and joining interface
2. **Loading Screen**: Transition animation between states
3. **Chat Interface**: Real-time messaging interface

### Spinner Component
Reusable loading indicator with customizable size:
```typescript
const Spinner = ({ size = "w-5 h-5" }: { size?: string }) => (
  <div className={`${size} animate-spin rounded-full border-2 border-gray-300 border-t-black`}></div>
);
```

## Features

### Landing Page
- **Create Room**: Generates unique room with loading state
- **Join Room**: Enter existing room ID with validation
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during connections

### Chat Interface
- **Real-time Messaging**: Instant message delivery
- **Message Bubbles**: Different styles for own vs. other messages
- **Timestamps**: Human-readable message times
- **User Count**: Live user presence indicator
- **Auto-scroll**: Automatic scroll to latest messages
- **Loading States**: Comprehensive loading indicators

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Desktop**: Enhanced experience on larger screens
- **Flexible Layout**: Adapts to different screen sizes
- **Touch-friendly**: Large tap targets for mobile

## WebSocket Integration

### Connection Management
```typescript
const getWebSocketUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_WS_URL || "wss://your-backend-url.onrender.com";
  }
  return "ws://localhost:8080";
};
```

### Message Handling
The application handles various WebSocket message types:
- `roomCreated` - Room creation confirmation
- `roomJoined` - Room join confirmation
- `message` - Incoming chat messages
- `userJoined` - User presence updates
- `userLeft` - User departure updates
- `error` - Error notifications

## User Experience

### Loading States
1. **Button Spinners**: Visual feedback on button actions
2. **Input Indicators**: Loading states in input fields
3. **Transition Screens**: Smooth state transitions
4. **Message Sending**: Real-time sending feedback

### Error Handling
- Connection failures
- Room not found
- Invalid input validation
- Network error recovery

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast design

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
cd frontend
npm install
```

### Development Commands
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

### Environment Variables
```bash
VITE_WS_URL=wss://your-backend-url.onrender.com  # Production WebSocket URL
```

### Project Structure
```
frontend/
├── src/
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # React entry point
│   └── index.css       # Global styles
├── public/
│   ├── index.html      # HTML template
│   └── chat-icon.svg   # Custom favicon
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Styling

### Tailwind CSS Classes
The application uses utility-first CSS with Tailwind:

#### Color Scheme
- `bg-black` - Primary background
- `bg-white` - Secondary background
- `text-black` - Primary text
- `text-gray-600` - Secondary text
- `border-gray-300` - Borders

#### Layout
- `flex`, `flex-col` - Flexbox layouts
- `h-screen`, `min-h-screen` - Full height
- `p-4`, `px-6`, `py-3` - Padding
- `rounded-xl`, `rounded-2xl` - Border radius

#### Interactive States
- `hover:bg-gray-800` - Hover effects
- `disabled:opacity-50` - Disabled states
- `focus:ring-2` - Focus indicators
- `transform hover:scale-105` - Hover animations

## Deployment

### Vercel Deployment
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

### Environment Setup
- **VITE_WS_URL**: Production WebSocket server URL
- **NODE_ENV**: Automatically set by Vercel

## Performance

### Optimization Features
- **Vite**: Fast build tool with HMR
- **Code Splitting**: Automatic bundle optimization
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and CSS optimization

### Bundle Analysis
```bash
npm run build
npm run preview
```

## Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Features
- WebSocket support
- ES2020 features
- CSS Grid and Flexbox
- Modern JavaScript APIs

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check backend server status
   - Verify WebSocket URL configuration
   - Check browser console for errors

2. **Build Errors**
   ```bash
   npm run build
   ```
   - Check TypeScript errors
   - Verify import statements
   - Update dependencies if needed

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS
   - Verify class names

### Debug Mode
Enable development tools:
- React DevTools
- Browser console logging
- Network tab for WebSocket inspection
- Vite dev server logs
