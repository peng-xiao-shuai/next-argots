'use client';
import { LocaleContext } from '@/context';
import { COMMON_KEYS, SETTING_KEYS } from '@/locales/keys';
import { useContext, useState } from 'react';

const issueType = [
  {
    value: 0,
    locale: SETTING_KEYS.ISSUE,
    emo: `😒`,
  },
  {
    value: 2,
    locale: SETTING_KEYS.OPINION,
    emo: `🤔`,
  },
  {
    value: 3,
    locale: SETTING_KEYS.I_WANT_TO,
    emo: `😍`,
  },
];

export default function About() {
  const { t } = useContext(LocaleContext);
  const [formData, setFormData] = useState({
    email: '',
    content: '',
    type: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // addFeedback({
    //   feedbackContent: formData.content,
    //   feedbackEmail: formData.email,
    //   feedbackType: formData.type,
    // }).then((res) => {
    //   console.log(res.data)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    // })
  };

  return (
    <>
      <div className="text-neutral-content mb-2 opacity-50 _p-x">
        {t(SETTING_KEYS.E_MAIL)}
      </div>
      <input
        v-model="formData.email"
        placeholder={t(SETTING_KEYS.E_MAIL)}
        className={`mb-4 input w-full transition-all duration-300 outline-none focus:outline-none focus:border-primary focus:shadow-sm focus:shadow-primary`}
      />

      <div className="text-neutral-content mb-2 opacity-50 _p-x">
        {t(SETTING_KEYS.CONTENT)}
      </div>

      <textarea
        value={formData.content}
        placeholder={t(SETTING_KEYS.CONTENT) + '...'}
        className="textarea resize-none h-56 mb-4 w-full transition-all duration-300 outline-none focus:outline-none focus:border-primary focus:shadow-sm focus:shadow-primary"
        onChange={({ target }) => {
          setFormData((state) => ({
            ...state,
            content: target.value,
          }));
        }}
      />

      <div className="text-neutral-content mb-2 opacity-50 _p-x">
        {t(SETTING_KEYS.FEEDBACK_TYPES)}
      </div>

      <div className="flex flex-wrap">
        {issueType.map((issue) => (
          <div
            key={issue.locale}
            className={`flex-1 flex mb-3 mx-1 rounded-full items-center justify-center bg-base-100 px-3 py-2 transition-all duration-300 ${
              formData.type === issue.value ? 'bg-primary-focus bg-primary' : ''
            }`}
            onClick={() => (formData.type = issue.value)}
          >
            <span className="text-xl inline-block mr-1">{issue.emo}</span>
            <span>{t(issue.locale)}</span>
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
            loading ? 'opacity-0' : 'loading-hidden'
          }`}
        />
        {t(COMMON_KEYS.CONFIRM)}
      </button>
    </>
  );
}