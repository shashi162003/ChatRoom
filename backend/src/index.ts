import { WebSocketServer, WebSocket } from "ws";

// Get port from environment variable or default to 8080
const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ port: Number(PORT) });

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

let allSockets: User[] = [];
let rooms: Map<string, Room> = new Map();

// Generate unique room ID with uppercase, lowercase, and numeric characters
function generateRoomId(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Ensure we have at least one of each type
  if (!/[A-Z]/.test(result))
    result = result.substring(1) + chars.charAt(Math.floor(Math.random() * 26));
  if (!/[a-z]/.test(result))
    result =
      result.substring(1) + chars.charAt(26 + Math.floor(Math.random() * 26));
  if (!/[0-9]/.test(result))
    result =
      result.substring(1) + chars.charAt(52 + Math.floor(Math.random() * 10));

  // Check if room ID already exists
  if (rooms.has(result)) {
    return generateRoomId(); // Recursively generate until unique
  }

  return result;
}

// Generate unique user ID
function generateUserId(): string {
  return Math.random().toString(36).substring(2, 15);
}

wss.on("connection", function (socket) {
  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === "createRoom") {
      const roomId = generateRoomId();
      const userId = generateUserId();

      const user: User = {
        socket,
        room: roomId,
        userId: userId,
      };

      const room: Room = {
        id: roomId,
        users: [user],
        createdAt: new Date(),
      };

      rooms.set(roomId, room);
      allSockets.push(user);

      socket.send(
        JSON.stringify({
          type: "roomCreated",
          payload: {
            roomId: roomId,
            userId: userId,
          },
        })
      );
    }

    if (parsedMessage.type === "joinRoom") {
      const { roomId } = parsedMessage.payload;
      const userId = generateUserId();

      if (rooms.has(roomId)) {
        const room = rooms.get(roomId)!;

        // Notify existing users BEFORE adding the new user
        console.log(
          `Notifying ${room.users.length} existing users about new user joining`
        );
        room.users.forEach((u) => {
          console.log(`Notifying user ${u.userId} about new user joining`);
          u.socket.send(
            JSON.stringify({
              type: "userJoined",
              payload: {
                userCount: room.users.length + 1, // +1 for the new user about to join
              },
            })
          );
        });

        const user: User = {
          socket,
          room: roomId,
          userId: userId,
        };

        room.users.push(user);
        allSockets.push(user);

        socket.send(
          JSON.stringify({
            type: "roomJoined",
            payload: {
              roomId: roomId,
              userId: userId,
              userCount: room.users.length,
            },
          })
        );
      } else {
        socket.send(
          JSON.stringify({
            type: "error",
            payload: {
              message: "Room not found",
            },
          })
        );
      }
    }

    if (parsedMessage.type === "chat") {
      console.log("Received chat message:", parsedMessage.payload.message);
      let currentUserRoom = null;
      const user = allSockets.find((user) => user.socket === socket);
      console.log("Found user:", user ? user.userId : "not found");
      if (user) {
        currentUserRoom = user.room;
        console.log("User room:", currentUserRoom);
      }

      if (currentUserRoom && rooms.has(currentUserRoom)) {
        const room = rooms.get(currentUserRoom)!;
        console.log("Room found, users count:", room.users.length);
        room.users.forEach((u) => {
          console.log("Sending message to user:", u.userId);
          u.socket.send(
            JSON.stringify({
              type: "message",
              payload: {
                message: parsedMessage.payload.message,
                userId: user?.userId,
                timestamp: new Date().toISOString(),
              },
            })
          );
        });
      } else {
        console.log("Room not found or user not in room");
      }
    }
  });

  socket.on("close", () => {
    // Remove user from allSockets and rooms
    const userIndex = allSockets.findIndex((user) => user.socket === socket);
    if (userIndex !== -1) {
      const user = allSockets[userIndex];
      allSockets.splice(userIndex, 1);

      // Remove from room
      if (rooms.has(user.room)) {
        const room = rooms.get(user.room)!;
        const roomUserIndex = room.users.findIndex((u) => u.socket === socket);
        if (roomUserIndex !== -1) {
          room.users.splice(roomUserIndex, 1);

          // Notify remaining users
          console.log(
            `Notifying ${room.users.length} remaining users about user leaving`
          );
          room.users.forEach((u) => {
            console.log(`Notifying user ${u.userId} about user leaving`);
            u.socket.send(
              JSON.stringify({
                type: "userLeft",
                payload: {
                  userCount: room.users.length,
                },
              })
            );
          });

          // Delete room if empty
          if (room.users.length === 0) {
            rooms.delete(user.room);
          }
        }
      }
    }
  });
});
