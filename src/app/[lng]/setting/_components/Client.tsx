'use client';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { COMMON_KEYS } from '@@/locales/keys';
import { useTranslation } from '@/locales/client';
import { debounce } from '@/utils/debounce-throttle';
import { AiOutlineRight } from 'react-icons/ai';

export const ClientMenu: FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [lists, setLists] = useState([
    {
      label: '深色模式',
      locale: COMMON_KEYS.DARK_PATTERN,
      path: '/theme-change',
    },
    {
      label: '字体大小',
      locale: COMMON_KEYS.TEXT_SIZE,
      path: '/size-change',
    },
    {
      label: '多语言',
      locale: COMMON_KEYS.MULTI_LANGUAGE,
      path: '/lang-change',
    },
    {
      label: '关于',
      locale: COMMON_KEYS.ABOUT,
      path: '/about',
    },
  ]);

  useEffect(() => {
    if (!lists[0].path.includes(location?.pathname)) {
      const copyLists = lists.map((item) => ({
        ...item,
        path: location.pathname + item.path,
      }));

      setLists(copyLists);
    }
  }, [lists]);
  return (
    <>
      {lists.map((item, index) => (
        <li
          key={item.path}
          className={`text-base-content flex-row h-12 items-center justify-between row-active rounded-lg
        ${index > 0 ? 'border-t border-base-100 border-solid' : ''}
      `}
          onClick={() => debounce(() => router.push(item.path))}
        >
          <span className="px-0">{t(item.locale)}</span>
          <AiOutlineRight className="w-3 h-3 p-0 fill-base-content" />
        </li>
      ))}
    </>
  );
};
