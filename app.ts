import express from "express";
import * as bodyParser from "body-parser";
import router from "@/routes/index";
import errorMiddleware from "@/models/err-middle-ware";
import { verifyToken } from "@/utils/token";
import { WebSocketServer } from "ws";
import {
  checkIsExistConversation,
  insertMessage,
} from "@/routes/chat/index.service";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/apis", router);

const PORT = process.env.PORT || 3000;
app.use(errorMiddleware);
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// websocket
const wss = new WebSocketServer({ server });
const clients = new Map<number, WebSocket>();
wss.on("connection", (ws: any, req) => {
  console.log("Client connected");
  // 30s一次心跳包
  let isAlive = true;
  const heartbeatInterval = setInterval(() => {
    if (!isAlive) {
      ws.close(1008, "Heartbeat timeout");
      return;
    }
    isAlive = false;
    ws.ping("heartbeat", (err: any) => {
      if (err) console.log(err);
    });
  }, 30000);

  ws.on("pong", () => {
    isAlive = true;
  });

  try {
    // 获取token
    const token = req.url?.split("token=")[1];
    if (!token) {
      ws.close(1008, "token not found");
      return;
    }
    const decoded: any = verifyToken(token);
    const userId = decoded.id;
    clients.set(Number(userId), ws);

    ws.on("message", async (message: any) => {
      const payload = JSON.parse(message.toString());
      switch (payload.type) {
        // 私聊
        case "private_message":
          // 判断会话是否存在,存在则插入消息,不存在则创建会话,并ws.send转发消息给会话双方
          const isExisting = await checkIsExistConversation(
            Number(userId),
            Number(payload.receiverId)
          );
          if (isExisting) {
            const sendMessage = await insertMessage({
              conversationId: Number(payload.conversationId),
              senderId: Number(userId),
              content: payload.content,
            });
            const receiverWs = clients.get(Number(payload.receiverId));
            const senderWs = clients.get(Number(userId));
            if (receiverWs) {
              receiverWs.send(
                JSON.stringify({ type: "new_message", message: sendMessage })
              );
              receiverWs.send(
                JSON.stringify({
                  type: "update_conversation_list",
                  message: sendMessage,
                })
              );
            }
            senderWs?.send(
              JSON.stringify({
                type: "message_delivered",
                message: sendMessage,
              })
            );
          }
          break;
      }
    });

    ws.on("close", () => {
      console.log(`用户 ${userId} 断开连接`);
      clients.delete(userId);
      clearInterval(heartbeatInterval);
    });

    ws.on("error", (error: any) => {
      console.error(`用户 ${userId} 连接错误:`, error);
      clients.delete(userId);
      clearInterval(heartbeatInterval);
    });
  } catch (error) {
    console.log(error);
    ws.close(1008, "Invalid token");
    clearInterval(heartbeatInterval);
  }
});
