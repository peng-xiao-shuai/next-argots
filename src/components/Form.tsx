'use client';
import React, { FC, Fragment, useContext, useEffect, useState } from 'react';
import { useForm, SubmitHandler, RegisterOptions } from 'react-hook-form';
import { z } from 'zod';
import CryptoJS from 'crypto-js';
import { COMMON_KEYS, HOME_KEYS, SETTING_KEYS } from '@@/locales/keys';
import { AppContext } from '@/context';
import { useRouter } from 'next/navigation';
import { useRoomStore } from '@/hooks/use-room-data';
import { fetchReq } from '@/utils/request';
import { copyText, stringToUnicode } from '@/utils/string-transform';
import { usePusher } from '@/hooks/use-pusher';
import { API_URL, RoomStatus } from '&/enum';
import { AvatarName, GridAvatar, ImageSvg } from './ImageSvg';
import { Lng } from '@/locales/i18n';
import { HiMiniInformationCircle } from 'react-icons/hi2';
import Cookies from 'js-cookie';
import { trpc } from '@/server/trpc/client';
import { toast } from 'sonner';

const formDataRules = z.object({
  avatar: z.string(),
  nickName: z.string().min(1, HOME_KEYS.EMPTY_NICKNAME).max(24),
  roomName: z.string().min(1, HOME_KEYS.EMPTY_ROOM_NUMBER).max(24),
  password: z.string().min(1, HOME_KEYS.EMPTY_PASSWORD).max(24),
});

type FormData = z.infer<typeof formDataRules>;

interface FormView {
  type: React.HTMLInputTypeAttribute;
  locale: string;
  prop: 'roomName' | 'nickName' | 'password';
  validation?: RegisterOptions<FormData>;
}

type HomeForm = FC<{
  roomStatus: RoomStatus;
  lng: Lng;
  visible: boolean;
}>;
export const HomeForm: HomeForm = ({ roomStatus, lng, visible }) => {
  const formView: FormView[] = [
    {
      type: 'text',
      locale: HOME_KEYS.ROOM_NUMBER,
      prop: 'roomName',
      validation: {
        required: HOME_KEYS.EMPTY_ROOM_NUMBER,
        maxLength: 12,
      },
    },
    {
      type: 'text',
      locale: HOME_KEYS.NICKNAME,
      prop: 'nickName',
      validation: {
        required: HOME_KEYS.EMPTY_NICKNAME,
        maxLength: 12,
      },
    },
    {
      type: 'password',
      locale: HOME_KEYS.PASSWORD,
      prop: 'password',
      validation: {
        required: HOME_KEYS.EMPTY_PASSWORD,
        maxLength: 12,
      },
    },
  ];

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const { t } = useContext(AppContext);
  const { signin } = usePusher();
  const router = useRouter();
  const { setData } = useRoomStore();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    setLoading(true);
    // 加密数据
    const encryptData = {
      nickName: stringToUnicode(formData.nickName),
      roomName: stringToUnicode(formData.roomName),
      password: CryptoJS.SHA256(formData.password).toString(),
    };

    try {
      const { data } = await fetchReq(API_URL.GET_CHANNEL, {
        roomName: encryptData.roomName,
      });

      if (roomStatus === RoomStatus.JOIN && !data.isRoom) {
        setError('root.roomName', {
          type: 'custom',
          message: `${HOME_KEYS.HOME_API}.${HOME_KEYS.NO_ROOM_NAME}`,
        });
        throw new Error('');
      }

      if (roomStatus === RoomStatus.ADD && data.isRoom) {
        setError('root.roomName', {
          type: 'custom',
          message: `${HOME_KEYS.HOME_API}.${HOME_KEYS.ROOM_NAME}`,
        });

        throw new Error(data.message);
      }

      setData({
        ...encryptData,
        avatar: avatar,
      });

      signin(roomStatus)
        .then((res) => {
          Cookies.set('pw-256', encryptData.password);
          Cookies.set('hash', res);
          router.push(`/${lng}/chat-room`);
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
        });
    } catch (err) {
      setLoading(false);
      trigger('roomName');
    }
  };
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<AvatarName>('');
  const [avatarVisible, setAvatarVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setFocus('roomName');
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onClick={() => {
        setAvatarVisible(false);
      }}
    >
      <ItemLabel label={t!(HOME_KEYS.AVATAR)}>
        <div
          className={`dropdown ${
            avatarVisible ? 'dropdown-open' : 'dropdown-close'
          } w-full mb-4`}
        >
          <div
            role="button"
            onClick={(e) => {
              e.preventDefault();
              setAvatarVisible(true);
            }}
            className={`${InputClassName} flex items-center gap-2 b3-opacity-6`}
          >
            <ImageSvg
              name={avatar}
              className="w-8 h-8 opacity-70 !bg-transparent"
            ></ImageSvg>

            <input
              type="text"
              className="grow !bg-transparent"
              placeholder={t!(HOME_KEYS.AVATAR)}
              value={avatar}
              readOnly
            />
          </div>
          <GridAvatar
            setAvatar={setAvatar}
            setAvatarVisible={setAvatarVisible}
          ></GridAvatar>
        </div>
      </ItemLabel>

      {formView.map((item, index) => (
        <ItemLabel key={item.prop} label={t!(item.locale)}>
          <input
            type={item.type}
            placeholder={t!(HOME_KEYS.PLEASE_INPUT) + t!(item.locale)}
            {...register(item.prop, item.validation)}
            maxLength={item.validation?.maxLength as number}
            className={`mb-1 ${
              errors[item.prop] || errors.root?.[item.prop] ? '' : ''
            }
             ${InputClassName}`}
          />

          <div
            className={`
            ${index === formView.length - 1 ? 'mb-4' : ''}
            ${
              errors[item.prop] || errors.root?.[item.prop]
                ? 'opacity-1 h-auto'
                : 'opacity-0 h-0'
            } pl-2 transition-all duration-300 text-xs left-0 bottom-[0.5rem] text-error`}
          >
            {t!(
              errors[item.prop]?.message ||
                errors.root?.[item.prop]?.message ||
                ''
            )}
          </div>
        </ItemLabel>
      ))}

      <button
        className="btn btn-primary mx-auto block w-2/3 disabled:bg-primary/50 disabled:text-neutral-400"
        disabled={loading}
        type="submit"
      >
        <span
          className={`loading loading-spinner ${
            loading ? 'opacity-1' : 'loading-hidden'
          }`}
        />
        {t!(COMMON_KEYS.COMPLETE)}
      </button>
    </form>
  );
};

