import { GenerateMetadata } from '../meta';
import { Client, ClientContext } from './_components/Client';
import { redirect } from 'next/navigation';
import type { JoinLinkType } from '@/app/api/join-link/route';
import { getBaseUrl } from '@/utils/server-utils';

export const generateMetadata = async ({
  params: { lng },
}: CustomReactParams) => await GenerateMetadata(lng, '/chat-room');

interface Props extends CustomReactParams {
  searchParams: {
    link?: string;
  };
}

export default async function ChatRoom({
  params: { lng },
  searchParams,
}: Props) {
  let response: JoinLinkType;
  if (searchParams.link) {
    response = await (
      await fetch(`${getBaseUrl()}/api/join-link?id=${searchParams.link}`)
    ).json();

    if (response.code !== '200') {
      redirect(`/${lng}?msg=${response.message}`);
    }
    return (
      <ClientContext joinData={response.data} lng={lng}>
        <Client></Client>;
      </ClientContext>
    );
  }

  return (
    <ClientContext lng={lng}>
      <Client></Client>
    </ClientContext>
  );
}
