'use server';
import './style.css';
import logo from '/public/logo.svg';
import Image from 'next/image';
import pck from '../../../../../package.json';
import { useTranslation } from '@/locales/i18n';
import { ClientAboutMenu } from '../_components/ClientAbout';
import { GenerateMetadata } from '../../meta';

export const generateMetadata = async ({
  params: { lng },
}: CustomReactParams) => await GenerateMetadata(lng, '/setting/about');

export default async function About({ params: { lng } }: CustomReactParams) {
  const { t } = await useTranslation(lng);
  return (
    <>
      <div className="mt-24 mb-6 flex justify-center flex-wrap">
        <Image className="w-24 h-24 mb-4 rounded-box" src={logo} alt="" />

        {/* pck.name 需要和对应 COMMON_KEYS.PACKAGE_NAME */}
        <div className="w-full text-center text-xl mb-2 capitalize font-bold tracking-wider">
          {t(pck.name)}
        </div>
        <div className="text-sm">{pck.version}</div>
      </div>

      <ul className="menu rounded-lg overflow-hidden bg-base-300 bg-opacity-60">
        <ClientAboutMenu></ClientAboutMenu>
      </ul>
    </>
  );
}