const InputClassName =
  'input w-full transition-all duration-300 outline-none focus-within:outline-none focus-within:border-primary focus-within:shadow-sm focus-within:shadow-primary focus:outline-none focus:border-primary focus:shadow-sm focus:shadow-primary';

export const ItemLabel: FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  return (
    <div className="w-full relative">
      <label className="inline-block text-base mb-2 text-accent-content _p-x">
        {label}
      </label>
      {children}
    </div>
  );
};

export const ShareForm: FC<{
  isChannelUserExist: (nickName: string) => boolean;
}> = ({ isChannelUserExist }) => {
  const formView: FormView[] = [
    {
      type: 'text',
      locale: HOME_KEYS.NICKNAME,
      prop: 'nickName',
      validation: {
        maxLength: 12,
      },
    },
  ];

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();
  const { t } = useContext(AppContext);
  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    if (isChannelUserExist(stringToUnicode(formData.nickName))) {
      setError('root.nickName', {
        type: 'custom',
        message: `The user name already exists`,
      });

      return;
    }

    toast('Coming soon');
    // setLoading(true);
  };
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<AvatarName>('');
  const [avatarVisible, setAvatarVisible] = useState(false);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onClick={() => {
        setAvatarVisible(false);
      }}
    >
      <ItemLabel
        label={`${t!(HOME_KEYS.AVATAR)} (${t!(SETTING_KEYS.OPTIONAL)})`}
      >
        <div
          className={`dropdown ${
            avatarVisible ? 'dropdown-open' : 'dropdown-close'
          } w-full mb-4`}
        >
          <div
            role="button"
            onClick={(e) => {
              e.preventDefault();
              setAvatarVisible(true);
            }}
            className={`${InputClassName} flex items-center gap-2 b3-opacity-6`}
          >
            <ImageSvg
              name={avatar}
              className="w-8 h-8 opacity-70 !bg-transparent"
            ></ImageSvg>

            <input
              type="text"
              className="grow !bg-transparent"
              placeholder={t!(HOME_KEYS.AVATAR)}
              value={avatar}
              readOnly
            />
          </div>
          <GridAvatar
            setAvatar={setAvatar}
            setAvatarVisible={setAvatarVisible}
          ></GridAvatar>
        </div>
      </ItemLabel>

      {formView.map((item, index) => (
        <ItemLabel
          key={item.prop}
          label={`${t!(item.locale)} (${t!(SETTING_KEYS.OPTIONAL)})`}
        >
          <input
            type={item.type}
            placeholder={t!(HOME_KEYS.PLEASE_INPUT) + t!(item.locale)}
            {...register(item.prop, item.validation)}
            maxLength={item.validation?.maxLength as number}
            className={`mb-1 ${
              errors[item.prop] || errors.root?.[item.prop] ? '' : ''
            } ${InputClassName}`}
          />

          <div
            className={`
        ${index === formView.length - 1 ? 'mb-4' : ''}
        ${
          errors[item.prop] || errors.root?.[item.prop]
            ? 'opacity-1 h-auto'
            : 'opacity-0 h-0'
        } pl-2 transition-all duration-300 text-xs left-0 bottom-[0.5rem] text-error`}
          >
            {t!(
              errors[item.prop]?.message ||
                errors.root?.[item.prop]?.message ||
                ''
            )}
          </div>
        </ItemLabel>
      ))}

      <div className="pb-4 px-2 text-xs">
        <HiMiniInformationCircle className="text-accent-content w-4 h-4 inline-block" />{' '}
        每个邀请链接只能邀请一个用户，邀请成功之后无效
      </div>

      <div className="flex gap-4">
        <button
          className="flex-1 btn btn-outline mx-auto block disabled:bg-primary/50 disabled:text-neutral-400"
          disabled={loading}
          type="submit"
        >
          <span
            className={`loading loading-spinner ${
              loading ? 'opacity-1' : 'loading-hidden'
            }`}
          />
          分享
        </button>

        <button
          className="flex-1 btn btn-primary mx-auto block disabled:bg-primary/50 disabled:text-neutral-400"
          type="submit"
        >
          复制地址
        </button>
      </div>
    </form>
  );
};
