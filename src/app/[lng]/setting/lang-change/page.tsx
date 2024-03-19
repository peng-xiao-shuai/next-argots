import { ClientLang, LangType } from '../_components/ClientLangChange';
import { GenerateMetadata } from '../../meta';

const langs: LangType[] = [
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
    desc: 'machine translation',
  },
  {
    label: '日本語',
    value: 'ja-JP',
    desc: 'じどうほんやく',
  },
];

export const generateMetadata = async ({
  params: { lng },
}: CustomReactParams) => await GenerateMetadata(lng, '/setting/lang-change');

export default function LangChange({ params: { lng } }: CustomReactParams) {
  return (
    <ul className="menu">
      <ClientLang langs={langs} lng={lng}></ClientLang>
    </ul>
  );
}
