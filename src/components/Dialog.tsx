'use client';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { debounce } from '@/utils/debounce-throttle';

export const Dialog: FC<{
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>> | ((data: boolean) => void);
  children: React.ReactNode;
  contentClassName?: string;
}> = ({ visible, setVisible, children, contentClassName }) => {
  const [boxVisible, setBoxVisible] = useState(false);

  useEffect(() => {
    const time = setTimeout(() => {
      setBoxVisible(true);
      clearTimeout(time);
    }, 300);
  }, [visible]);

  const handleClose = () =>
    debounce(() => {
      setBoxVisible(false);

      const time = setTimeout(() => {
        setVisible(!visible);
        clearTimeout(time);
        // 与 duration-200 时间相同
      }, 200);
    });

  return (
    <>
      <div
        className={`dialog fixed w-full z-50 h-[100vh] left-0 top-0 transition-all duration-[300ms] ${
          visible ? 'opacity-1' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`flex justify-center items-center w-full h-[100vh] bg-black/60`}
          onClick={handleClose}
        >
          <div
            className={`text-lg _p rounded-lg max-w-[90vw] min-w-[128px] transition-all duration-200 transform scale-50 ${
              boxVisible ? '!scale-100 opacity-100' : 'opacity-0'
            } ${contentClassName || 'bg-base-100 opacity-95'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
