'use client';
import { useState, useEffect, PropsWithChildren, useRef } from 'react';
import { usePathname } from 'next/navigation';
export const Transition = ({ children }: PropsWithChildren) => {
  const [show, setShow] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setShow(true);

    const time = setTimeout(() => {
      setShow(false);
    }, 400);

    return () => {
      clearTimeout(time);
    };
  }, [pathname]);

  return (
    <>
      <div className={`w-full h-full ${show ? 'fade-in' : ''}`}>{children}</div>
    </>
  );
};
