'use client';

import { useEffect, useRef } from 'react';
import { usePointerEvents } from '@webbo-ui/use-pointer-events';

export interface OptionProps<V> {
  option: V;
  label: string;
  state: { selected: boolean; disabled: boolean; focused: boolean };
  onSelect: () => void;
  onHover: () => void;
  props: React.LiHTMLAttributes<HTMLLIElement> & {
    'data-disabled': boolean;
    'data-selected': boolean;
    'data-focused': boolean;
  };
  key: string;
}

export const Option = (
  _props: OptionProps<object> & { children?: React.ReactNode },
) => {
  const {
    label,
    props,
    onSelect,
    onHover,
    state: { disabled, focused, selected },
    children,
  } = _props;

  const ref = useRef<HTMLLIElement>(null);
  const isHovered = useRef(false);

  const pointerEvents = usePointerEvents({
    onPointerDown: (e) => e.preventDefault(),
    onPress: () => {
      if (disabled) return;
      onSelect();
    },
  });

  useEffect(() => {
    if (selected)
      ref.current?.scrollIntoView({ behavior: 'instant', block: 'center' });
  }, [selected]);

  useEffect(() => {
    if (focused && !isHovered.current)
      ref.current?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
  }, [focused]);

  return (
    <li
      ref={ref}
      onPointerEnter={() => {
        isHovered.current = true;
        onHover();
      }}
      onPointerLeave={() => {
        isHovered.current = false;
      }}
      {...pointerEvents}
      {...props}
    >
      {children ?? label}
    </li>
  );
};

Option.displayName = 'webbo-ui.Option';
