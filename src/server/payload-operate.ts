// import { User } from './payload-types'
import { toast } from 'sonner';

export const payloadServerLogOut = (message: string = '退出成功！') => {
  fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
    method: 'POST',
  }).then(() => {
    toast.success(message);
  });
};
