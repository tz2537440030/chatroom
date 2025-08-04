import HttpException from "@/models/http-exception.model";
import {
  createMoment,
  createMomentComment,
  createMomentLike,
  deleteMomentLike,
  findMoment,
  findMomentList,
} from "./index.service";
import { getFriendListModel } from "../contact/index.service";
import { sendMessage } from "@/utils/websocket";

export const newMoment = async (req: any, res: any) => {
  try {
    const { content, imageUrls = [] } = req.body;
    const userId = Number(req.headers["x-custom-header"]);
    if (!content) {
      throw new HttpException(400, "缺少必要参数");
    }
    const moment = await createMoment({
      content,
      momentImages: imageUrls.join(","),
      userId: userId,
    });
    if (moment) {
      res.json({ code: 0, data: moment, message: "创建成功" });
    }
  } catch (error) {
    console.log(error);
    throw new HttpException(500, "创建失败");
  }
};

export const getMomentList = async (req: any, res: any) => {
  try {
    const { skip } = req.body;
    const userId = req.headers["x-custom-header"];
    const momentList = await findMomentList(Number(userId), skip);
    if (momentList) {
      res.json({
        code: 0,
        data: momentList.map((item: any) => returnMoment(item)),
        message: null,
      });
    }
  } catch (error) {
    console.log(error);
    throw new HttpException(500, "查找失败");
  }
};

export const likeMoment = async (req: any, res: any) => {
  try {
    const { momentId } = req.body;
    const userId = req.headers["x-custom-header"];
    const moment = await createMomentLike(Number(momentId), Number(userId));
    if (moment) {
      updateAllFriendsMomentWs(moment, userId);
      res.json({
        code: 0,
        data: returnMoment(moment),
        message: "点赞成功",
      });
    }
  } catch (error) {
    console.log(error);
    throw new HttpException(500, "点赞失败");
  }
};

export const cancelLikeMoment = async (req: any, res: any) => {
  try {
    const { momentId } = req.body;
    const userId = req.headers["x-custom-header"];
    const moment = await deleteMomentLike(Number(momentId), Number(userId));
    if (moment) {
      updateAllFriendsMomentWs(moment, userId);
      res.json({
        code: 0,
        data: returnMoment(moment),
        message: "取消成功",
      });
    }
  } catch (error) {
    console.log(error);
    throw new HttpException(500, "取消失败");
  }
};

export const newMomentComment = async (req: any, res: any) => {
  try {
    const { momentId, content } = req.body;
    const userId = req.headers["x-custom-header"];
    const momentComment = await createMomentComment(
      Number(momentId),
      Number(userId),
      content
    );
    if (momentComment) {
      const moment = await findMoment(Number(momentId));
      updateAllFriendsMomentWs(moment, userId);
      res.json({
        code: 0,
        data: returnMoment(moment),
        message: "评论成功",
      });
    }
  } catch (error) {
    console.log(error);
    throw new HttpException(500, "评论失败");
  }
};

const returnMoment = (moment: any) => {
  return {
    ...moment,
    momentImages:
      moment.momentImages.length > 0 ? moment.momentImages.split(",") : [],
  };
};

const updateAllFriendsMomentWs = async (moment: any, userId: any) => {
  const friends = await getFriendListModel(Number(userId));
  const friendIds = friends.map((item) => item.id);
  friendIds.forEach((item) => {
    sendMessage({
      receiverId: item,
      type: "update_moment_info",
      data: returnMoment(moment),
    });
  });
};
