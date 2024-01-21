'use client';
import { debounce } from '@/utils/debounce-throttle';
import { AiOutlineRight } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LANGUAGE_KEYS from '@/language/keys';

export default function Setting() {
  const router = useRouter();
  const [lists, setLists] = useState([
    {
      label: '深色模式',
      locale: LANGUAGE_KEYS.DARK_PATTERN,
      path: '/theme-change',
    },
    {
      label: '字体大小',
      locale: LANGUAGE_KEYS.TEXT_SIZE,
      path: '/size-change',
    },
    {
      label: '多语言',
      locale: LANGUAGE_KEYS.MULTI_LANGUAGE,
      path: '/lang-change',
    },
    {
      label: '关于',
      locale: LANGUAGE_KEYS.ABOUT,
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
    <ul className="menu rounded-lg overflow-hidden bg-base-300">
      {lists.map((item, index) => (
        <li
          key={item.path}
          className={`flex-row h-12 items-center justify-between row-active rounded-lg
        ${index > 0 ? 'border-t border-base-100 border-solid' : ''}
      `}
          onClick={() => debounce(() => router.push(item.path))}
        >
          <span className="px-0">{item.locale}</span>
          <AiOutlineRight className="w-3 h-3 p-0 fill-base-content" />
        </li>
      ))}
    </ul>
  );
}
