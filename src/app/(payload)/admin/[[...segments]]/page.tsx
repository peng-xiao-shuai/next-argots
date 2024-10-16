/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { Metadata } from 'next';

import config from '@payload-config';
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import { importMap } from '../importMap';
type Args = {
  params: {
    segments: string[];
  };
  searchParams: {
    [key: string]: string | string[];
  };
};

export const generateMetadata = async (props: Args): Promise<Metadata> => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  return generatePageMetadata({ config, params, searchParams });
};

const Page = async (props: Args) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  return RootPage({ config, params, importMap, searchParams });
};

export default Page;
