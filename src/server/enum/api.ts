export enum API_URL {
  /**
   * pusher 登录
   * @see https://pusher.com/docs/channels/using_channels/user-authentication/
   */
  PUSHER_SIGNIN = '/pusher/user-auth',

  /**
   * pusher 订阅授权
   * @see https://pusher.com/docs/channels/server_api/authorizing-users/
   */
  PUSHER_AUTH = '/pusher/auth',

  /**
   * 获取连接以判断是否存在房间号
   */
  GET_CHANNEL = '/pusher/getChannel',
}
