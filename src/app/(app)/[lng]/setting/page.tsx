import { GenerateMetadata } from '../meta';
import { ClientMenu } from './_components/Client';

export const generateMetadata = async (props: CustomReactParams) => {
  const { lng } = await props.params;
  return await GenerateMetadata(lng, '/setting');
};

export default function Setting() {
  return (
    <ul className="menu rounded-lg overflow-hidden">
      <ClientMenu></ClientMenu>
    </ul>
  );
}
