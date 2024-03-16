'use client';
import bus from '@/utils/bus';
import { FC } from 'react';
import type { Meta } from '../app/[lng]/meta';
import { useTranslation } from '@/locales/client';
import { AiOutlineSetting } from 'react-icons/ai';
import Link from 'next/link';
import { COMMON_KEYS } from '@@/locales/keys';

export const NavRight: FC<{
  metadata: Meta;
}> = ({ metadata }) => {
  // 完成事件，点击触发全局通信
  const handleComplete = () => {
    bus.emit('complete');
  };
  const { t, i18n } = useTranslation();

  return (
    <>
      {metadata.rightOperateType === 'setting' ? (
        <Link href={`/${i18n.language}/setting`}>
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
          {t(COMMON_KEYS.COMPLETE)}
        </button>
      ) : (
        <></>
      )}
    </>
  );
};
