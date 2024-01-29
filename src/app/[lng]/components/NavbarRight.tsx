'use client';
import bus from '@/utils/bus';
import { FC, useContext } from 'react';
import type { Meta } from '../meta';
import { LocaleContext } from '@/context';
import { AiOutlineSetting } from 'react-icons/ai';
import Link from 'next/link';

export const NavRight: FC<{
  metadata: Meta;
}> = ({ metadata }) => {
  // 完成事件，点击触发全局通信
  const handleComplete = () => {
    bus.emit('complete');
  };
  const { language } = useContext(LocaleContext);
  return (
    <>
      {metadata.rightOperateType === 'setting' ? (
        <Link href={`/${language}/setting`}>
          <AiOutlineSetting className="ml-3 svg-icon fill-base-content" />
        </Link>
      ) : (
        <></>
      )}

      {metadata.rightOperateType === 'complete' ? (
        <button
          className="btn btn-active btn-primary btn-sm"
          onClick={handleComplete}
        >
          Complete
        </button>
      ) : (
        <></>
      )}
    </>
  );
};
