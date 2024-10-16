'use server';
import './style.css';
import Image from 'next/image';
import pck from '../../../../../../package.json';
import { useTranslation } from '@/locales/i18n';
import { ClientAboutMenu } from '../_components/ClientAbout';
import { GenerateMetadata } from '../../meta';

export const generateMetadata = async (props: CustomReactParams) => {
  const { lng } = await props.params;
  return await GenerateMetadata(lng, '/setting/about');
};
export default async function About(props: CustomReactParams) {
  const params = await props.params;
  const { lng } = params;

  const { t } = await useTranslation(lng);
  return (
    <>
      <div className="mt-36 mb-6 flex justify-center flex-wrap">
        <div className="w-24 h-24 mb-4 m-auto rounded-box b3-opacity-6 dark:bg-black flex justify-center items-center">
          <Image
            className="filter invert-[80%] brightness-200 contrast-100 dark:invert-[5%]"
            src="/logo2.png"
            alt="Logo"
            width={96}
            height={96}
            priority
          />
        </div>

        {/* pck.name 需要和对应 COMMON_KEYS.PACKAGE_NAME */}
        <div className="w-full text-center text-xl mb-2 capitalize font-bold tracking-wider">
          {t(pck.name)}
        </div>
        <div className="text-sm">{pck.version}</div>
      </div>

      <ul className="menu rounded-lg overflow-hidden">
        <ClientAboutMenu></ClientAboutMenu>
      </ul>
    </>
  );
}
