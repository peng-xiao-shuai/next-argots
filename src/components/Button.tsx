import { debounce } from '@/utils/debounce-throttle';
import { ButtonHTMLAttributes, FC, memo, useMemo } from 'react';

export const Button: FC<{
  title?: string;
  children?: React.ReactNode;
  click?: () => void;
  loading?: boolean;
  className?: string;
  attrs?: ButtonHTMLAttributes<HTMLButtonElement>;
}> = memo(({ title, children, click, className = '', attrs, loading }) => {
  const _loading = useMemo(() => {
    return typeof loading === 'undefined' ? attrs?.disabled : loading;
  }, [loading, attrs?.disabled]);
  return (
    <button
      className={`flex-1 w-2/3 btn flex-nowrap btn-primary mx-auto block disabled:bg-primary/50 disabled:text-neutral-400 ${className} ${
        !_loading ? 'gap-0' : ''
      }`}
      onClick={() => {
        if (click) {
          debounce(click);
        }
      }}
      {...(attrs || {})}
    >
      {!Boolean(children) && (
        <span
          className={`loading loading-spinner ${
            _loading ? 'opacity-1' : 'loading-hidden'
          }`}
        />
      )}
      {children || (
        <span className="max-w-[calc(100%-theme(height.8))]">{title}</span>
      )}
    </button>
  );
});
Button.displayName = 'Button';
