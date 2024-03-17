import { Members } from 'pusher-js';
import { UserRole } from '../enum';

/**
 * 签名成功返回的用户信息，由 pusher.signer() 触发 API_URL.PUSHER_SIGNIN 接口
 */
export type SigninSuccessUserData = {
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
  user_id: string;
  user_info: {
    userId: string;
    /**
     * 房主才会有
     */
    roomRecordId?: string;
    role: UserRole;
    iv: string;
    name: string;
  };
};

/**
 * Event pusher:subscription_succeeded 事件返回数据
 */
export interface SubscriptionSuccessMember extends Members {
  me: {
    id: string;
    info: AuthSuccessUserData['user_info'];
  };
}
