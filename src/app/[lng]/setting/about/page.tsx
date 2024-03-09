'use server';
import './style.css';
import logo from '/public/logo4.png';
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
      <div className="pt-24 flex justify-center flex-wrap">
        <Image
          className="w-32 h-32 mb-4 mask mask-squircle"
          src={logo}
          alt=""
        />

        {/* pck.name 需要和对应 COMMON_KEYS.PACKAGE_NAME */}
        <div className="w-full text-center text-xl">{t(pck.name)}</div>
        <div className="text-sm">{pck.version}</div>
      </div>

      <ul className="menu w-full rounded-box py-4 px-0">
        <ClientAboutMenu></ClientAboutMenu>
      </ul>
    </>
  );
}
