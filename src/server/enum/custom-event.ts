export enum CustomEvent {
  /**
   * 客户端通信
   */
  RECEIVE_INFORMATION = 'client-receive_information',

  /**
   * 用户向房主发送聊天记录请求事件
   */
  GET_RECORDS_REQ = 'client-get_records_req',
  /**
   * 房主向用户发送聊天记录请求响应事件
   */
  GET_RECORDS_RES = 'client-get_records_res',
}
