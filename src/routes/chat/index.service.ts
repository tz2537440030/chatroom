import prisma from "#/prisma-client";
import config from "@/config/index";

export const insertSingleConversation = async () => {
  return prisma.conversation.create({
    data: {},
  });
};

export const insertConversationParticipants = async ({
  conversationId,
  userId,
}: {
  conversationId: number;
  userId: number;
}) => {
  return prisma.conversationParticipants.create({
    data: {
      conversationId,
      userId,
    },
  });
};

export const insertMessage = async ({
  conversationId,
  senderId,
  content,
}: {
  conversationId: number;
  senderId: number;
  content: string;
}) => {
  return prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
    },
  });
};

export const checkIsExistConversation = async (
  user1Id: number,
  user2Id: number
) => {
  return prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { userId: user1Id } } },
        { participants: { some: { userId: user2Id } } },
      ],
    },
  });
};

export const findMessages = async (conversationId: number, skip?: number) => {
  return prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: config.chatPageSize,
    skip: skip || 0,
  });
};

export const findConversationList = async (userId: number) => {
  // 查询当前用户的所有会话
  const conversations = await prisma.conversationParticipants.findMany({
    where: {
      userId,
    },
    include: {
      conversation: {
        include: {
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      },
    },
  });
  const receiver = await prisma.conversationParticipants.findMany({
    where: {
      conversationId: {
        in: conversations.map((item) => item.conversationId),
      },
      AND: {
        userId: {
          not: userId,
        },
      },
    },
    include: {
      user: {
        select: config.userTableModel,
      },
    },
  });
  // 查询用户每个会话的未读消息计数
  const userUnreadMessages = await prisma.message.groupBy({
    by: ["conversationId"],
    _count: {
      id: true,
    },
    where: {
      conversationId: {
        in: conversations.map((item) => item.conversationId),
      },
      isRead: false,
      senderId: {
        not: userId,
      },
    },
  });
  // 重新组织数据，增加未读消息计数字段和最后一条消息
  const newConversations = conversations.map((item) => {
    const unReadCount = userUnreadMessages.find(
      (message) => message.conversationId === item.conversationId
    )?._count.id;
    const lastMessage = item.conversation.messages[0];
    return {
      ...item,
      user: receiver.find(
        (receiver) => receiver.conversationId === item.conversationId
      )?.user,
      unReadCount: unReadCount || 0,
      lastMessage: lastMessage || {},
    };
  });
  const totalUnreadMessageCount = userUnreadMessages.reduce(
    (total, message) => total + message._count.id,
    0
  );
  return {
    conversations: newConversations,
    totalUnreadMessageCount: totalUnreadMessageCount,
  };
};

export const updateMessageStatus = async (
  conversationId: number,
  userId: number
) => {
  return prisma.message.updateMany({
    where: {
      conversationId,
      AND: {
        senderId: {
          not: userId,
        },
      },
    },
    data: {
      isRead: true,
    },
  });
};
