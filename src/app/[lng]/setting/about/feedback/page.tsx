import { GenerateMetadata } from '@/app/[lng]/meta';
import { ClientFeedBack } from '../_components/ClientFeedBack';
export const generateMetadata = async ({
  params: { lng },
}: CustomReactParams) => await GenerateMetadata(lng, '/setting/about/feedback');

export default ClientFeedBack;
