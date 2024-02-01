'use client';
import { useState, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Lng } from '@/locales/i18n';
export const Transition = ({
  children,
  className,
  language,
}: {
  children: React.ReactNode;
  className: string;
  language: Lng;
}) => {
  const [show, setShow] = useState(true);
  const pathname = usePathname();
  const [pageClassName, setPageClassName] = useState(
    pathname.match(/\/([\w-]+)$/)?.[1]
  );
  useLayoutEffect(() => {
    setShow(true);
    setPageClassName(pathname.match(/\/([\w-]+)$/)?.[1]);

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
        pageClassName == language ? 'home' : pageClassName
      }`}
    >
      {children}
    </div>
  );
};
