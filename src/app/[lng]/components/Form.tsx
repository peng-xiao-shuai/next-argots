'use client';
import React, { FC, Fragment, useContext, useEffect, useState } from 'react';
import { useForm, SubmitHandler, RegisterOptions } from 'react-hook-form';
import { z } from 'zod';
import CryptoJS from 'crypto-js';
import { HOME_KEYS } from '@@/locales/keys';
import { useTranslation } from '@/locales/client';
import { useRouter } from 'next/navigation';
import { useRoomStore } from '@/hooks/use-room-data';
import { fetchReq } from '@/utils/request';
import { stringToUnicode } from '@/utils/string-transform';
import { usePusher } from '@/hooks/use-pusher';

const formDataRules = z.object({
  nickName: z.string().min(1, HOME_KEYS.EMPTY_NICKNAME).max(24),
  roomName: z.string().min(1, HOME_KEYS.EMPTY_ROOM_NUMBER).max(24),
  password: z.string().min(1, HOME_KEYS.EMPTY_PASSWORD).max(24),
});

type FormData = z.infer<typeof formDataRules>;

type FormView = {
  type: React.HTMLInputTypeAttribute;
  locale: string;
  prop: 'roomName' | 'nickName' | 'password';
  validation: RegisterOptions<FormData>;
};

type HomeForm = FC<{
  roomStatus: 'ADD' | 'JOIN';
}>;
export const HomeForm: HomeForm = ({ roomStatus }) => {
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
    formState: { errors },
  } = useForm<FormData>();

  const { t } = useTranslation();
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
      const data = await fetchReq('/pusher/getChannel', {
        roomName: encryptData.roomName,
      });
      console.log(data);

      if (roomStatus === 'JOIN' && !data.isRoom) {
        setError('root.roomName', {
          type: 'custom',
          message: `${HOME_KEYS.HOME_API}.${HOME_KEYS.NO_ROOM_NAME}`,
        });
        throw new Error('');
      }

      if (roomStatus === 'ADD' && data.isRoom) {
        setError('root.roomName', {
          type: 'custom',
          message: `${HOME_KEYS.HOME_API}.${HOME_KEYS.ROOM_NAME}`,
        });

        throw new Error(data.message);
      }

      console.log('校验');
      setData(encryptData);

      signin()
        .then((res) => {
          router.push('/chat-room');
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

  useEffect(() => {
    setFocus('nickName');
  }, [setFocus, errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {formView.map((item, index) => (
        <div key={item.prop} className="w-full relative">
          <label className="inline-block text-accent-content mb-2 text-opacity-80 pl-2">
            {item.locale}
          </label>
          <input
            type={item.type}
            placeholder={t(HOME_KEYS.PLEASE_INPUT) + t(item.locale)}
            {...register(item.prop, item.validation)}
            className={`${
              index === formView.length - 1 ||
              errors[item.prop] ||
              errors.root?.[item.prop]
                ? 'mb-7'
                : 'mb-4'
            } input w-full transition-all duration-300 outline-none focus:outline-none focus:border-primary focus:shadow-sm focus:shadow-primary`}
          />

          <span
            className={`${
              errors[item.prop] || errors.root?.[item.prop]
                ? 'opacity-1'
                : 'opacity-0'
            } pl-2 transition-all duration-300 text-xs absolute left-0 bottom-[0.5rem] text-error`}
          >
            {t(
              errors[item.prop]?.message ||
                errors.root?.[item.prop]?.message ||
                ''
            )}
          </span>
        </div>
      ))}

      <button
        className="btn btn-primary btn-active mx-auto block w-2/3 disabled:bg-primary/50 disabled:text-neutral-400"
        disabled={loading}
        type="submit"
      >
        <span
          className={`loading loading-spinner ${
            loading ? 'opacity-0' : 'loading-hidden'
          }`}
        />
        {'Confirm'}
      </button>
    </form>
  );
};
