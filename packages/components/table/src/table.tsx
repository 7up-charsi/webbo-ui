'use client';

import { createContextScope } from '@gist-ui/context';
import { TableClassNames, TableVariantProps, table } from '@gist-ui/theme';
import * as Menu from '@gist-ui/menu';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { GistUiError } from '@gist-ui/error';
import { Slot } from '@gist-ui/slot';
import {
  UseControllableStateReturn,
  useControllableState,
} from '@gist-ui/use-controllable-state';

type Column<Row> = {
  [K in keyof Row]: {
    accessor: (row: Row) => Row[K];
    header: (data: Row[]) => React.ReactNode;
    identifier: string;
    cell?: (val: Row[K], row: Row, data: Row[]) => React.ReactNode;
    visibility?: boolean;
    visibilityTitle?: string;
    hideable?: boolean;
  };
}[keyof Row];

type GetRowKey<R> = (row: R) => string;
type _Row = Record<string, string>;
type VisibilityState = { identifier: string; visibility: boolean };

// ********** ROOT **********

const Root_Name = 'Table.Root';

interface RootContext {
  data?: _Row[];
  columns?: Column<_Row>[];
  visibilityState?: VisibilityState[];
  getRowKey?: GetRowKey<_Row>;
  setVisibilityState: UseControllableStateReturn<
    VisibilityState[],
    VisibilityState
  >[1];
}

const [RootProvider, useRootContext] =
  createContextScope<RootContext>(Root_Name);

export interface RootProps<R> {
  data?: R[];
  columns?: Column<R>[];
  getRowKey?: GetRowKey<R>;
  children?: React.ReactNode;
  visibilityState?: VisibilityState[];
  onVisibilityStateChange?: (
    value: VisibilityState[],
    changed: VisibilityState,
  ) => void;
}

const RootComp = (props: RootProps<_Row>) => {
  const {
    columns: userColumns,
    data,
    children,
    getRowKey,
    onVisibilityStateChange,
    visibilityState: visibilityStateProp,
  } = props;

  const [visibilityState, setVisibilityState] = useControllableState<
    VisibilityState[],
    VisibilityState
  >({
    defaultValue: [],
    value: visibilityStateProp,
    onChange: (value, changed) => {
      if (!changed)
        throw new GistUiError(
          'Autocomplete',
          'internal Error, reason is not defined',
        );

      onVisibilityStateChange?.(value, changed);
    },
  });

  const columns = useMemo(
    () =>
      userColumns?.map((ele) => ({
        ...ele,
        visibility: ele.visibility ?? true,
        hideable: ele.hideable ?? true,
        identifier: ele.identifier.replaceAll(' ', '-'),
      })),
    [userColumns],
  );

  return (
    <RootProvider
      data={data}
      columns={columns}
      visibilityState={visibilityState}
      getRowKey={getRowKey}
      setVisibilityState={setVisibilityState}
    >
      {children}
    </RootProvider>
  );
};

RootComp.displayName = 'gist-ui.' + Root_Name;

export const Root = RootComp as <R>(props: RootProps<R>) => React.ReactNode;

// ********** Table **********

const Table_Name = 'Table.Table';

export interface TableProps extends TableVariantProps {
  classNames?: TableClassNames;
}

