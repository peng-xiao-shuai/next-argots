import { GenerateMetadata } from '@/app/(app)/[lng]/meta';
import { ClientFeedBack } from '../_components/ClientFeedBack';
export const generateMetadata = async (props: CustomReactParams) => {
  const { lng } = await props.params;
  return await GenerateMetadata(lng, '/setting/about/feedback');
};
export default ClientFeedBack;
