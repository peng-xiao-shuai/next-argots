'use client';
import { useBusWatch } from '@/hooks/use-bus-watch';
import './style.scss';
import { useContext, useState } from 'react';
import { AppContext } from '@/app/components';
import { setDataTheme } from '@/utils/set-theme';

const patternList = [
  {
    label: '深色模式',
    locale: 'Dark.Mode',
    value: 'dark',
  },
  {
    label: '浅色模式',
    locale: 'Light.Mode',
    value: 'light',
  },
];
export default function ThemeChange() {
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
  };

  useBusWatch('complete', handleComplete);

  return (
    <>
      {/* <!-- TODO 白天黑夜模式 --> */}
      {/* <!-- style(setting): 深色模式UI更改且注释入口 --> */}
      <div className="theme-change">
        <div className="flex justify-between items-center">
          <div>
            <div>{'mode.auto'}</div>
            <span className="text-xs opacity-50">{'mode.switch'}</span>
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
              {'Choose.manually'}
            </div>

            <div className="pattern-list bg-neutral-content rounded-lg">
              {patternList.map((item) => (
                <label
                  key={item.label}
                  className="pattern-list__item label px-4 h-14 flex items-center justify-between"
                >
                  <span className="label-text">{item.locale}</span>
                  <input
                    v-model="pattern"
                    type="radio"
                    name="radio"
                    className="radio checked:bg-primary"
                    defaultChecked={pattern === item.value}
                    value={item.value}
                    onChange={({ target }) =>
                      setPattern(
                        target.value as Exclude<
                          typeof setting.dataTheme,
                          'auto'
                        >
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
      </div>
    </>
  );
}
