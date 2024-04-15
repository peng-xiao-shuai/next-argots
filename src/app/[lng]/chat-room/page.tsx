import { GenerateMetadata } from '../meta';
import { Client } from './_components/Client';
import { redirect } from 'next/navigation';
import { JoinLinkType } from '@/app/api/join-link/route';

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
  let data: JoinLinkType;
  if (searchParams.link) {
    data = await (
      await fetch(`http://localhost:3000/api/join-link?id=${searchParams.link}`)
    ).json();

    if (data.code !== '200') {
      redirect(`/${lng}?msg=${data.message}`);
    }

    return <Client lng={lng}></Client>;
  }
}
