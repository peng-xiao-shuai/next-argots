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
  setVisible: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}> = ({ visible, setVisible, children }) => {
  const [boxVisible, setBoxVisible] = useState(false);

  useEffect(() => {
    const time = setTimeout(() => {
      setBoxVisible(true);
      clearTimeout(time);
    }, 300);
  }, [visible]);

  return (
    <>
      <div
        className={`dialog fixed w-full z-50 h-[100vh] left-0 top-0 transition-all duration-[300ms] ${
          visible ? 'opacity-1' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`flex justify-center items-center w-full h-[100vh] bg-black/60`}
          onClick={() =>
            debounce(() => {
              setBoxVisible(false);

              const time = setTimeout(() => {
                setVisible(!visible);
                clearTimeout(time);
                // 与 duration-200 时间相同
              }, 200);
            })
          }
        >
          <div
            className={`p-5 rounded-lg bg-base-300 max-w-[90vw] min-w-[8rem] transition-all duration-200 transform scale-50 ${
              boxVisible ? '!scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
