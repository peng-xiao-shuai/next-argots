import { GenerateMetadata } from '../meta';
import { Client, ClientContext } from './_components/Client';
import { redirect } from 'next/navigation';
import type { JoinLinkType } from '@/app/api/join-link/route';
import { getBaseUrl } from '@/utils/server-utils';
import payloadPromise from '@/server/payload/get-payload';
import { parse } from 'node-html-parser';
import type { SetUserInfoType } from '@/context';

export const generateMetadata = async (props: CustomReactParams) => {
  const { lng } = await props.params;
  return await GenerateMetadata(lng, '/chat-room');
};

interface Props extends CustomReactParams {
  searchParams: Promise<{
    link?: string;
  }>;
}

/**
 * @remarks 获取网址预览
 */
const getLinkPreview = async (url: string) => {
  'use server';
  const regex =
    /\b(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+)(?:\.[a-zA-Z]{2,})(?:[\/\s?#]|$)/g;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      },
      next: { revalidate: 3600 },
    });
    const html = await response.text();
    const root = parse(html);
    const getMetaContent = (selector: string) =>
      root.querySelector(selector)?.getAttribute('content') ?? null;

    return {
      title: root.querySelector('title')?.text ?? null,
      description: getMetaContent('meta[name="description"]'),
      keywords: getMetaContent('meta[name="keywords"]'),
      ogTitle: getMetaContent('meta[property="og:title"]'),
      ogDescription: getMetaContent('meta[property="og:description"]'),
      ogImage: getMetaContent('meta[property="og:image"]'),
      ogSiteName:
        getMetaContent('meta[property="og:site_name"]') ??
        regex.exec(url)?.[1] ??
        null,
      twitterCard: getMetaContent('meta[name="twitter:card"]'),
      twitterSite: getMetaContent('meta[name="twitter:site"]'),
      canonicalUrl:
        root.querySelector('link[rel="canonical"]')?.getAttribute('href') ??
        null,
    };
  } catch (error) {
    console.error('Error scraping meta:', error);
    return null;
  }
};

export default async function ChatRoom(props: Props) {
  const searchParams = await props.searchParams;
  const { lng } = await props.params;

  let response: JoinLinkType;

  /**
   * 邀请进来后更改用户信息时调用
   */
  const setDBUserInfo: SetUserInfoType = async (userInfo) => {
    'use server';
    const payload = await payloadPromise;
    return payload.update({
      collection: 'invite-link',
      id: searchParams.link!,
      data: {
        userInfo: JSON.stringify(userInfo),
      },
    });
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
        serveActive={{
          getLinkPreview: getLinkPreview,
          setUserInfo: setDBUserInfo,
        }}
      >
        <Client></Client>
      </ClientContext>
    );
  }

  return (
    <ClientContext
      lng={lng}
      serveActive={{
        getLinkPreview: getLinkPreview,
      }}
    >
      <Client></Client>
    </ClientContext>
  );
}
