import { Lng } from '@/locales/i18n';
import { ClientLang } from '../_components/ClientLangChange';
import { GenerateMetadata } from '../../meta';

const langs: { label: string; value: Lng }[] = [
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: '繁體中文',
    value: 'zh-TW',
  },
  {
    label: 'English',
    value: 'en-US',
  },
  {
    label: '日本語',
    value: 'ja-JP',
  },
];

export const generateMetadata = async ({
  params: { lng },
}: CustomReactParams) => await GenerateMetadata(lng, '/setting/lang-change');

export default function LangChange({ params: { lng } }: CustomReactParams) {
  return (
    <div className="lang-list bg-base-300 rounded-lg">
      {langs.map((item) => (
        <ClientLang key={item.label} item={item} lng={lng}></ClientLang>
      ))}
    </div>
  );
}
