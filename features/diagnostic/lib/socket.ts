import { io, type Socket } from "socket.io-client";

const CHATBOT_URL =
  process.env.NEXT_PUBLIC_CHATBOT_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const sockets = new Map<string, Socket>();

type SocketOptions = {
  sessionId: string;
  token?: string | null;
};

export function getSocket({ sessionId, token }: SocketOptions): Socket {
  const key = `${sessionId}:${token || "anon"}`;

  if (!sockets.has(key)) {
    const socket = io(`${CHATBOT_URL.replace(/\/$/, "")}/chat`, {
      auth: token ? { token } : undefined,
      query: { sessionId },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      transports: ["websocket", "polling"],
    });

    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        sockets.delete(key);
      }
    });

    sockets.set(key, socket);
  }

  return sockets.get(key)!;
}

export function disconnectAll() {
  for (const [, socket] of sockets) {
    socket.removeAllListeners();
    socket.disconnect();
  }
  sockets.clear();
}

export function removeSocket(sessionId: string, token?: string | null) {
  const key = `${sessionId}:${token || "anon"}`;
  const socket = sockets.get(key);
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    sockets.delete(key);
  }
}
