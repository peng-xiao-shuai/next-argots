'use client';
import { useState, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
export const Transition = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => {
  const [show, setShow] = useState(true);
  const pathname = usePathname();
  useLayoutEffect(() => {
    setShow(true);

    const time = setTimeout(() => {
      setShow(false);
    }, 400);

    return () => {
      clearTimeout(time);
    };
  }, [pathname]);

  return (
    <div
      className={`w-full h-full${show ? ' fade-in' : ''} ${className} ${
        pathname.match(/\/([\w-]+)$/)?.[1]
      }`}
    >
      {children}
    </div>
  );
};
