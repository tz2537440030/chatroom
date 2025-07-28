import express from "express";
import * as bodyParser from "body-parser";
import router from "@/routes/index";
import errorMiddleware from "@/models/err-middle-ware";
import {
  checkIsExistConversation,
  insertMessage,
} from "@/routes/chat/index.service";
import path from "path";
import { findUserById } from "@/routes/auth/index.service";
import { initWebSocket, onMessage, sendMessage } from "@/utils/websocket";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/apis", router);

const PORT = process.env.PORT || 3000;
app.use(errorMiddleware);
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// 初始化WebSocket
initWebSocket(server);

// 聊天消息处理
onMessage({
  type: "private_message",
  handler: async (payload: any, userId: any) => {
    // 判断会话是否存在,存在则插入消息,不存在则创建会话,并send转发消息给会话双方
    const isExisting = await checkIsExistConversation(
      Number(userId),
      Number(payload.receiverId)
    );
    if (isExisting) {
      const sendMessages = await insertMessage({
        conversationId: Number(payload.conversationId),
        senderId: Number(userId),
        content: payload.content,
      });
      sendMessage({
        receiverId: payload.receiverId,
        type: "new_message",
        data: sendMessages,
      });
      sendMessage({
        receiverId: payload.receiverId,
        type: "update_conversation_list",
        data: sendMessages,
      });
      sendMessage({
        receiverId: userId,
        type: "message_delivered",
        data: sendMessages,
      });
    }
  },
});

// 好友请求处理
onMessage({
  type: "friend_request",
  handler: async (payload: any) => {
    const { senderId, receiverId } = payload;
    const user = await findUserById(receiverId);
    if (user) {
      sendMessage({
        receiverId: receiverId,
        type: "new_friend_request",
        data: senderId,
      });
    }
  },
});
