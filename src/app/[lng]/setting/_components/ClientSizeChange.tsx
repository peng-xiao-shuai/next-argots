'use client';
import { FC, useContext, useState } from 'react';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { AppContext } from '@/context';
import { toast } from 'sonner';
import { COMMON_KEYS } from '@@/locales/keys';
import { setSize } from '@/utils/set-app';

const BASE_SIZE = 13;
const rangeData: Indexes<number> = {
  [BASE_SIZE]: 0,
  14: 10,
  15: 20,
  16: 30,
  17: 40,
  18: 50,
  19: 60,
  20: 70,
};

export const ClientRangeInput: FC = () => {
  const { size, t } = useContext(AppContext);

  // range 长度
  const [rangeValue, setRangeValue] = useState(rangeData[size]);

  /**
   * 修改字体，在没有点击完成时，退出会将字体改回原样
   */
  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setRangeValue(Number(target.value));

    document.documentElement.style.fontSize = `${
      Number(target.value) / 10 + BASE_SIZE
    }px`;
  };

  const handleComplete = () => {
    setSize(Number(rangeValue) / 10 + BASE_SIZE);
    toast.success(t!(COMMON_KEYS.SUCCESSFULLY_SET));
  };

  useBusWatch('complete', handleComplete);

  return (
    <div className="relative leading-[24px] h-[30px] overflow-y-hidden">
      <div className="w-full flex justify-between absolute top-[6px] pointer-events-none px-[8px]">
        {Object.keys(rangeData).map((_item, i) => (
          <div key={i} className="w-[1px] h-[16px] bg-base-content z-[-1]" />
        ))}

        <div className="absolute z-[-1] w-[calc(100%-16px)] border-b border-base-content top-2/4 left-[8px] -translate-y-2/4"></div>
      </div>

      <input
        value={rangeValue}
        type="range"
        className="!bg-opacity-0"
        min="0"
        max="70"
        step={70 / 7}
        onChange={handleChange}
      />
    </div>
  );
};
