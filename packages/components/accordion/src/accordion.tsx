import { createContextScope } from '@webbo-ui/context';
import { useControllableState } from '@webbo-ui/use-controllable-state';
import { Icon } from '@webbo-ui/icon';
import React, { forwardRef, useId, useMemo } from 'react';
import { createCollection } from '@webbo-ui/use-collection';
import { CustomError } from '@webbo-ui/error';
import { Slot } from '@webbo-ui/slot';
import { accordion } from '@webbo-ui/theme';

// *-*-*-*-* Root *-*-*-*-*

const ROOT_NAME = 'Accordion.Root';

interface RootContext {
  onExpand: (value: string) => void;
  onCollapse: (value: string) => void;
  disabled?: boolean;
  value: string | string[] | null;
  type: 'multiple' | 'single';
}

const [RootProvider, useRootContext] =
  createContextScope<RootContext>(ROOT_NAME);

const [StylesProvider, useStylesContext] =
  createContextScope<ReturnType<typeof accordion>>(ROOT_NAME);

const [Collection, useCollection] = createCollection<HTMLButtonElement, object>(
  ROOT_NAME,
);

export type RootProps<Type, IsSingleCollapsible> = {
  disabled?: boolean;
} & React.HTMLAttributes<HTMLDivElement> &
  (Type extends 'multiple'
    ? {
        type?: Type;
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
        isSingleCollapsible?: undefined;
      }
    : IsSingleCollapsible extends true
      ? {
          type: Type;
          value?: string | null;
          defaultValue?: string | null;
          onValueChange?: (value: string | null) => void;
          isSingleCollapsible?: IsSingleCollapsible;
        }
      : {
          type: Type;
          value?: string;
          defaultValue?: string;
          onValueChange?: (value: string) => void;
          isSingleCollapsible: IsSingleCollapsible;
        });

const RootImpl = forwardRef<
  HTMLDivElement,
  RootProps<'multiple' | 'single', true>
>((props, ref) => {
  const {
    value: valueProp,
    onValueChange,
    defaultValue,
    disabled,
    className,
    isSingleCollapsible = true,
    type = 'multiple',
    ...restProps
  } = props;

  const [value, setValue] = useControllableState({
    defaultValue: type === 'multiple' ? defaultValue ?? [] : defaultValue,
    value: valueProp,
    onChange: (val) => {
      onValueChange?.(val as never);
    },
  });

  const onExpand = (value: string) => {
    if (disabled) return;

    if (type === 'single') {
      setValue(value);
      return;
    }

    if (type === 'multiple') {
      setValue((prev) => (Array.isArray(prev) ? [...prev, value] : []));
      return;
    }
  };

  const onCollapse = (value: string) => {
    if (disabled) return;

    if (type === 'single' && isSingleCollapsible) {
      setValue(null);
    }

    if (type === 'multiple') {
      setValue((prev) =>
        Array.isArray(prev) ? prev.filter((ele) => ele !== value) : [],
      );
    }
  };

  const styles = useMemo(() => accordion(), []);

  if (
    valueProp &&
    type === 'single' &&
    !isSingleCollapsible &&
    Array.isArray(value)
  )
    throw new CustomError(
      ROOT_NAME,
      '`value` must be `string` when type is single and isSingleCollapsible is false',
    );

  if (
    valueProp &&
    type === 'single' &&
    isSingleCollapsible &&
    Array.isArray(value)
  )
    throw new CustomError(
      ROOT_NAME,
      '`value` must be `string | null` when type is single and isSingleCollapsible is true',
    );

  if (valueProp && type === 'multiple' && !Array.isArray(value))
    throw new CustomError(
      ROOT_NAME,
      '`value` must be `array` when type is multiple',
    );

  return (
    <RootProvider
      type={type}
      onCollapse={onCollapse}
      onExpand={onExpand}
      disabled={disabled}
      value={value}
    >
      <StylesProvider {...styles}>
        <Collection.Provider>
          <Collection.Parent>
            <div
              {...restProps}
              ref={ref}
              className={styles.base({ className })}
            />
          </Collection.Parent>
        </Collection.Provider>
      </StylesProvider>
    </RootProvider>
  );
});

RootImpl.displayName = 'webbo-ui.' + ROOT_NAME;

export const Root = RootImpl as unknown as <
  Type extends 'single' | 'multiple' = 'multiple',
  IsSingleCollapsible extends boolean = true,
