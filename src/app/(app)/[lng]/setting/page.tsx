import { GenerateMetadata } from '../meta';
import { ClientMenu } from './_components/Client';

export const generateMetadata = async ({
  params: { lng },
}: CustomReactParams) => await GenerateMetadata(lng, '/setting');

export default function Setting() {
  return (
    <ul className="menu rounded-lg overflow-hidden">
      <ClientMenu></ClientMenu>
    </ul>
  );
}
