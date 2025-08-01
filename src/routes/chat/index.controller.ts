import HttpException from "@/models/http-exception.model";
import {
  checkIsExistConversation,
  findConversationList,
  findMessages,
  insertConversationParticipants,
  insertSingleConversation,
  updateMessageStatus,
} from "./index.service";

export const createConversation = async (
  req: {
    [x: string]: any;
    body: { senderId: string };
  },
  res: any
) => {
  const userId = req.headers["x-custom-header"];
  const { senderId } = req.body;
  const isExisting = await checkIsExistConversation(
    Number(userId),
    Number(senderId)
  );
  if (isExisting) {
    await updateMessageStatus(isExisting.id, Number(userId));
    const messages = await findMessages(isExisting.id);
    return res.json({
      code: 0,
      data: { ...isExisting, messages: messages.reverse() },
    });
  }
  const conversation = await insertSingleConversation();
  if (conversation) {
    const conversationParticipants1 = await insertConversationParticipants({
      conversationId: conversation.id,
      userId: Number(userId),
    });
    const conversationParticipants2 = await insertConversationParticipants({
      conversationId: conversation.id,
      userId: Number(senderId),
    });
    if (conversationParticipants1 && conversationParticipants2) {
      res.json({ code: 0, data: { ...conversation, messages: [] } });
    }
  }
};

export const getMessages = async (
  req: { body: { conversationId: string; skip?: number } },
  res: any
) => {
  const { conversationId, skip } = req.body;
  if (!conversationId) {
    throw new HttpException(400, "缺少必要参数");
  }
  const messages = await findMessages(Number(conversationId), skip || 0);
  if (messages) {
    res.json({
      code: 0,
      data: { messages: messages.reverse() },
    });
  }
};

export const getConversationList = async (req: any, res: any) => {
  const userId = req.headers["x-custom-header"];
  const count = await findConversationList(Number(userId));
  if (count) {
    res.json({ code: 0, data: count });
  }
};

export const changeMessageStatus = async (
  req: { body: { conversationId: string }; [x: string]: any },
  res: any
) => {
  const { conversationId } = req.body;
  const userId = req.headers["x-custom-header"];
  if (!conversationId) {
    throw new HttpException(400, "缺少必要参数");
  }
  const message = await updateMessageStatus(
    Number(conversationId),
    Number(userId)
  );
  if (message) {
    res.json({ code: 0, data: message });
  }
};
