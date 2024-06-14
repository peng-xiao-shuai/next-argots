import { Members } from 'pusher-js';
import { UserRole } from '&/enum';

/**
 * 签名成功返回的用户信息，由 pusher.signer() 触发 API_URL.PUSHER_SIGNIN 接口
 */
export type SigninSuccessUserData = {
  /**
   * pusher 生成 id
   * @example xxxx.xxxx_u0063_u0063
   */
  id: string;
  user_info: {
    name: string;
    message: string;
    code: '403' | '200' | '500' | '';
  };
};
/**
 * 授权连接成功返回的用户信息，由 cachePusher!.subscribe('presence-' + encryptData.roomName); 触发 API_URL.PUSHER_AUTH 接口
 */
export type AuthSuccessUserData = {
  /**
   * id 会存入 pusher 服务中用于频道查找用户
   */
  user_id: string;
  user_info: {
    /**
     * 用户名
     * @example _u006b_u006b_u006b
     */
    userId: string;
    /**
     * 头像
     */
    avatar: string;
    /**
     * 重连标识符
     */
    reconnection: 'true' | 'false';
    /**
     * 通道id
     */
    socket_id: string;
    /**
     * 頻道主才会有
     */
    roomRecordId?: string;
    role: UserRole;
    iv: string;
    nickname: string;
  };
};

/**
 * Event pusher:subscription_succeeded 事件返回数据
 */
export interface SubscriptionSuccessMember extends Members {
  me: {
    id: AuthSuccessUserData['user_id'];
    info: AuthSuccessUserData['user_info'];
  };
}
