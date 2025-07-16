import prisma from "#/prisma-client";

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
    take: 5,
    skip: skip || 0,
  });
};
