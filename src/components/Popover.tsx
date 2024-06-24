import React, { useState } from 'react';
import { usePopper } from 'react-popper';

interface PopoverProps {
  referenceElement: HTMLElement | null;
  visible: boolean;
  children: React.ReactNode;
}

const Popover: React.FC<PopoverProps> = ({
  referenceElement,
  visible,
  children,
}) => {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'auto',
  });

  if (!visible) return null;

  return (
    <div
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
      className="popover p-2"
    >
      <div>{children}</div>
    </div>
  );
};

export default Popover;
