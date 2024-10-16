/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { Metadata } from 'next';

import config from '@payload-config';
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import { importMap } from '../importMap';
type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = ({params, searchParams}: Args): Promise<Metadata> => {
  // @ts-ignore
  return generatePageMetadata({ config, params, searchParams });
};

const Page = ({params, searchParams}: Args) => {
  // @ts-ignore
  return RootPage({ config, params, importMap, searchParams });
};

export default Page;
