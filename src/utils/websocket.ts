import { WebSocketServer } from "ws";
import { verifyToken } from "./token";

let wss;
let clients = new Map<number, WebSocket>();
let onMessageHandler: any = {};
export const initWebSocket = (server: any) => {
  wss = new WebSocketServer({ server });
  wss.on("connection", (ws: any, req) => {
    console.log("Client connected");

    const token = req.url?.split("token=")[1] || "";
    const userId = setClients(token, ws);

    ws.on("message", async (message: any) => {
      try {
        const payload = JSON.parse(message.toString());
        onMessageHandler[payload.type](payload, userId);
      } catch (error) {
        console.log(error);
      }
    });

    ws.on("close", () => {
      console.log(`用户 ${userId} 断开连接`);
      clients.delete(userId);
    });

    ws.on("error", (error: any) => {
      console.error(`用户 ${userId} 连接错误:`, error);
      clients.delete(userId);
    });
  });
};

const setClients = (token: string, ws: any) => {
  if (!token) {
    ws.close(1008, "token not found");
    return;
  }
  const decoded: any = verifyToken(token);
  const userId = decoded.id;
  clients.set(Number(userId), ws);
  onMessage({
    type: "ping",
    handler: () => {
      ws.send(JSON.stringify({ type: "pong" }));
    },
  });
  return userId;
};

export const onMessage = ({
  type,
  handler,
}: {
  type: string;
  handler: any;
}) => {
  onMessageHandler[type] = handler;
};

export const sendMessage = ({ receiverId, type, data }: any) => {
  const receiverWs = clients.get(Number(receiverId));
  if (receiverWs) {
    receiverWs.send(JSON.stringify({ type, data }));
  }
};
