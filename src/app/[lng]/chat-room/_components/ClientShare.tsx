'use client';
import { Dialog, ShareForm } from '@/components';
import { usePusher } from '@/hooks/use-pusher';
import { useState } from 'react';

export const ClientShare = () => {
  const [visible, setVisible] = useState(false);
  const { getChannelUser } = usePusher();

  return (
    <>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => {
          setVisible(true);
        }}
      >
        Share
      </button>

      <Dialog visible={visible} setVisible={setVisible}>
        <div className="flex flex-wrap justify-center">
          {visible && <ShareForm getChannelUser={getChannelUser}></ShareForm>}
        </div>
      </Dialog>
    </>
  );
};
