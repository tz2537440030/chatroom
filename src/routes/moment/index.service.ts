import prisma from "#/prisma-client";
import config from "@/config";
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
