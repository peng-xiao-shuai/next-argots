import { create } from 'zustand';

interface RoomStore {
  encryptData: {
    roomName: string;
    nickName: string;
    password: string;
  };
  setData: (data: RoomStore['encryptData']) => void;
}

export const useRoomStore = create<RoomStore>()((set) => ({
  encryptData: {
    roomName: '',
    nickName: '',
    password: '',
  },
  setData: (data) =>
    set((state) => {
      console.log('触发修改', data);

      return { encryptData: { ...state.encryptData, ...data } };
    }),
}));
