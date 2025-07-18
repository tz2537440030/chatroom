const config = {
  // 每页聊天信息条数
  chatPageSize: 20,
  // 排除user表的password字段返回给前端
  userTableModel: {
    id: true,
    username: true,
    nickname: true,
    avatar: true,
    createdAt: true,
    updatedAt: true,
  },
};

export default config;
