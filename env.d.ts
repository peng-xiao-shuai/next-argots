declare interface Window {
  my_modal_2: {
    showModal: () => void;
  };
}

declare type Indexes<T = any> = { [s: string | number]: T };
