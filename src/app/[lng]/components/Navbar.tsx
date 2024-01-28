'use client';
import bus from '@/utils/bus';
import { FC, useContext } from 'react';
import type { Meta } from '../meta';
import meta from '../meta';
import { LocaleContext } from '@/context';
import { Lng, languages } from '@/locales/i18n';
import { AiOutlineHome, AiOutlineLeft, AiOutlineSetting } from 'react-icons/ai';
import { usePathname, useRouter } from 'next/navigation';

const NavRight: FC<{
  metadata: Meta;
}> = ({ metadata }) => {
  const router = useRouter();

  // 完成事件，点击触发全局通信
  const handleComplete = () => {
    bus.emit('complete');
  };
  const { language } = useContext(LocaleContext);
  return (
    <>
      {metadata.rightOperateType === 'setting' ? (
        <AiOutlineSetting
          className="ml-3 svg-icon fill-base-content"
          onClick={() => router.push(`/${language}/setting`)}
        />
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

export const Navbar = () => {
  const { t, language } = useContext(LocaleContext);
  // path 路径携带 / 开头
  const path = usePathname();
  const router = useRouter();

  const metadata = languages.includes(path.replace('/', '') as Lng)
    ? meta['/']
    : meta[path.replace('/' + language, '')] || {};
  // console.log(metadata, path);
  // console.log(
  //   i18next,
  //   t(metadata.locale),
  //   i18next.t(metadata.locale),
  //   metadata.locale
  // );
  // 点击左侧区域
  const leftClick = () => {
    if (metadata.title === 'Home') return;
    router.back();
  };

  return (
    <>
      <div className="navbar rounded-lg min-h-12 fixed z-10 bg-base-300 box-border w-[calc(100%-var(--padding)*2)]">
        <div className="flex-none" onClick={leftClick}>
          <label
            className={`swap swap-rotate items-center ${
              metadata.title === 'Home' ? 'swap-active' : ''
            }`}
          >
            <AiOutlineHome className="svg-icon !w-[1.3rem] !h-[1.3rem] mx-auto swap-on" />
            <AiOutlineLeft className="svg-icon swap-off" />
          </label>
        </div>
        <div className="flex-1">
          <span className="font-sans _bold text-color pl-2 text-1rem normal-case">
            {t(metadata.locale)}
          </span>
        </div>
        <div className="flex-none">
          <NavRight metadata={metadata}></NavRight>
        </div>
      </div>

      {metadata.isPlaceholder ? <div className="min-h-12 mb-4" /> : <></>}
    </>
  );
};
