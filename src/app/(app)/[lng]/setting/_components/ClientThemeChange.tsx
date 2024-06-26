'use client';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { useContext, useState } from 'react';
import { AppContext } from '@/context';
import { setDataTheme } from '@/utils/set-app';
import { COMMON_KEYS, SETTING_KEYS } from '@@/locales/keys';
import { FC } from 'react';
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
  const { t, dataTheme } = useContext(AppContext);
  const [isAuto, setIsAuto] = useState(dataTheme === 'auto');
  const [pattern, setPattern] = useState(
    dataTheme === 'auto' ? 'dark' : dataTheme
  );
  const handleComplete = () => {
    const dataTheme = isAuto ? 'auto' : pattern;
    setDataTheme(dataTheme);
    toast.success(t(COMMON_KEYS.SUCCESSFULLY_SET));
  };

  useBusWatch('complete', handleComplete);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <div className="text-base-content">{t(SETTING_KEYS.MODE_AUTO)}</div>
          <span className="text-xs desc-color">
            {t(SETTING_KEYS.MODE_SWITCH)}
          </span>
        </div>

        <input
          type="checkbox"
          className="toggle !toggle-primary"
          checked={isAuto}
          onChange={({ target }) => {
            setIsAuto(target.checked);
          }}
        />
      </div>

      {!isAuto ? (
        <>
          <div className="_p desc-color text-left text-sm">
            {t(SETTING_KEYS.CHOOSE_MANUALLY)}
          </div>

          <ul className="menu">
            {patternList.map((item) => (
              <li
                className="row-active no-active w-full !h-14"
                key={item.label}
              >
                <label className="w-full label p-0 h-full flex items-center justify-between">
                  <span className="label-text">{t(item.locale)}</span>
                  <input
                    v-model="pattern"
                    type="radio"
                    name="radio"
                    className="radio checked:!bg-primary"
                    defaultChecked={pattern === item.value}
                    value={item.value}
                    onChange={({ target }) =>
                      setPattern(
                        target.value as Exclude<typeof dataTheme, 'auto'>
                      )
                    }
                  />
                </label>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
