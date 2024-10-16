import { GenerateMetadata } from '../../meta';
import { ClientThemeChange } from '../_components/ClientThemeChange';

export const generateMetadata = async (props: CustomReactParams) => {
  const { lng } = await props.params;
  return await GenerateMetadata(lng, '/setting/theme-change');
};

export default ClientThemeChange;
