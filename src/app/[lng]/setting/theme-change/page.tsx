import { GenerateMetadata } from '../../meta';
import { ClientThemeChange } from '../_components/ClientThemeChange';

export const generateMetadata = async ({
  params: { lng },
}: CustomReactParams) => await GenerateMetadata(lng, '/setting/theme-change');

export default ClientThemeChange;
