'use client';
import { useBusWatch } from '@/hooks/use-bus-watch';
// import './style.scss';
import { useContext, useState } from 'react';
import { AppContext } from '@/context';
import { setDataTheme } from '@/utils/set-theme';
import { SETTING_KEYS } from '@@/locales/keys';
import { useTranslation } from 'react-i18next';
import { Dispatch, FC, SetStateAction } from 'react';
import { toast } from 'sonner';

const patternList = [
  {
    label: '深色模式',
    locale: SETTING_KEYS.DARK_MODE,
    value: 'dark',
  },
  {
    label: '浅色模式',
    locale: SETTING_KEYS.LIGHT_MODE,
    value: 'light',
  },
];

export const ClientThemeChange: FC = () => {
  const { t } = useTranslation();
  const setting = useContext(AppContext);
  const [isAuto, setIsAuto] = useState(setting.dataTheme === 'auto');
  const [pattern, setPattern] = useState(
    setting.dataTheme === 'auto' ? 'dark' : setting.dataTheme
  );
  const handleComplete = () => {
    const dataTheme = isAuto ? 'auto' : pattern;
    setDataTheme(dataTheme);

    window.localStorage.setItem(
      'settings',
      JSON.stringify({
        ...setting,
        dataTheme,
      })
    );

    // TODO i18n
    toast.success('successfully set');
  };

  useBusWatch('complete', handleComplete);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <div>{t(SETTING_KEYS.MODE_AUTO)}</div>
          <span className="text-xs opacity-50">
            {t(SETTING_KEYS.MODE_SWITCH)}
          </span>
        </div>

        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={isAuto}
          onChange={({ target }) => {
            setIsAuto(target.checked);
          }}
        />
      </div>

      {!isAuto ? (
        <>
          <div className="_p opacity-50 text-left text-sm">
            {t(SETTING_KEYS.CHOOSE_MANUALLY)}
          </div>

          <div className="bg-base-300 rounded-lg">
            {patternList.map((item) => (
              <label
                key={item.label}
                className="last-of-type:border-t border-primary-content border-opacity-10 label px-4 h-14 flex items-center justify-between"
              >
                <span className="label-text">{t(item.locale)}</span>
                <input
                  v-model="pattern"
                  type="radio"
                  name="radio"
                  className="radio checked:bg-primary"
                  defaultChecked={pattern === item.value}
                  value={item.value}
                  onChange={({ target }) =>
                    setPattern(
                      target.value as Exclude<typeof setting.dataTheme, 'auto'>
                    )
                  }
                />
              </label>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
