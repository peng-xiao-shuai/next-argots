import { GenerateMetadata } from '../meta';
import {
  Client,
  ClientContext,
  LinkUserInfo,
  setUserInfoType,
} from './_components/Client';
import { redirect } from 'next/navigation';
import type { JoinLinkType } from '@/app/api/join-link/route';
import { getBaseUrl } from '@/utils/server-utils';
import payloadPromise from '@/server/payload/get-payload';

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

  /**
   * 邀请进来后更改用户信息时调用
   */
  const setDBUserInfo: setUserInfoType = async (userInfo: LinkUserInfo) => {
    'use server';
    if (searchParams.link) {
      const payload = await payloadPromise;
      payload.update({
        collection: 'invite-link',
        id: searchParams.link,
        data: {
          userInfo: JSON.stringify(userInfo),
        },
      });
    }
  };

  if (searchParams.link) {
    response = await (
      await fetch(`${getBaseUrl()}/api/join-link?id=${searchParams.link}`)
    ).json();

    if (response.code !== '200') {
      redirect(`/${lng}?msg=${response.message}`);
    }

    return (
      <ClientContext
        joinData={response.data}
        lng={lng}
        setUserInfo={setDBUserInfo}
      >
        <Client></Client>
      </ClientContext>
    );
  }

  return (
    <ClientContext lng={lng}>
      <Client></Client>
    </ClientContext>
  );
}
