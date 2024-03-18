'use client';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction } from 'react';

export type AvatarName =
  | 'Aries'
  | 'Bat'
  | 'Butterfly'
  | 'Cheetah'
  | 'Dog'
  | 'Eagle-'
  | 'Fox'
  | 'Hipo'
  | 'Koala'
  | 'Lion'
  | 'Monkey'
  | 'Rhyno'
  | 'Starfish'
  | 'Swan'
  | 'Tiger'
  | 'Wolf'
  | '';

const avatars: AvatarName[] = [
  'Aries',
  'Bat',
  'Butterfly',
  'Cheetah',
  'Dog',
  'Eagle-',
  'Fox',
  'Hipo',
  'Koala',
  'Lion',
  'Monkey',
  'Rhyno',
  'Starfish',
  'Swan',
  'Tiger',
  'Wolf',
];
export const ImageSvg: FC<{
  name?: AvatarName;
  className?: string;
}> = ({ name, className }) => {
  return (
    <div
      className={`${className} rounded-full size-14 overflow-hidden flex justify-center items-center ${
        name ? 'dark:bg-black bg-white' : ''
      }`}
    >
      <Image
        src={name ? `/avatar/${name}.svg` : '/logo.svg'}
        alt={name || 'avatar'}
        width={30}
        height={30}
        className={`filter ${
          name
            ? 'dark:invert-[80%] dark:brightness-200 dark:contrast-100 w-[60%] h-[60%]'
            : 'rounded-full'
        }`}
      ></Image>
    </div>
  );
};

export const GridAvatar: FC<{
  setAvatar: Dispatch<SetStateAction<AvatarName>>;
  setAvatarVisible: Dispatch<SetStateAction<boolean>>;
}> = ({ setAvatar, setAvatarVisible }) => {
  return (
    <ul className="dropdown-content !duration-300 mt-2 grid grid-cols-6 bg-opacity-80 gap-x-2 gap-y-3 px-2 py-3 z-[1] bg-base-300 rounded-sm w-full">
      {avatars.map((item) => (
        <li
          key={item}
          onClick={(e) => {
            e.stopPropagation();
            setAvatar(item);
            setAvatarVisible(false);
          }}
          className="w-full rounded-md flex justify-center items-center border border-accent-content border-opacity-20 transition-all duration-300 hover:scale-105 hover:border-opacity-100 "
        >
          <ImageSvg
            name={item}
            className="w-10 h-10 !bg-transparent"
          ></ImageSvg>
        </li>
      ))}
    </ul>
  );
};