>(
  props: RootProps<Type, IsSingleCollapsible> &
    React.RefAttributes<HTMLDivElement>,
) => React.ReactNode;

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

  const isExpended =
    rootContext.type === 'multiple'
      ? Array.isArray(rootContext.value) &&
        !!rootContext.value.find((ele) => ele === value)
      : rootContext.value === value;

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
        data-expanded={isExpended}
      />
    </ItemProvider>
  );
});

Item.displayName = 'webbo-ui.' + ITEM_NAME;

// *-*-*-*-* Header *-*-*-*-*

const Header_NAME = 'Accordion.Header';

export interface HeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

export const Header = forwardRef<HTMLHeadingElement, HeaderProps>(
  (props, ref) => {
    const { asChild, className, ...restProps } = props;

    const itemContext = useItemContext(TRIGGER_NAME);

    const styles = useStylesContext(Header_NAME);

    const Comp = asChild ? Slot : 'h3';

    return (
      <Comp
        {...restProps}
        ref={ref}
        className={styles.header({ className })}
        data-expanded={itemContext.isExpended}
      />
    );
  },
);

Header.displayName = 'webbo-ui.' + Header_NAME;

// *-*-*-*-* Trigger *-*-*-*-*

const TRIGGER_NAME = 'Accordion.Trigger';

export interface TriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
  (props, ref) => {
    const { asChild, className, children, disabled, ...restProps } = props;

    const rootContext = useRootContext(TRIGGER_NAME);
    const itemContext = useItemContext(TRIGGER_NAME);

    const isExpended = itemContext.isExpended;

    const styles = useStylesContext(TRIGGER_NAME);

    const getItems = useCollection();

    const onPress = () => {
      if (isExpended) rootContext.onCollapse(itemContext.value);
      else rootContext.onExpand(itemContext.value);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (rootContext.disabled) return;

      const key = e.key;

      if (key === 'Tab' || (key === 'Tab' && e.shiftKey)) return;

      if ([' ', 'Enter'].includes(key)) {
        onPress();

        return;
      }

      const ArrowDown = key === 'ArrowDown';
      const ArrowUp = key === 'ArrowUp';
      const Home = key === 'Home';
      const End = key === 'End';

      const activeItems = getItems().filter(
        (ele) => !ele.ref.current?.disabled,
      );
      const elements = activeItems.map((ele) => ele.ref.current);

      const currentIndex = elements.findIndex((ele) => ele === e.currentTarget);

      const next = elements[Math.min(currentIndex + 1, elements.length - 1)];

      const prev = elements[Math.max(currentIndex - 1, 0)];

      if (ArrowDown) next?.focus();
      if (ArrowUp) prev?.focus();
      if (Home) elements[0]?.focus();
      if (End) elements[elements.length - 1]?.focus();
    };

    const Comp = asChild ? Slot : 'button';

    return (
      <Collection.Item>
        <Comp
          {...restProps}
          ref={ref}
          onKeyDown={onKeyDown}
          className={styles.trigger({ className })}
          disabled={rootContext.disabled ?? disabled ?? itemContext.disabled}
          id={itemContext.triggerId}
          aria-expanded={isExpended}
          aria-controls={itemContext.contentId}
          data-expanded={isExpended}
          onPress={onPress}
        >
          {children}
        </Comp>
      </Collection.Item>
    );
  },
);

Trigger.displayName = 'webbo-ui.' + TRIGGER_NAME;

// *-*-*-*-* Arrow *-*-*-*-*

const Arrow_NAME = 'Accordion.Arrow';

export interface ArrowProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'children'> {}

export const Arrow = forwardRef<SVGSVGElement, ArrowProps>((props, ref) => {
  const { className, ...restProps } = props;

  const styles = useStylesContext(Arrow_NAME);

  return (
    <Icon {...restProps} ref={ref} className={styles.arrow({ className })}>
      <svg fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 9l6 6 6-6"
        ></path>
      </svg>
    </Icon>
  );
});

Arrow.displayName = 'webbo-ui.' + Arrow_NAME;

// *-*-*-*-* Content *-*-*-*-*

const CONTENT_NAME = 'Accordion.Content';

export interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  (props, ref) => {
    const { className, ...restProps } = props;

    const itemContext = useItemContext(CONTENT_NAME);

    const styles = useStylesContext(CONTENT_NAME);

    return !itemContext.isExpended ? null : (
      <div
        {...restProps}
        ref={ref}
        id={itemContext.contentId}
        className={styles.content({ className })}
      />
    );
  },
);

Content.displayName = 'webbo-ui.' + CONTENT_NAME;
