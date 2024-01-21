import type { ChatObj } from '@/utils/websocket';
import { MESSAGE_TYPE } from '@/utils/websocket';
import WsRequest from '@/utils/websocket';
import AES from '@/utils/aes';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export type Chat = ChatObj & {
  isMy?: boolean;
};

export const useWebsocket = () => {
  // const { encryptData } = {useRoomStore()}
  const encryptData = { nickName: '', roomName: '', passWord: '' };
  const [chat, setChat] = useState<Chat[]>([]);
  const path = usePathname();

  // // 设置加密
  // const aes = new AES({
  //   passphrase: 'ccc',
  //   salt: 'cccc',
  // });
  // // 3vS+Hi2uerOSnnOH49Epqw==
  // console.log(aes.encrypted('33'));

  // // 连接ws
  // const [socket] = useState<WsRequest>();
  // // new WsRequest(
  // //   'ws://124.222.209.73:8092/websocketRoom',
  // //   encryptData,
  // //   (dataObj) => {
  // //     console.log(aes.decrypted(dataObj.msg));

  // //     // setChat((chat) => {
  // //     //   chat.push({
  // //     //     type: MESSAGE_TYPE.MSG,
  // //     //     msg:
  // //     //       dataObj.type === MESSAGE_TYPE.MSG
  // //     //         ? aes.decrypted(dataObj.msg)
  // //     //         : dataObj.msg,
  // //     //   });
  // //     //   return chat;
  // //     // });
  // //   }
  // // )

  // useEffect(() => {
  //   return () => {
  //     console.log('执行清除');

  //     socket?.close();
  //   };
  // }, [path, socket]);

  // 发送数据
  const handleSend = (value: string) => {
    // if (!value) return;
    // socket?.send(MESSAGE_TYPE.MSG, aes.encrypted(value));
    // // setChat((chat) => {
    // //   chat.push({
    // //     type: MESSAGE_TYPE.MSG,
    // //     isMy: true,
    // //     msg: value,
    // //   });
    // //   return chat;
    // // });
  };

  return {
    chat,
    handleSend,
  };
};