export const Table = (props: TableProps) => {
  const { classNames, variant = 'grid' } = props;

  const { data, columns, getRowKey, visibilityState } =
    useRootContext(Table_Name);

  const styles = table({ variant });

  return (
    data &&
    columns && (
      <table className={styles.table({ className: classNames?.table })}>
        <thead className={styles.thead({ className: classNames?.thead })}>
          <tr className={styles.tr({ className: classNames?.tr })}>
            {columns?.map(({ header, identifier, visibility }) => {
              const visible =
                visibilityState?.find((ele) => ele.identifier === identifier)
                  ?.visibility ?? visibility;

              return !visible ? undefined : (
                <th
                  className={styles.th({ className: classNames?.th })}
                  key={identifier}
                >
                  {typeof header === 'function' ? header(data) : header}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr
              className={styles.tr({ className: classNames?.tr })}
              key={getRowKey?.(row) ?? i}
            >
              {columns.map(({ accessor, cell, identifier, visibility }) => {
                const visible =
                  visibilityState?.find((ele) => ele.identifier === identifier)
                    ?.visibility ?? visibility;

                return !visible ? undefined : (
                  <td
                    className={styles.td({ className: classNames?.td })}
                    key={identifier}
                  >
                    {cell ? cell(accessor(row), row, data) : accessor(row)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    )
  );
};

Table.displayName = 'gist-ui.' + Table_Name;

// ********** ColumnVisibility **********

const ColumnVisibility_Name = 'Table.ColumnVisibility';

export interface ColumnVisibilityProps
  extends Omit<Menu.MenuProps, 'className' | 'roleDescription'> {
  children?: React.ReactNode;
  classNames?: {
    menu?: string;
    checkboxItem?: Menu.CheckboxItemProps['classNames'];
  };
}

export const ColumnVisibility = (props: ColumnVisibilityProps) => {
  const { children, classNames, ...menuProps } = props;

  const { columns, data, setVisibilityState, visibilityState } = useRootContext(
    ColumnVisibility_Name,
  );

  return (
    <Menu.Root>
      <Menu.Trigger a11yLabel="open table column visibility">
        {children}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Menu
          roleDescription="toggle table column visibility"
          {...menuProps}
          className={classNames?.menu}
        >
          <Menu.Arrow />

          {columns &&
            data &&
            columns.map((column, i) => {
              const {
                header,
                visibilityTitle,
                visibility,
                hideable,
                identifier,
              } = column;

              if (!hideable) return;

              const headerValue = header(data);

              const val =
                typeof headerValue === 'string' ? headerValue : visibilityTitle;

              const checked =
                visibilityState?.find((ele) => ele.identifier === identifier)
                  ?.visibility ?? visibility;

              return (
                <Menu.CheckboxItem
                  key={i}
                  checked={checked}
                  classNames={classNames?.checkboxItem}
                  onChange={() => {
                    const changed = { identifier, visibility: !checked };

                    setVisibilityState(
                      (prev) => [
                        ...prev.filter((ele) => ele.identifier !== identifier),
                        changed,
                      ],
                      changed,
                    );
                  }}
                >
                  {val ? val[0].toUpperCase() + val.slice(1) : ''}
                </Menu.CheckboxItem>
              );
            })}
        </Menu.Menu>
      </Menu.Portal>
    </Menu.Root>
  );
};

ColumnVisibility.displayName = 'gist-ui.' + ColumnVisibility_Name;

// ********** SelectRowProvider **********

const SelectRowProvider_Name = 'Table.SelectRow';

interface SelectRowContext {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  rows: React.MutableRefObject<string[]>;
}

const [SelectRowContextProvider, useSelectRowContext] =
  createContextScope<SelectRowContext>(SelectRowProvider_Name);

export interface SelectRowProviderProps {
  children: React.ReactNode;
}

export const SelectRowProvider = (props: SelectRowProviderProps) => {
  const { children } = props;

  const rows = useRef<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <SelectRowContextProvider
      selected={selected}
      setSelected={setSelected}
      rows={rows}
    >
      {children}
    </SelectRowContextProvider>
  );
};

SelectRowProvider.displayName = 'gist-ui.' + SelectRowProvider_Name;

// ********** SelectAllRows **********

const SelectAllRows_Name = 'Table.SelectAllRows';

export interface SelectAllRowsProps {
  children: React.ReactNode;
}

export const SelectAllRows = (props: SelectAllRowsProps) => {
  const { children } = props;
  const { selected, setSelected, rows } =
    useSelectRowContext(SelectAllRows_Name);

  return (
    <Slot
      checked={selected.length && selected.length === rows.current.length}
      onChange={(event: { target: { value: boolean } }) => {
        setSelected(event.target.value ? rows.current : []);
      }}
      indeterminate={selected.length && selected.length !== rows.current.length}
    >
      {children}
    </Slot>
  );
};

SelectAllRows.displayName = 'gist-ui.' + SelectAllRows_Name;

// ********** SelectRow **********

const SelectRow_Name = 'Table.SelectRow';

export interface SelectRowProps {
  children: React.ReactNode;
}

export const SelectRow = (props: SelectRowProps) => {
  const { children } = props;
  const { selected, setSelected, rows } = useSelectRowContext(SelectRow_Name);

  const identifier = useId();

  useEffect(() => {
    rows.current.push(identifier);

    return () => {
      rows.current = rows.current.filter((ele) => ele !== identifier);
    };
  }, [identifier, rows]);

  return (
    <Slot
      checked={selected.includes(identifier)}
      onChange={(event: { target: { value: boolean } }) => {
        setSelected((prev) =>
          event.target.value
            ? [...prev, identifier]
            : prev.filter((ele) => ele !== identifier),
        );
      }}
    >
      {children}
    </Slot>
  );
};

SelectRow.displayName = 'gist-ui.' + SelectRow_Name;