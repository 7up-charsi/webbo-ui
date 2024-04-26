import { createContextScope } from '@webbo-ui/context';
import { useControllableState } from '@webbo-ui/use-controllable-state';
import React from 'react';
import { createCollection } from '@webbo-ui/use-collection';
import { CustomError } from '@webbo-ui/error';
import { accordion } from '@webbo-ui/theme';

export type AccordionRootProps<Type, IsSingleCollapsible> = {
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

interface RootContext {
  onExpand: (value: string) => void;
  onCollapse: (value: string) => void;
  disabled?: boolean;
  value: string | string[] | null;
  type: 'multiple' | 'single';
}

const Comp_Name = 'AccordionRoot';

const [RootProvider, useRootContext] =
  createContextScope<RootContext>(Comp_Name);

const [StylesProvider, useStylesContext] =
  createContextScope<ReturnType<typeof accordion>>(Comp_Name);

export { useRootContext, useStylesContext };

export const [Collection, useCollection] = createCollection<
  HTMLButtonElement,
  object
>(Comp_Name);

export const AccordionRootImpl = React.forwardRef<
  HTMLDivElement,
  AccordionRootProps<'multiple' | 'single', true>
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

  const styles = React.useMemo(() => accordion(), []);

  if (
    valueProp &&
    type === 'single' &&
    !isSingleCollapsible &&
    Array.isArray(value)
  )
    throw new CustomError(
      Comp_Name,
      '`value` must be `string` when type is single and isSingleCollapsible is false',
    );

  if (
    valueProp &&
    type === 'single' &&
    isSingleCollapsible &&
    Array.isArray(value)
  )
    throw new CustomError(
      Comp_Name,
      '`value` must be `string | null` when type is single and isSingleCollapsible is true',
    );

  if (valueProp && type === 'multiple' && !Array.isArray(value))
    throw new CustomError(
      Comp_Name,
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

AccordionRootImpl.displayName = 'AccordionRoot';

export const AccordionRoot = AccordionRootImpl as unknown as <
  Type extends 'single' | 'multiple' = 'multiple',
  IsSingleCollapsible extends boolean = true,
>(
  props: AccordionRootProps<Type, IsSingleCollapsible> &
    React.RefAttributes<HTMLDivElement>,
) => React.ReactNode;
