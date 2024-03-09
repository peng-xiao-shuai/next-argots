'use client';
import { useTranslation } from '@/locales/client';
import { trpc } from '&/trpc/client';
import { COMMON_KEYS, SETTING_KEYS } from '@@/locales/keys';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

type FormData = {
  email: string;
  content: string;
  type: '1' | '2' | '3';
};

const issueType: {
  emo: string;
  locale: string;
  value: FormData['type'];
}[] = [
  {
    value: '1',
    locale: SETTING_KEYS.ISSUE,
    emo: `😒`,
  },
  {
    value: '2',
    locale: SETTING_KEYS.OPINION,
    emo: `🤔`,
  },
  {
    value: '3',
    locale: SETTING_KEYS.I_WANT_TO,
    emo: `😍`,
  },
];

export function ClientFeedBack() {
  const { mutate } = trpc.feedbackAdd.useMutation({
    onSuccess: () => {
      toast.success('反馈成功！');
      setLoading(false);

      setFormData({
        ...formData,
        content: '',
      });
    },
    onError: (err, v, c) => {
      // toast.success('反馈成功！');
      console.log(err, v, c);

      setLoading(false);
    },
  });
  const [formData, setFormData] = useState<FormData>({
    email: '',
    content: '',
    type: '1',
  });

  const verifyEmail = z.string().email();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = () => {
    if (formData.email && !verifyEmail.safeParse(formData.email).success) {
      toast.error(t(SETTING_KEYS.E_MAIL_FORMAT_IS_INCORRECT));
      return;
    }
    setLoading(true);

    mutate(formData);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
    // })
  };

  return (
    <>
      <div className="mb-2 desc-color _p-x">
        {t(SETTING_KEYS.E_MAIL_OPTIONAL)}
      </div>
      <input
        value={formData.email}
        onChange={({ target }) => {
          setFormData((state) => ({
            ...state,
            email: target.value,
          }));
        }}
        // 需要提示如果不传递邮箱则无法获得反馈信息
        placeholder={t(SETTING_KEYS.PLEASE_E_MAIL)}
        className={`mb-4 input w-full transition-all duration-300 outline-none focus:outline-none focus:border-primary focus:shadow-sm focus:shadow-primary`}
      />

      <div className="mb-2 desc-color _p-x">{t(SETTING_KEYS.CONTENT)}</div>

      <textarea
        value={formData.content}
        placeholder={t(SETTING_KEYS.CONTENT) + '...'}
        maxLength={300}
        className="textarea resize-none h-56 mb-4 w-full transition-all duration-300 outline-none focus:outline-none focus:border-primary focus:shadow-sm focus:shadow-primary"
        onChange={({ target }) => {
          setFormData((state) => ({
            ...state,
            content: target.value,
          }));
        }}
      />

      <div className="mb-2 desc-color _p-x">
        {t(SETTING_KEYS.FEEDBACK_TYPES)}
      </div>

      <div className="flex flex-wrap">
        {issueType.map((issue) => (
          <div
            key={issue.locale}
            className={`flex-1 flex mb-3 mx-1 rounded-full items-center justify-center bg-base-100 px-3 py-2 transition-all duration-300 ${
              formData.type === issue.value ? 'bg-primary-focus bg-primary' : ''
            }`}
            onClick={() =>
              setFormData((state) => ({
                ...state,
                type: issue.value,
              }))
            }
          >
            <span className="text-xl inline-block mr-1">{issue.emo}</span>
            <span className="text-xs">{t(issue.locale)}</span>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary btn-active mt-6 w-full disabled:bg-primary/50 disabled:text-neutral-400"
        disabled={!formData.content || loading}
        onClick={handleSubmit}
      >
        <span
          className={`loading loading-spinner ${
            loading ? 'opacity-1' : 'loading-hidden'
          }`}
        />
        {t(COMMON_KEYS.CONFIRM)}
      </button>
    </>
  );
}
