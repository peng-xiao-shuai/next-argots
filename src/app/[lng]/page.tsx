import logo from '/public/logo4.png';
import Image from 'next/image';
import { ClientOperate } from './_components/Client';
import { GenerateMetadata } from './meta';

export const generateMetadata = async ({
  params: { lng },
}: CustomReactParams) => await GenerateMetadata(lng, '/');

export default function Home({ params: { lng } }: CustomReactParams) {
  return (
    <>
      <div className="flex flex-wrap h-[80%] items-center">
        <Image
          className="w-32 h-32 m-auto mask mask-squircle"
          src={logo}
          alt="Logo"
        />

        <ClientOperate lng={lng}></ClientOperate>
      </div>
    </>
  );
}
