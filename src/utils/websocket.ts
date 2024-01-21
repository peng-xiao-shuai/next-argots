export enum MESSAGE_TYPE {
  INIT = 'init',
  PING = 'ping',
  PONG = 'pong',
  MSG = 'msg',
}

export type ChatObj = {
  type: MESSAGE_TYPE;
  msg: string;
};
export default class WsRequest {
  lockReconnect: boolean;
  url: string | URL;
  timeout: number;
  roomData: {
    nickName: string;
    roomName: string;
    passWord: string;
  };
  timeId?: NodeJS.Timeout;
  reconnectTimeId?: NodeJS.Timeout;
  socketTask?: WebSocket;
  manualLock?: boolean;
  cb?: (res: ChatObj) => void;

  constructor(
    url: WsRequest['url'],
    encryptData: WsRequest['roomData'],
    cb?: WsRequest['cb'],
    time?: number
  ) {
    this.lockReconnect = false; //避免重复连接
    this.url = url;
    this.cb = cb;
    this.roomData = encryptData;

    //心跳检测
    this.timeout = time || 1000; //多少秒执行检测

    try {
      this.initRequest();
    } catch {
      console.log('catch');
      this.reconnect();
    }
  }

  initRequest() {
    if (this.manualLock) {
      clearTimeout(this.timeId);
      clearTimeout(this.reconnectTimeId);
      return;
    }

    this.socketTask = new WebSocket(this.url);

    this.socketTask.onopen = (res) => {
      console.log('连接打开');

      // 发送房间密码等
      setTimeout(() => {
        console.log('执行发送');

        this.socketTask?.send(
          JSON.stringify({
            type: MESSAGE_TYPE.INIT,
            ...this.roomData,
          })
        );
      }, 200);

      // 清除重连定时器
      this.reconnectTimeId && clearTimeout(this.reconnectTimeId);
      // 开启检测
      this.start();
    };

    // 如果希望websocket连接一直保持，在close或者error上绑定重新连接方法。
    onclose = (res) => {
      console.log('连接关闭');
      this.reconnect();
    };

    this.socketTask.onerror = (res) => {
      console.log('连接错误');
      this.reconnect();
    };

    this.socketTask.onmessage = ({ data }) => {
      const ChatObj: ChatObj = JSON.parse(data);
      //接受任何消息都说明当前连接是正常的
      this.reset();
      if (
        ChatObj.type === MESSAGE_TYPE.PING &&
        ChatObj.msg === MESSAGE_TYPE.PONG
      )
        return;

      if (this.cb && typeof this.cb === 'function') {
        // 接受回调
        this.cb(ChatObj);
      }
      console.log('收到信息', ChatObj);

      // console.log('pong')
    };
  }

  send(type: MESSAGE_TYPE, value: string) {
    console.log('发送数据', value);

    // return new Promise((resolve, reject) => {
    this.socketTask?.send(
      JSON.stringify({
        type,
        msg: value,
      })
    );
    // })
  }

  // reset和start方法主要用来控制心跳的定时。
  reset() {
    // 清除定时器重新发送一个心跳信息
    clearTimeout(this.timeId);
    this.start();
  }
  start() {
    this.timeId = setTimeout(() => {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      this.socketTask?.send(
        JSON.stringify({
          type: MESSAGE_TYPE.PING,
        })
      );
    }, this.timeout);
  }

  // 重连
  reconnect() {
    // 防止多个方法调用，多处重连
    if (this.lockReconnect) {
      return;
    }
    this.lockReconnect = true;

    console.log('准备重连');

    //没连接上会一直重连，设置延迟避免请求过多
    this.reconnectTimeId = setTimeout(() => {
      // 重新连接
      this.initRequest();

      this.lockReconnect = false;
    }, 4000);
  }

  // 手动关闭
  close() {
    console.log('关闭连接');
    this.manualLock = true;

    this.socketTask?.close();
  }
}
