import { AuthSuccessUserData } from '@/app/api/pusher/[path]/pusher-type';
import { AvatarName } from '@/components/ImageSvg';
import { create } from 'zustand';

interface RoomStore {
  encryptData: {
    avatar: AvatarName;
    roomName: string;
    nickName: string;
    password: string;
  };
  userInfo: Partial<AuthSuccessUserData['user_info']>;
  setData: (data: Partial<RoomStore['encryptData']>) => void;
  setUserInfoData: (data: RoomStore['userInfo']) => void;
}

export const useRoomStore = create<RoomStore>()((set) => ({
  encryptData: {
    avatar: '',
    roomName: '',
    nickName: '',
    password: '',
  },
  userInfo: {},
  setData: (data) =>
    set((state) => {
      return { encryptData: { ...state.encryptData, ...data } };
    }),
  setUserInfoData: (data) =>
    set(() => {
      return { userInfo: { ...data } };
    }),
}));
