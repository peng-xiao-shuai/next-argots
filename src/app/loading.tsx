'use client';
import { useState, useEffect } from 'react';
export default function LoadingRender() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);

    // 演示 100ms 内数据返回则不显示 loading
    const time = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => {
      clearTimeout(time);
    };
  }, []);
  return (
    <div
      className={`transition-all duration-300 h-full flex items-center justify-center ${
        visible ? '' : 'opacity-0'
      }`}
    >
      <div className="flex items-end font-bold">
        <span>Loading</span>
        <span className="loading loading-dots loading-xs ml-1 leading-9"></span>
      </div>
    </div>
  );
}
