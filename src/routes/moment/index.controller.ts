import HttpException from "@/models/http-exception.model";
import {
  createMoment,
  createMomentComment,
  createMomentLike,
  createMomentNotice,
  deleteMomentLike,
  findMoment,
  findMomentList,
  findMomentNoticeList,
  updateMomentNoticeRead,
} from "./index.service";
import { sendFriendsMessage, sendMessage } from "@/utils/websocket";

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
      sendFriendsMessage({
        userId,
        type: "new_moment",
        data: returnMoment(moment),
      });
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
      const addNotice = await createMomentNotice(
        Number(momentId),
        "Like",
        Number(userId),
        Number(moment.userId)
      );
      if (addNotice) {
        sendMessage({
          receiverId: addNotice.moment.userId,
          type: "new_moment_notice",
          data: addNotice,
        });
      }
      sendFriendsMessage({
        userId,
        type: "update_moment_info",
        data: returnMoment(moment),
      });
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
      sendFriendsMessage({
        userId,
        type: "update_moment_info",
        data: returnMoment(moment),
      });
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
      const moment: any = await findMoment(Number(momentId));
      const addNotice = await createMomentNotice(
        Number(momentId),
        "Comment",
        Number(userId),
        Number(moment.userId)
      );
      if (addNotice) {
        sendMessage({
          receiverId: addNotice.moment.userId,
          type: "new_moment_notice",
          data: addNotice,
        });
      }
      sendFriendsMessage({
        userId,
        type: "update_moment_info",
        data: returnMoment(moment),
      });
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

export const getMomentNoticeList = async (req: any, res: any) => {
  try {
    const { skip } = req.body;
    const userId = req.headers["x-custom-header"];
    const momentNoticeList = await findMomentNoticeList(Number(userId), skip);
    if (momentNoticeList) {
      res.json({
        code: 0,
        data: momentNoticeList,
        message: null,
      });
    }
  } catch (error) {
    console.log(error);
    throw new HttpException(500, "查找失败");
  }
};

export const changeMomentNoticeRead = async (req: any, res: any) => {
  try {
    const { ids } = req.body;
    const momentNotice = await updateMomentNoticeRead(ids);
    if (momentNotice) {
      res.json({ code: 0, data: momentNotice, message: null });
    }
  } catch (error) {
    console.log(error);
    throw new HttpException(500, "更新失败");
  }
};

const returnMoment = (moment: any) => {
  return {
    ...moment,
    momentImages:
      moment.momentImages.length > 0 ? moment.momentImages.split(",") : [],
  };
};
