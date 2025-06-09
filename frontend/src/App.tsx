import { useEffect, useState, useRef } from "react";

interface Message {
  message: string;
  userId: string;
  timestamp: string;
}

type AppState = "landing" | "chat";

// Spinner component
const Spinner = ({ size = "w-5 h-5" }: { size?: string }) => (
  <div
    className={`${size} animate-spin rounded-full border-2 border-gray-300 border-t-black`}
  ></div>
);

function App() {
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

  const inputRef = useRef<HTMLInputElement>(null);
  const roomInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get WebSocket URL from environment or default to localhost
  const getWebSocketUrl = () => {
    if (import.meta.env.PROD) {
      // In production, use the deployed backend URL
      return (
        import.meta.env.VITE_WS_URL || "wss://your-backend-url.onrender.com"
      );
    }
    return "ws://localhost:8080";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createRoom = () => {
    setIsConnecting(true);
    setError("");

    const ws = new WebSocket(getWebSocketUrl());
    setSocket(ws);

    ws.onopen = () => {
      setIsConnecting(false);
      setError("");
      ws.send(
        JSON.stringify({
          type: "createRoom",
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "roomCreated":
          setIsLoadingChat(true);
          setRoomId(data.payload.roomId);
          setUserId(data.payload.userId);
          setTimeout(() => {
            setAppState("chat");
            setIsLoadingChat(false);
          }, 500);
          break;

        case "message":
          setMessages((prev) => [
            ...prev,
            {
              message: data.payload.message,
              userId: data.payload.userId,
              timestamp: data.payload.timestamp,
            },
          ]);
          break;

        case "userJoined":
          setUserCount(data.payload.userCount);
          break;

        case "userLeft":
          setUserCount(data.payload.userCount);
          break;

        case "error":
          setError(data.payload.message);
          setIsConnecting(false);
          break;
      }
    };

    ws.onclose = () => {
      setSocket(null);
      setIsConnecting(false);
    };

    ws.onerror = () => {
      setError("Connection failed. Please try again.");
      setIsConnecting(false);
    };
  };

  const joinRoom = () => {
    const roomIdToJoin = roomInputRef.current?.value.trim();
    if (!roomIdToJoin) {
      setError("Please enter a room ID");
      return;
    }

    setIsConnecting(true);
    setError("");

    const ws = new WebSocket(getWebSocketUrl());
    setSocket(ws);

    ws.onopen = () => {
      setIsConnecting(false);
      setError("");
      ws.send(
        JSON.stringify({
          type: "joinRoom",
          payload: {
            roomId: roomIdToJoin,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "roomJoined":
          setIsLoadingChat(true);
          setRoomId(data.payload.roomId);
          setUserId(data.payload.userId);
          setUserCount(data.payload.userCount);
          setTimeout(() => {
            setAppState("chat");
            setIsLoadingChat(false);
          }, 500);
          break;

        case "message":
          setMessages((prev) => [
            ...prev,
            {
              message: data.payload.message,
              userId: data.payload.userId,
              timestamp: data.payload.timestamp,
            },
          ]);
          break;

        case "userJoined":
          setUserCount(data.payload.userCount);
          break;

        case "userLeft":
          setUserCount(data.payload.userCount);
          break;

        case "error":
          setError(data.payload.message);
          setIsConnecting(false);
          break;
      }
    };

    ws.onclose = () => {
      setSocket(null);
      setIsConnecting(false);
    };

    ws.onerror = () => {
      setError("Connection failed. Please try again.");
      setIsConnecting(false);
    };
  };

  const sendMessage = () => {
    const message = inputRef.current?.value.trim();
    if (!message || !socket || isSendingMessage) return;

    setIsSendingMessage(true);

    socket.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: message,
        },
      })
    );

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Reset sending state after a short delay
    setTimeout(() => {
      setIsSendingMessage(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const leaveRoom = () => {
    setIsLeavingRoom(true);

    if (socket) {
      socket.close();
    }

    setTimeout(() => {
      setAppState("landing");
      setMessages([]);
      setRoomId("");
      setUserId("");
      setUserCount(1);
      setError("");
      setIsLeavingRoom(false);
    }, 500);
  };

  if (isLoadingChat) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Spinner size="w-12 h-12" />
          <p className="text-white mt-4 text-lg">Loading chat room...</p>
        </div>
      </div>
    );
  }

  if (appState === "landing") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">ChatRoom</h1>
            <p className="text-gray-600">Connect with others in real-time</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-red-800 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={createRoom}
              disabled={isConnecting}
              className="w-full bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              {isConnecting && <Spinner size="w-4 h-4" />}
              {isConnecting ? "Creating Room..." : "Create New Room"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <input
                ref={roomInputRef}
                type="text"
                placeholder="Enter Room ID"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                onKeyDown={(e) => e.key === "Enter" && joinRoom()}
              />
              <button
                onClick={joinRoom}
                disabled={isConnecting}
                className="w-full bg-white hover:bg-gray-100 border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                {isConnecting && <Spinner size="w-4 h-4" />}
                {isConnecting ? "Joining Room..." : "Join Room"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-black">Room: {roomId}</h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {userCount} user{userCount !== 1 ? "s" : ""} online
              </span>
            </div>
          </div>
          <button
            onClick={leaveRoom}
            disabled={isLeavingRoom}
            className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 rounded-lg transition-colors duration-200 border border-gray-300 flex items-center gap-2"
          >
            {isLeavingRoom && <Spinner size="w-4 h-4" />}
            {isLeavingRoom ? "Leaving..." : "Leave Room"}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm opacity-70">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.userId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  msg.userId === userId
                    ? "bg-black text-white"
                    : "bg-white text-black border border-gray-300 shadow-sm"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={
                isSendingMessage ? "Sending..." : "Type your message..."
              }
              disabled={isSendingMessage}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              onKeyDown={handleKeyPress}
            />
            {isSendingMessage && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Spinner size="w-4 h-4" />
              </div>
            )}
          </div>
          <button
            onClick={sendMessage}
            disabled={isSendingMessage}
            className="bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            {isSendingMessage && <Spinner size="w-4 h-4" />}
            {isSendingMessage ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
