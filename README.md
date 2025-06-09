# ChatRoom - Real-time Chat Application

A modern, real-time chat application built with React, TypeScript, Node.js, and WebSockets. Features a clean black and white UI design with room-based messaging.

![ChatRoom Demo](https://via.placeholder.com/800x400/000000/FFFFFF?text=ChatRoom+Demo)

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using WebSockets
- **Room-based Chat**: Create and join chat rooms with unique IDs
- **Modern UI**: Clean black and white design with smooth animations
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Loading States**: Comprehensive loading indicators for better UX
- **Unique Room IDs**: Auto-generated room IDs with uppercase, lowercase, and numeric characters
- **User Management**: Real-time user count and presence indicators
- **Message Timestamps**: All messages include timestamps
- **Error Handling**: Graceful error handling with user feedback

## 🏗️ Project Structure

```
ChatRoom/
├── backend/                 # Node.js WebSocket server
│   ├── src/
│   │   └── index.ts        # Main server file
│   ├── dist/               # Compiled JavaScript
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React TypeScript application
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── package.json
│   └── vite.config.ts
├── docs/                   # Documentation
├── .gitignore
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **ws** - WebSocket library
- **Express** - Web framework (for future REST endpoints)

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/shashi162003/ChatRoom.git
cd ChatRoom
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Start Development Servers

```bash
# Terminal 1: Start backend server
cd backend
npm run dev

# Terminal 2: Start frontend development server
cd frontend
npm run dev
```

### 4. Open Application

- Frontend: http://localhost:5173
- Backend WebSocket: ws://localhost:8080

## 📖 Detailed Documentation

- [Backend Documentation](./docs/BACKEND.md)
- [Frontend Documentation](./docs/FRONTEND.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [API Documentation](./docs/API.md)

## 🚀 Deployment

### Vercel (Frontend)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shashi162003/ChatRoom)

### Render (Backend)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/shashi162003/ChatRoom)

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 🎮 How to Use

1. **Create a Room**: Click "Create New Room" to generate a unique room ID
2. **Join a Room**: Enter an existing room ID and click "Join Room"
3. **Send Messages**: Type your message and press Enter or click Send
4. **Leave Room**: Click "Leave Room" to return to the landing page

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start           # Start production server
```

### Frontend Development

```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shashi Kumar**
- GitHub: [@shashi162003](https://github.com/shashi162003)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by real-time communication needs
- Thanks to the open-source community

## 📊 Project Status

- ✅ Core functionality complete
- ✅ Real-time messaging working
- ✅ Room management implemented
- ✅ UI/UX polished
- ✅ Documentation complete
- ✅ Deployment ready

---

⭐ Star this repository if you found it helpful!
