import HttpException from "@/models/http-exception.model";
import {
  checkFriendship,
  checkRequestIsExisting,
  createFriendShip,
  deleteFriendModel,
  findFriendByUsernameOrNickname,
  getFriendListModel,
  getFriendRequests,
  insertFriendRequest,
  updateFriendRequestRead,
  updateRequestStatus,
} from "./index.service";

export const getUserListByText = async (
  req: {
    [x: string]: any;
    body: { text: string };
  },
  res: any
) => {
  const { text } = req.body;
  const currentUserId = req.headers["x-custom-header"];
  const users = (await findFriendByUsernameOrNickname(text)).filter(
    (user) => user.id !== Number(currentUserId)
  );
  if (!text) {
    throw new HttpException(400, "缺少必要参数");
  } else if (users) {
    res.json({ code: 0, data: users, message: "查找成功" });
  }
};

export const createFriendRequest = async (
  req: { body: { senderId: number; receiverId: number } },
  res: any
) => {
  const { senderId, receiverId } = req.body;
  const isExisting = await checkRequestIsExisting(senderId, receiverId);
  const isFriend = await checkFriendship(senderId, receiverId);
  if (isFriend) {
    throw new HttpException(500, "好友关系已存在");
  } else if (isExisting) {
    throw new HttpException(500, "好友请求已存在");
  }
  const friendRequest = await insertFriendRequest({ senderId, receiverId });
  if (friendRequest) {
    res.json({ code: 0, data: friendRequest, message: "好友请求发送成功" });
  }
};

export const getFriendRequestList = async (req: any, res: any) => {
  try {
    const userId = req.headers["x-custom-header"];
    const friendRequests = (await getFriendRequests(Number(userId))).map(
      (item) => {
        return {
          ...item,
          isSender: item.senderId === Number(userId),
          requestInfo:
            item.senderId === Number(userId) ? item.receiver : item.sender,
        };
      }
    );
    if (friendRequests) {
      res.json({ code: 0, data: friendRequests, message: null });
    }
  } catch (error) {
    throw new HttpException(500, error);
  }
};

export const changeRequestStatus = async (
  req: { body: { id: number; status: string } },
  res: any
) => {
  try {
    const { id, status } = req.body;
    const friendRequest = await updateRequestStatus(id, status);
    if (friendRequest) {
      if (status === "accepted") {
        await createFriendShip({
          userId: friendRequest.senderId,
          friendId: friendRequest.receiverId,
        });
        await createFriendShip({
          userId: friendRequest.receiverId,
          friendId: friendRequest.senderId,
        });
      }
      res.json({ code: 0, data: friendRequest, message: "操作成功" });
    }
  } catch (error) {
    throw new HttpException(500, "操作失败");
  }
};

export const getFriendList = async (req: any, res: any) => {
  try {
    const userId = req.headers["x-custom-header"];
    const friendList = await getFriendListModel(Number(userId));
    if (friendList) {
      res.json({ code: 0, data: friendList, message: null });
    }
  } catch (error) {
    throw new HttpException(500, "查找失败");
  }
};

export const deleteFriend = async (req: any, res: any) => {
  try {
    const userId = req.headers["x-custom-header"];
    const { friendId } = req.body;
    const friend = await deleteFriendModel(Number(userId), Number(friendId));
    if (friend) {
      res.json({ code: 0, data: friend, message: "删除成功" });
    }
  } catch (error) {
    throw new HttpException(500, "删除失败");
  }
};

export const changeFriendRequestRead = async (
  req: { body: { id: number; isRead: boolean } },
  res: any
) => {
  try {
    const { id, isRead } = req.body;
    const friendRequest = await updateFriendRequestRead(id, isRead);
    if (friendRequest) {
      res.json({ code: 0, data: friendRequest, message: "操作成功" });
    }
  } catch (error) {
    throw new HttpException(500, "操作失败");
  }
};
