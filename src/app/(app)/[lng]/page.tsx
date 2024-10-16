import Image from 'next/image';
import { ClientOperate } from './_components/Client';
import { GenerateMetadata } from './meta';

export const generateMetadata = async (props: CustomReactParams) => {
  const { lng } = await props.params;
  return await GenerateMetadata(lng, '/');
};

export default async function Home(props: CustomReactParams) {
  const params = await props.params;
  const { lng } = params;

  return (
    <>
      <div className="flex flex-wrap h-full items-center">
        <div className="w-24 h-24 m-auto rounded-box b3-opacity-6 dark:bg-black flex justify-center items-center">
          <Image
            className="filter invert-[80%] brightness-200 contrast-100 dark:invert-[5%]"
            src="/logo2.png"
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
