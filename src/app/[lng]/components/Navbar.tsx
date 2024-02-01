'use client';
import meta from '../meta';
import { useTranslation } from '@/locales/client';
import { Lng, languages } from '@/locales/i18n';
import { AiOutlineHome, AiOutlineLeft } from 'react-icons/ai';
import { usePathname } from 'next/navigation';
import { NavRight } from './NavbarRight';
import Link from 'next/link';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  // path 路径携带 / 开头
  const path = usePathname();
  const pathArr = path.split('/');
  pathArr.splice(pathArr.length - 1, 1);

  const metadata = languages.includes(path.replace('/', '') as Lng)
    ? meta['/']
    : meta[path.replace('/' + i18n.language, '')] || {};
  // console.log(metadata, path);
  // console.log(
  //   i18next,
  //   t(metadata.locale),
  //   i18next.t(metadata.locale),
  //   metadata.locale
  // );

  return (
    <>
      <div className="navbar rounded-lg min-h-12 fixed z-10 bg-base-300 box-border w-[calc(100%-var(--padding)*2)]">
        <Link href={metadata.title === 'Home' ? '' : pathArr.join('/')}>
          <div className="flex-none">
            <label
              className={`swap swap-rotate items-center ${
                metadata.title === 'Home' ? 'swap-active' : ''
              }`}
            >
              <AiOutlineHome className="svg-icon !w-[1.3rem] !h-[1.3rem] mx-auto swap-on" />
              <AiOutlineLeft className="svg-icon swap-off" />
            </label>
          </div>
        </Link>

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
