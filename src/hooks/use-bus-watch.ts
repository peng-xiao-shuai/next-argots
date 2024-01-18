import { useEffect } from 'react';
import bus from '@/utils/bus';
import { Handler } from 'mitt';
export const useBusWatch = (
  _type: string,
  _handler: Handler,
  beforeUnload: () => void = () => {}
) => {
  useEffect(() => {
    // 启用监听、
    bus.on(_type, _handler);

    // 在组件卸载之前移除监听
    return () => {
      beforeUnload();

      bus.off(_type, _handler);
    };
  }, [_type, _handler, beforeUnload]);
};
