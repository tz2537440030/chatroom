import prisma from "#/prisma-client";
import config from "@/config/index";
import { getFriendListModel } from "../contact/index.service";

export const momentResModel = {
  user: {
    select: config.userTableModel,
  },
  likeUsers: {
    select: config.userTableModel,
  },
  momentComments: {
    include: {
      user: {
        select: config.userTableModel,
      },
    },
  },
};

export const findMoment = async (momentId: any) => {
  return prisma.moments.findUnique({
    where: {
      id: momentId,
    },
    include: momentResModel,
  });
};

export const createMoment = async (moment: any) => {
  return prisma.moments.create({
    data: {
      content: moment.content,
      momentImages: moment.momentImages,
      userId: moment.userId,
    },
    include: momentResModel,
  });
};

export const createMomentLike = async (momentId: any, userId: any) => {
  return prisma.moments.update({
    where: {
      id: momentId,
    },
    data: {
      likeUsers: {
        connect: {
          id: userId,
        },
      },
    },
    include: momentResModel,
  });
};

export const createMomentComment = async (
  momentId: any,
  userId: any,
  content: any
) => {
  return prisma.momentComments.create({
    data: {
      momentId,
      userId,
      content,
    },
    include: momentResModel.momentComments.include,
  });
};

export const deleteMomentLike = async (momentId: any, userId: any) => {
  return prisma.moments.update({
    where: {
      id: momentId,
    },
    data: {
      likeUsers: {
        disconnect: {
          id: userId,
        },
      },
    },
    include: momentResModel,
  });
};

export const deleteMomentComment = async (commentId: any) => {
  return prisma.momentComments.delete({
    where: {
      id: commentId,
    },
  });
};

export const findMomentList = async (userId: number, skip?: number) => {
  const friends = await getFriendListModel(userId);
  const friendIds = friends.map((item) => item.id).concat(userId);
  return prisma.moments.findMany({
    where: {
      userId: {
        in: friendIds,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: config.momentsPageSize,
    skip: skip || 0,
    include: momentResModel,
  });
};

export const createMomentNotice = async (
  momentId: any,
  type: any,
  senderId: any,
  receiverId: any
) => {
  return prisma.momentNotice.create({
    data: {
      momentId,
      type,
      senderId,
      receiverId,
    },
    include: {
      moment: true,
      sender: {
        select: config.userTableModel,
      },
    },
  });
};

export const findMomentNoticeList = async (userId: any, skip?: number) => {
  return prisma.momentNotice.findMany({
    where: {
      receiverId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: config.momentsPageSize,
    skip: skip || 0,
    include: {
      moment: true,
      sender: {
        select: config.userTableModel,
      },
    },
  });
};

export const updateMomentNoticeRead = async (ids: any[]) => {
  return prisma.momentNotice.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      isRead: true,
    },
  });
};
