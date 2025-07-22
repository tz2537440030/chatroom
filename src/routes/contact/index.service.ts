import prisma from "#/prisma-client";
/**
 * 使用用户名或昵称查找用户
 * @param {string} text
 * @returns {Promise<User | null>}
 */
export const findFriendByUsernameOrNickname = (text: string) => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      nickname: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      OR: [
        { username: text }, // 精确匹配 username
        { nickname: { contains: text } }, // 模糊匹配 nickname
      ],
    },
  });
};

// 发送好友请求
export const insertFriendRequest = async ({
  senderId,
  receiverId,
}: {
  senderId: number;
  receiverId: number;
}) => {
  return prisma.friendRequest.create({
    data: {
      senderId,
      receiverId,
    },
  });
};

// 获取好友请求
export const getFriendRequests = async (userId: number) => {
  return prisma.friendRequest.findMany({
    where: {
      OR: [{ receiverId: userId }, { senderId: userId }],
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          nickname: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          nickname: true,
        },
      },
    },
  });
};

// 检查好友请求是否存在
export const checkRequestIsExisting = (
  senderId: number,
  receiverId: number
) => {
  return prisma.friendRequest.findFirst({
    where: {
      senderId,
      receiverId,
      status: "pending",
    },
  });
};

// 更新好友请求状态
export const updateRequestStatus = async (id: number, status: string) => {
  return prisma.friendRequest.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};

// 建立好友关系
export const createFriendShip = async ({
  userId,
  friendId,
}: {
  userId: number;
  friendId: number;
}) => {
  return prisma.friendship.create({
    data: {
      user1Id: userId,
      user2Id: friendId,
    },
  });
};

// 检查是否为好友关系
export const checkFriendship = async (userId: number, friendId: number) => {
  return prisma.friendship.findFirst({
    where: {
      OR: [
        { user1Id: userId, user2Id: friendId },
        { user1Id: friendId, user2Id: userId },
      ],
    },
  });
};

// 获取好友列表
export const getFriendListModel = async (userId: number) => {
  const friendships = await prisma.friendship.findMany({
    where: {
      user1Id: userId,
    },
    include: {
      user2: {
        select: {
          id: true,
          username: true,
          nickname: true,
          avatar: true,
        },
      },
    },
  });
  return friendships.map((item) => item.user2);
};

// 删除好友
export const deleteFriendModel = async (userId: number, friendId: number) => {
  return prisma.friendship.deleteMany({
    where: {
      OR: [
        { user1Id: userId, user2Id: friendId },
        { user1Id: friendId, user2Id: userId },
      ],
    },
  });
};

export const updateFriendRequestRead = async (id: number, isRead: boolean) => {
  return prisma.friendRequest.update({
    where: {
      id,
    },
    data: {
      isRead,
    },
  });
};
