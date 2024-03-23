import { GenerateMetadata } from '../meta';
import { ClientChat } from './_components/Client';

export const generateMetadata = async ({
  params: { lng },
}: CustomReactParams) => await GenerateMetadata(lng, '/chat-room');

export default ClientChat;
