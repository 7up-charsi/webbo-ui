'use client';

import { createContextScope } from '@webbo-ui/context';
import { useControllableState } from '@webbo-ui/use-controllable-state';
import { Slot } from '@webbo-ui/slot';
import { forwardRef, useId, useMemo } from 'react';
import { usePointerEvents } from '@webbo-ui/use-pointer-events';
import { disclosure } from '@webbo-ui/theme';

// *-*-*-*-* Root *-*-*-*-*

const ROOT_NAME = 'Accordion.Root';

interface RootContext {
  onExpand: (value: string) => void;
  onCollapse: (value: string) => void;
  disabled?: boolean;
  value: string[];
}

const [RootProvider, useRootContext] =
  createContextScope<RootContext>(ROOT_NAME);

const [StylesProvider, useStylesContext] =
  createContextScope<ReturnType<typeof disclosure>>(ROOT_NAME);

export interface RootProps {
  children?: React.ReactNode;
  disabled?: boolean;
  asChild?: boolean;
  className?: string;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  isSingleCollapsible?: undefined;
}

export const Root = (props: RootProps) => {
  const {
    children,
    value: valueProp,
    onValueChange,
    defaultValue,
    disabled,
    asChild,
    className,
  } = props;

  const [value, setValue] = useControllableState({
    defaultValue: defaultValue ?? [],
    value: valueProp,
    onChange: onValueChange,
  });

  const onExpand = (value: string) => {
    if (disabled) return;

    setValue((prev) => [...prev, value]);
  };

  const onCollapse = (value: string) => {
    if (disabled) return;

    setValue((prev) => prev.filter((ele) => ele !== value));
  };

  const styles = useMemo(() => disclosure(), []);

  const Component = asChild ? Slot : 'div';

  return (
    <RootProvider
      onCollapse={onCollapse}
      onExpand={onExpand}
      disabled={disabled}
      value={value}
    >
      <StylesProvider {...styles}>
        <Component className={styles.base({ className })}>{children}</Component>
      </StylesProvider>
    </RootProvider>
  );
};

Root.displayName = 'webbo-ui.' + ROOT_NAME;

// *-*-*-*-* Item *-*-*-*-*

const ITEM_NAME = 'Accordion.Item';

interface ItemContext {
  value: string;
  triggerId: string;
  contentId: string;
  isExpended: boolean;
  disabled?: boolean;
}

const [ItemProvider, useItemContext] =
  createContextScope<ItemContext>(ITEM_NAME);

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const Item = forwardRef<HTMLDivElement, ItemProps>((props, ref) => {
  const { value, className, disabled, ...restProps } = props;

  const rootContext = useRootContext(TRIGGER_NAME);

  const triggerId = useId();
  const contentId = useId();

  const styles = useStylesContext(ITEM_NAME);

  const isExpended = !!rootContext.value.find((ele) => ele === value);

  return (
    <ItemProvider
      value={value}
      triggerId={triggerId}
      contentId={contentId}
      isExpended={isExpended}
      disabled={disabled}
    >
      <div
        {...restProps}
        ref={ref}
        className={styles.item({ className })}
        data-state={isExpended ? 'expanded' : 'collapsed'}
      />
    </ItemProvider>
  );
});

Item.displayName = 'webbo-ui.' + ITEM_NAME;

// *-*-*-*-* Trigger *-*-*-*-*

const TRIGGER_NAME = 'Accordion.Trigger';

export interface TriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
  (props, ref) => {
    const { className, onPointerDown, onPointerUp, ...restProps } = props;

    const rootContext = useRootContext(TRIGGER_NAME);
    const itemContext = useItemContext(TRIGGER_NAME);

    const isExpended = itemContext.isExpended;

    const onPress = () => {
      if (isExpended) rootContext.onCollapse(itemContext.value);
      else rootContext.onExpand(itemContext.value);
    };

    const poitnerEvents = usePointerEvents({
      onPress,
      onPointerDown,
      onPointerUp,
    });

    const styles = useStylesContext(TRIGGER_NAME);

    const onKeyDown = (e: React.KeyboardEvent) => {
      const key = e.key;

      if (key === 'Tab' || (key === 'Tab' && e.shiftKey)) return;

      if ([' ', 'Enter'].includes(key)) {
        onPress();

        return;
      }
    };

    return (
      <Slot
        {...restProps}
        ref={ref}
        onKeyDown={onKeyDown}
        className={styles.trigger({ className })}
        disabled={itemContext.disabled ?? rootContext.disabled}
        id={itemContext.triggerId}
        aria-expanded={isExpended}
        aria-controls={itemContext.contentId}
        {...poitnerEvents}
      />
    );
  },
);

Trigger.displayName = 'webbo-ui.' + TRIGGER_NAME;

// *-*-*-*-* Content *-*-*-*-*

const CONTENT_NAME = 'Accordion.Content';

export interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  (props, ref) => {
    const { className, ...restProps } = props;

    const itemContext = useItemContext(CONTENT_NAME);

    const styles = useStylesContext(CONTENT_NAME);

    return (
      <div
        {...restProps}
        ref={ref}
        data-state={itemContext.isExpended ? 'expanded' : 'collapsed'}
        id={itemContext.contentId}
        hidden={!itemContext.isExpended}
        className={styles.content({ className })}
      />
    );
  },
);

Content.displayName = 'webbo-ui.' + CONTENT_NAME;
