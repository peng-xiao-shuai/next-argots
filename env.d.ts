declare interface Window {
  my_modal_2: {
    showModal: () => void;
  };
}

declare type Indexes<T = any> = { [s: string | number]: T };

declare interface CustomReactParams {
  params: Promise<{
    lng: import('@/locales/i18n').Lng;
  }>;
}

declare interface CustomReactLayout extends CustomReactParams {
  children: React.ReactNode;
}
