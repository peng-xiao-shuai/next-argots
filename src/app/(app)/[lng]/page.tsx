import Image from 'next/image';
import { ClientOperate } from './_components/Client';
import { GenerateMetadata } from './meta';

export const generateMetadata = async ({
  params: { lng },
}: CustomReactParams) => await GenerateMetadata(lng, '/');

export default function Home({ params: { lng } }: CustomReactParams) {
  return (
    <>
      <div className="flex flex-wrap h-full items-center">
        <div className="w-24 h-24 m-auto rounded-box b3-opacity-6 dark:bg-black flex justify-center items-center">
          <Image
            className="filter invert-[80%] brightness-200 contrast-100 dark:invert-[5%]"
            src="/logo.svg"
            alt="Logo"
            width={96}
            height={96}
            priority
          />
        </div>

        <ClientOperate lng={lng}></ClientOperate>
      </div>
    </>
  );
}
