import {
  AutocompleteClassNames,
  AutocompleteVariantProps,
  autocomplete,
} from '@typeweave/theme';
import React from 'react';
import { createPortal } from 'react-dom';
import {
  PopperFloating,
  PopperFloatingProps,
  PopperReference,
  PopperRoot,
} from '../popper';
import { createAutocompleteFilter } from './create-autocomplete-filter';
import { useControlled } from '../use-controlled';
import { useCallbackRef } from '../use-callback-ref';
import usePreviousProps from '../use-previous-props';
import { mergeRefs } from '@typeweave/react-utils';
import { PointerEvents } from '../pointer-events/pointer-events';
import { Chip } from '../chip';
import { Button } from '../button';
import { ChevronDownIcon, XIcon } from 'lucide-react';
import { InputProps } from '../input';

export type AutocompleteOnChangeReason =
  | 'selectOption'
  | 'removeOption'
  | 'blur'
  | 'clear';

export type AutocompleteOnCloseReason =
  | 'toggleInput'
  | 'escape'
  | 'selectOption'
  | 'removeOption'
  | 'blur';

export interface AutocompleteRenderOptionState {
  inputValue: string;
  index: number;
  selected: boolean;
}

export interface AutocompleteRenderGroupParams {
  key: string;
  group: string;
  children?: React.ReactNode;
}

type OptionsGroup = {
  key: string;
  index: number;
  group: string;
  options: (string | object)[];
};

export interface AutocompleteRenderOptionProps {
  key: string;
  tabIndex: number;
  role: string;
  id: string;
  onPointerEnter: (event: React.PointerEvent<HTMLLIElement>) => void;
  onPress: (event: React.PointerEvent<HTMLLIElement>) => void;
  'data-option-index': number;
  'aria-disabled': boolean;
  'aria-selected': boolean;
  'data-selected': boolean;
  className: string;
}

export interface AutocompleteRenderTagsProps {}

export interface AutocompleteRenderInputProps extends InputProps<false> {
  ref: React.RefObject<HTMLInputElement>;
}

export type AutocompleteProps<Value, Multiple, DisableClearable> =
  (AutocompleteVariantProps &
    Omit<
      React.HTMLAttributes<HTMLUListElement>,
      'defaultValue' | 'children' | 'onChange'
    > & {
      disabled?: boolean;
      classNames?: AutocompleteClassNames;
      offset?: PopperFloatingProps['mainOffset'];
      options: Value[];
      open?: boolean;
      onOpen?: () => void;
      onClose?: (reason: AutocompleteOnCloseReason) => void;
      defaultOpen?: boolean;
      getOptionDisabled?: (option: Value) => boolean;
      includeInputInList?: boolean;
      loopList?: boolean;
      clearOnEscape?: boolean;
      readOnly?: boolean;
      disableCloseOnSelect?: boolean;
      openOnFocus?: boolean;
      pageSize?: number;
      getOptionLabel?: (option: Value) => string;
      autoHighlight?: boolean;
      getOptionKey?: (options: Value) => string;
      isOptionEqualToValue?: (option: Value, value: Value) => boolean;
      renderGroup?: (params: AutocompleteRenderGroupParams) => React.ReactNode;
      noOptionsText?: string;
      clearText?: string;
      openText?: string;
      closeText?: string;
      loadingText?: string;
      loading?: boolean;
      clearInputOnBlur?: boolean;
      selectOnFocus?: boolean;
      handleHomeEndKeys?: boolean;
      filterSelectedOptions?: boolean;
      hasClearButton?: boolean;
      hasOpenIndicator?: boolean;
      groupBy?: (option: Value) => string;
      inputValue?: string;
      onInputChange?: (
        newValue: string,
        reason: 'reset' | 'clear' | 'input',
      ) => void;
      filterOptions?: ReturnType<typeof createAutocompleteFilter<Value>>;
      disablePortal?: boolean;
      disablePopper?: boolean;
      renderInput: (props: AutocompleteRenderInputProps) => React.ReactNode;
      renderOption?: (
        props: AutocompleteRenderOptionProps,
        option: Value,
        state: AutocompleteRenderOptionState,
      ) => React.ReactNode;
      renderTags?: (
        tags: Value[],
        props: (index: number) => AutocompleteRenderTagsProps,
      ) => React.ReactNode;
    }) &
    (Multiple extends true
      ? {
          multiple: Multiple;
          defaultValue?: Value[];
          value?: Value[];
          onChange?: (
            newValue: Value[],
            reason: AutocompleteOnChangeReason,
          ) => void;
          disableClearable?: DisableClearable;
        }
      : DisableClearable extends true
        ? {
            multiple?: Multiple;
            defaultValue?: Value;
            value?: Value;
            onChange?: (
              newValue: Value,
              reason: AutocompleteOnChangeReason,
            ) => void;
            disableClearable: DisableClearable;
          }
        : {
            multiple?: Multiple;
            defaultValue?: Value;
            value?: Value | null;
            onChange?: (
              newValue: Value | null,
              reason: AutocompleteOnChangeReason,
            ) => void;
            disableClearable?: DisableClearable;
          });

const defaultOptionsFilter = createAutocompleteFilter<string | object>();

const displayName = 'Autocomplete';

const AutocompleteImpl = React.forwardRef<
  HTMLUListElement,
  AutocompleteProps<string | object, false, false>
>((props, ref) => {
  const {
    classNames,
    className,
    offset,
    open: openProp,
    onOpen,
    onClose,
    autoHighlight = false,
    defaultOpen = false,
    defaultValue,
    value: valueProp,
    onChange,
    openOnFocus,
    handleHomeEndKeys = true,
    shadow = true,
    options = [],
    renderGroup: renderGroupProp,
    filterSelectedOptions = false,
    includeInputInList,
    clearOnEscape,
    loopList = true,
    disabled,
    selectOnFocus = true,
    hasClearButton = true,
    hasOpenIndicator = true,
    multiple,
    readOnly,
    pageSize = 5,
    disableClearable,
    clearInputOnBlur = true,
    disableCloseOnSelect,
    getOptionDisabled,
    noOptionsText = 'no options',
    loadingText = 'loading ...',
    openText = 'open',
    closeText = 'close',
    clearText = 'clear',
    loading,
    getOptionLabel: getOptionLabelProp,
    isOptionEqualToValue: isOptionEqualToValueProp,
    getOptionKey,
    groupBy,
    inputValue: inputValueProp,
    onInputChange,
    filterOptions = defaultOptionsFilter,
    renderInput,
    disablePortal,
    disablePopper,
    renderOption: renderOptionProp,
    renderTags,
    ...restProps
  } = props;

  const isOptionEqualToValue = (
    option: string | object,
    value: string | object,
  ) => {
    if (isOptionEqualToValueProp)
      return isOptionEqualToValueProp(option, value);

    return option === value;
  };

  const getOptionLabel = useCallbackRef((option: string | object) => {
    if (typeof option === 'string') return option;

    if ('label' in option && typeof option.label === 'string')
      return option.label;

    const optionLabel = getOptionLabelProp?.(option);

    if (
      typeof optionLabel !== 'string' &&
      process.env.NODE_ENV !== 'production'
    ) {
      const erroneousReturn =
        optionLabel === undefined
          ? 'undefined'
          : `${typeof optionLabel} (${optionLabel})`;

      console.error(
        `Typeweave: The \`getOptionLabel\` method of ${displayName} returned ${erroneousReturn} instead of a string for ${JSON.stringify(
          option,
        )}.`,
      );
    }

    return String(optionLabel);
  });

  const inputId = React.useId();

  const [value, setValue] = useControlled({
    name: displayName,
    state: 'value',
    controlled: valueProp,
    default: defaultValue,
  });

  const [inputValue, setInputValue] = useControlled({
    name: displayName,
    state: 'inputValue',
    controlled: inputValueProp,
    default: '',
  });

  const resetInputValue = React.useCallback(
    (newValue: string | object | null) => {
      //

      let newInputValue;
      if (Array.isArray(newValue)) {
        newInputValue = '';
      } else if (newValue === null) {
        newInputValue = '';
      } else {
        const optionLabel = getOptionLabel(newValue);
        newInputValue = typeof optionLabel === 'string' ? optionLabel : '';
      }

      if (inputValue === newInputValue) {
        return;
      }

      setInputValue(newInputValue);

      onInputChange?.(newInputValue, 'reset');
    },
    [getOptionLabel, inputValue, onInputChange, setInputValue],
  );

  // this is used to not open listbox when user clear value with clear button
  const ignoreListOpen = React.useRef(false);

  // this is used to select input value if user focused input first time
  const firstFocus = React.useRef(true);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxRef = React.useRef<HTMLUListElement>(null);

  const defaultHighlighted = autoHighlight ? 0 : -1;
  const highlightedIndexRef = React.useRef(defaultHighlighted);

  const [focused, setFocused] = React.useState(false);

  const [open, setOpen] = useControlled({
    name: displayName,
    state: 'open',
    controlled: openProp,
    default: defaultOpen,
  });

  const [keepUnfiltered, setKeepUnfiltered] = React.useState(true);

  const inputValueIsSelectedValue =
    !Array.isArray(value) && value && inputValue === getOptionLabel(value);

  const listOpen = open && !readOnly;

  const filteredOptions = listOpen
    ? filterOptions(
        options.filter((option) => {
          if (
            filterSelectedOptions &&
            (Array.isArray(value) ? value : [value]).some(
              (value2) =>
                value2 !== null && isOptionEqualToValue(option, value2),
            )
          ) {
            return false;
          }
          return true;
        }),
        {
          inputValue:
            inputValueIsSelectedValue && keepUnfiltered ? '' : inputValue,
          getOptionLabel,
        },
      )
    : [];

  let groupedOptions = filteredOptions;

  if (groupBy) {
    // used to keep track of key and indexes in the result array
    const indexBy = new Map();
    let warn = false;

    groupedOptions = filteredOptions.reduce<OptionsGroup[]>(
      (acc, option, index) => {
        const group = groupBy(option);

        if (acc.length > 0 && acc[acc.length - 1].group === group) {
          acc[acc.length - 1].options.push(option);
        } else {
          if (process.env.NODE_ENV !== 'production') {
            if (indexBy.get(group) && !warn) {
              console.warn(
                `Typeweave: The options provided combined with the \`groupBy\` method of ${displayName} returns duplicated headers.`,
                'You can solve the issue by sorting the options with the output of `groupBy`.',
              );
              warn = true;
            }
            indexBy.set(group, true);
          }

          acc.push({
            key: `${index}`,
            index,
            group,
            options: [option],
          });
        }

        return acc;
      },
      [],
    );
  }

  const previousProps = usePreviousProps({
    filteredOptions,
    value,
    inputValue,
  });

  React.useEffect(() => {
    if (!focused && value) resetInputValue(value);
  }, [focused, resetInputValue, value]);

  if (process.env.NODE_ENV !== 'production') {
    if (value !== null && options.length > 0) {
      const missingValue = (Array.isArray(value) ? value : [value]).filter(
        (value2) =>
          !options.some((option) => isOptionEqualToValue(option, value2)),
      );

      if (missingValue.length > 0) {
        console.warn(
          [
            `Typeweave: The value provided to ${displayName} is invalid.`,
            `None of the options match with \`${
              missingValue.length > 1
                ? JSON.stringify(missingValue)
                : JSON.stringify(missingValue[0])
            }\`.`,
            'You can use the `isOptionEqualToValue` prop to customize the equality test.',
          ].join('\n'),
        );
      }
    }
  }

  const validOptionIndex = (index: number, direction: 'next' | 'previous') => {
    if (!listboxRef.current || index < 0 || index >= filteredOptions.length) {
      return -1;
    }

    let nextFocus = index;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const option = listboxRef.current.querySelector(
        `[data-option-index="${nextFocus}"]`,
      );

      // Same logic as MenuList.js
      const nextFocusDisabled =
        !option || option.getAttribute('aria-disabled') === 'true';

      if (option && option.hasAttribute('tabindex') && !nextFocusDisabled) {
        // The next option is available
        return nextFocus;
      }

      // The next option is disabled, move to the next element.
      // with looped index
      if (direction === 'next') {
        nextFocus = (nextFocus + 1) % filteredOptions.length;
      } else {
        nextFocus =
          (nextFocus - 1 + filteredOptions.length) % filteredOptions.length;
      }

      // We end up with initial index, that means we don't have available options.
      // All of them are disabled
      if (nextFocus === index) {
        return -1;
      }
    }
  };

  const setHighlightedIndex = useCallbackRef(
    (index: number, reason: 'pointer' | 'keyboard') => {
      highlightedIndexRef.current = index;

      if (!inputRef.current) return;

      // does the index exist?
      if (index === -1) {
        inputRef.current.removeAttribute('aria-activedescendant');
      } else {
        inputRef.current.setAttribute(
          'aria-activedescendant',
          `${inputId}-option-${index}`,
        );
      }

      if (!listboxRef.current) {
        return;
      }

      const prev = listboxRef.current.querySelector(
        `[role="option"][data-focused="true"]`,
      ) as HTMLElement;

      if (prev) {
        delete prev.dataset.focused;
        delete prev.dataset.focusVisible;
      }

      const listboxNode = listboxRef.current;

      if (!listboxNode) return;

      if (index === -1) {
        listboxNode.scrollTop = 0;
        return;
      }

      const option = listboxRef.current.querySelector(
        `[data-option-index="${index}"]`,
      ) as HTMLElement;

      if (!option) return;

      option.dataset.focused = 'true';

      if (reason === 'keyboard') {
        option.dataset.focusVisible = 'true';
      }

      if (
        listboxNode.scrollHeight > listboxNode.clientHeight &&
        reason === 'keyboard'
      ) {
        const element = option;

        const scrollBottom = listboxNode.clientHeight + listboxNode.scrollTop;
        const elementBottom = element.offsetTop + element.offsetHeight;
        if (elementBottom > scrollBottom) {
          listboxNode.scrollTop = elementBottom - listboxNode.clientHeight;
        } else if (
          element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0) <
          listboxNode.scrollTop
        ) {
          listboxNode.scrollTop =
            element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0);
        }
      }
    },
  );

  const changeHighlightedIndex = useCallbackRef(
    ({
      diff,
      direction,
      reason,
    }: {
      diff: 'reset' | 'start' | 'end' | number;
      direction: 'next' | 'previous';
      reason: 'pointer' | 'keyboard';
    }) => {
      if (!listOpen) return;

      const getNextIndex = () => {
        const maxIndex = filteredOptions.length - 1;

        if (diff === 'reset') {
          return defaultHighlighted;
        }

        if (diff === 'start') {
          return 0;
        }

        if (diff === 'end') {
          return maxIndex;
        }

        const newIndex = highlightedIndexRef.current + diff;

        if (newIndex < 0) {
          if (newIndex === -1 && includeInputInList) {
            return -1;
          }

          if (
            (loopList && highlightedIndexRef.current !== -1) ||
            Math.abs(diff) > 1
          ) {
            return 0;
          }

          return maxIndex;
        }

        if (newIndex > maxIndex) {
          if (newIndex === maxIndex + 1 && includeInputInList) {
            return -1;
          }

          if (loopList || Math.abs(diff) > 1) {
            return maxIndex;
          }

          return 0;
        }

        return newIndex;
      };

      const nextIndex = validOptionIndex(getNextIndex(), direction);
      setHighlightedIndex(nextIndex, reason);
    },
  );

  const handleOpen = () => {
    if (open) return;

    setOpen(true);
    setKeepUnfiltered(true);

    onOpen?.();
  };

  const handleClose = (reason: AutocompleteOnCloseReason) => {
    if (!open) return;

    setOpen(false);

    onClose?.(reason);
  };

  const handleValue = (
    newValue: string | object | null | (string | object | null)[],
    reason: AutocompleteOnChangeReason,
  ) => {
    if (Array.isArray(value) && Array.isArray(newValue)) {
      if (
        value.length === newValue.length &&
        value.every((val, i) => val === newValue[i])
      ) {
        return;
      }
    } else if (value === newValue) {
      return;
    }

    onChange?.(newValue, reason);

    setValue(newValue);
  };

  const selectNewValue = (
    event: React.SyntheticEvent,
    option: string | object,
    reasonProp = 'selectOption',
  ) => {
    let reason = reasonProp;

    if (multiple) {
      const newMultipleValue = Array.isArray(value) ? value.slice() : [];

      if (process.env.NODE_ENV !== 'production') {
        const matches = newMultipleValue.filter((val) =>
          isOptionEqualToValue(option, val),
        );

        if (matches.length > 1) {
          console.error(
            [
              `Typeweave: The \`isOptionEqualToValue\` method of ${displayName} does not handle the arguments correctly.`,
              `The component expects a single value to match a given option but found ${matches.length} matches.`,
            ].join('\n'),
          );
        }
      }

      const itemIndex = newMultipleValue.findIndex((valueItem) =>
        isOptionEqualToValue(option, valueItem),
      );

      if (itemIndex === -1) {
        newMultipleValue.push(option);
      } else {
        newMultipleValue.splice(itemIndex, 1);
        reason = 'removeOption';
      }

      setInputValue('');
      handleValue(newMultipleValue, reason as AutocompleteOnChangeReason);
    } else {
      setInputValue(getOptionLabel(option));

      handleValue(option, reason as AutocompleteOnChangeReason);
    }

    const modifiedEvent = event as unknown as {
      ctrlKey: boolean;
      metaKey: boolean;
    };

    if (
      !disableCloseOnSelect &&
      !modifiedEvent.ctrlKey &&
      !modifiedEvent.metaKey
    ) {
      handleClose(reason as AutocompleteOnCloseReason);
    }
  };

  const handleClear = () => {
    ignoreListOpen.current = true;

    setInputValue('');
    onInputChange?.('', 'clear');

    handleValue(multiple ? [] : null, 'clear');
  };

  const onInputWrapperKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Home':
        if (listOpen && handleHomeEndKeys) {
          // Prevent scroll of the page
          event.preventDefault();
          changeHighlightedIndex({
            diff: 'start',
            direction: 'next',
            reason: 'keyboard',
          });
        }
        break;
      case 'End':
        if (listOpen && handleHomeEndKeys) {
          // Prevent scroll of the page
          event.preventDefault();
          changeHighlightedIndex({
            diff: 'end',
            direction: 'previous',
            reason: 'keyboard',
          });
        }
        break;
      case 'PageUp':
        // Prevent scroll of the page
        event.preventDefault();
        changeHighlightedIndex({
          diff: -pageSize,
          direction: 'previous',
          reason: 'keyboard',
        });
        handleOpen();
        break;
      case 'PageDown':
        // Prevent scroll of the page
        event.preventDefault();
        changeHighlightedIndex({
          diff: pageSize,
          direction: 'next',
          reason: 'keyboard',
        });
        handleOpen();
        break;
      case 'ArrowDown':
        // Prevent cursor move
        event.preventDefault();
        changeHighlightedIndex({
          diff: 1,
          direction: 'next',
          reason: 'keyboard',
        });
        handleOpen();
        break;
      case 'ArrowUp':
        // Prevent cursor move
        event.preventDefault();
        changeHighlightedIndex({
          diff: -1,
          direction: 'previous',
          reason: 'keyboard',
        });
        handleOpen();
        break;

      case 'Enter':
        if (highlightedIndexRef.current !== -1 && listOpen) {
          const option = filteredOptions[highlightedIndexRef.current];
          const disabled = getOptionDisabled
            ? getOptionDisabled(option)
            : false;

          // Avoid early form validation, let the end-users continue filling the form.
          event.preventDefault();

          if (disabled) return;

          selectNewValue(event, option, 'selectOption');
        }
        break;
      case 'Escape':
        if (listOpen) {
          // Avoid Opera to exit fullscreen mode.
          event.preventDefault();
          // Avoid the Modal to handle the event.
          event.stopPropagation();
          handleClose('escape');
        } else if (
          clearOnEscape &&
          (inputValue !== '' || (Array.isArray(value) && value.length > 0))
        ) {
          // Avoid Opera to exit fullscreen mode.
          event.preventDefault();
          // Avoid the Modal to handle the event.
          event.stopPropagation();
          handleClear();
        }
        break;

      default:
    }
  };

  const handleFocus = () => {
    setFocused(true);

    if (openOnFocus && !ignoreListOpen.current) {
      handleOpen();
    }
  };

  const handleBlur = () => {
    setFocused(false);
    firstFocus.current = true;
    ignoreListOpen.current = false;

    handleClose('blur');

    // if multiple is true, user search option and clearInputOnBlur is
    // ture then left the inputValue as is otherwise change inputValue
    if (multiple && clearInputOnBlur) {
      setInputValue('');
      return;
    }

    if (!multiple && value === null && clearInputOnBlur) {
      setInputValue('');
      return;
    }

    if (!multiple && value) {
      setInputValue(getOptionLabel(value));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (inputValue !== newValue) {
      setInputValue(newValue);
      setKeepUnfiltered(false);

      if (onInputChange) {
        onInputChange(newValue, 'input');
      }
    }

    if (newValue === '') {
      if (!disableClearable && !multiple) {
        handleValue(null, 'clear');
      }
    } else {
      handleOpen();
    }
  };

  const handleOptionPointerEnter = (event: React.PointerEvent) => {
    const index = Number(event.currentTarget.getAttribute('data-option-index'));
    if (highlightedIndexRef.current !== index) {
      setHighlightedIndex(index, 'pointer');
    }
  };

  const handleOptionPress = (event: React.PointerEvent) => {
    const index = Number(event.currentTarget.getAttribute('data-option-index'));
    selectNewValue(event, filteredOptions[index], 'selectOption');
  };

  const handleOpenIndicator = () => {
    if (open) {
      handleClose('toggleInput');
    } else {
      handleOpen();
    }
  };

  // Prevent input blur when interacting with the combobox
  const onInputWrapperPoiterDown = (event: React.PointerEvent) => {
    const target = event.target as HTMLElement;

    // Prevent focusing the input if click is anywhere outside the Autocomplete
    if (!event.currentTarget.contains(target)) {
      return;
    }

    if (event.currentTarget === event.target) {
      handleOpenIndicator();
    }

    if (target.getAttribute('id') !== inputId) {
      event.preventDefault();
    }
  };

  // Focus the input when interacting with the combobox
  const onInputWrapperPress = (event: React.PointerEvent) => {
    const target = event.target as HTMLElement;

    // Prevent focusing the input if click is anywhere outside the Autocomplete
    if (!event.currentTarget.contains(target)) {
      return;
    }

    if (!inputRef.current) return;

    inputRef.current.focus();

    if (
      selectOnFocus &&
      firstFocus.current &&
      (inputRef.current.selectionEnd || 0) -
        (inputRef.current.selectionStart || 0) ===
        0
    ) {
      inputRef.current.select();
    }

    firstFocus.current = false;
  };

  const onInputPointerDown = () => {
    if (!disabled && (inputValue === '' || !open)) {
      handleOpenIndicator();
    }
  };

  const getOptionProps = ({
    index,
    option,
  }: {
    index: number;
    option: string | object;
  }) => {
    const selected = (Array.isArray(value) ? value : [value]).some(
      (value2) => value2 != null && isOptionEqualToValue(option, value2),
    );
    const disabled = getOptionDisabled ? getOptionDisabled(option) : false;

    return {
      key: getOptionKey?.(option) ?? getOptionLabel(option),
      tabIndex: -1,
      role: 'option',
      id: `${inputId}-option-${index}`,
      onPointerEnter: handleOptionPointerEnter,
      onPress: handleOptionPress,
      'data-option-index': index,
      'aria-disabled': disabled,
      'aria-selected': selected,
      'data-selected': selected,
    };
  };

  const handleTagDelete = (index: number) => () => {
    if (!Array.isArray(value)) return;

    const newValue = value.slice();
    newValue.splice(index, 1);
    handleValue(newValue, 'removeOption');
  };

  if (disabled && focused) {
    handleBlur();
  }

  const styles = React.useMemo(
    () => autocomplete({ shadow, multiple, hasClearButton, hasOpenIndicator }),
    [shadow, multiple, hasClearButton, hasOpenIndicator],
  );

  const defaultRenderGroup = (params: AutocompleteRenderGroupParams) => (
    <li key={params.key} className={styles.group()}>
      <div className={styles.groupHeader()}>{params.group}</div>
      <ul className={styles.groupItems()}>{params.children}</ul>
    </li>
  );

  const renderGroup = renderGroupProp || defaultRenderGroup;

  const defaultRenderOption = (
    props: AutocompleteRenderOptionProps & { key: string },
    option: string | object,
  ) => {
    const { key, ...otherProps } = props;

    return (
      <PointerEvents key={key} {...otherProps}>
        <li>{getOptionLabel(option)}</li>
      </PointerEvents>
    );
  };

  const renderOption = renderOptionProp || defaultRenderOption;

  const renderListOption = (option: string | object, index: number) => {
    const optionProps = getOptionProps({ option, index });

    return renderOption(
      { ...optionProps, className: styles.option() },
      option,
      {
        selected: optionProps['aria-selected'],
        index,
        inputValue,
      },
    );
  };

  let startContent: React.ReactNode | undefined = undefined;

  if (Array.isArray(value) && value.length > 0) {
    const getTagProps = (index: number) => ({
      className: styles.tag(),
      disabled,
      key: index,
      'data-tag-index': index,
      tabIndex: -1,
      ...(!readOnly && { onDelete: handleTagDelete(index) }),
    });

    if (renderTags) {
      startContent = renderTags(value, getTagProps);
    } else {
      startContent = value.map((option, index) => {
        const { key, ...tagProps } = getTagProps(index);

        return (
          <Chip
            key={key}
            label={getOptionLabel(option)}
            size="sm"
            color="default"
            variant="flat"
            {...tagProps}
          />
        );
      });
    }
  }

  const endContent = (hasClearButton || hasOpenIndicator) && (
    <div className={styles.endContent()}>
      {hasClearButton && (Array.isArray(value) ? !!value.length : !!value) && (
        <Button
          isIconOnly
          variant="text"
          size="sm"
          aria-label={clearText}
          excludeFromTabOrder
          className={styles.clearIndicator()}
          onPress={handleClear}
        >
          <XIcon />
        </Button>
      )}

      {hasOpenIndicator && (
        <Button
          isIconOnly
          variant="text"
          size="sm"
          aria-label={listOpen ? closeText : openText}
          excludeFromTabOrder
          className={styles.openIndicator()}
          onPress={handleOpenIndicator}
          data-open={listOpen}
        >
          <ChevronDownIcon />
        </Button>
      )}
    </div>
  );

  if (multiple && !Array.isArray(value))
    throw new Error(
      `${displayName}, value must be an Array when multiple is true`,
    );

  if (!multiple && Array.isArray(value))
    throw new Error(
      `${displayName}, value must not be an Array when multiple is false`,
    );

  if (!renderInput)
    throw new Error(`${displayName}, \`renderInput\` prop is required`);

  const list = (
    <div
      className={styles.listboxWrapper({
        className: classNames?.listboxWrapper ?? className,
      })}
    >
      {groupedOptions.length === 0 ? null : (
        <ul
          {...restProps}
          ref={mergeRefs(ref, listboxRef)}
          className={styles.listbox({
            className: classNames?.listbox ?? className,
          })}
          role="listbox"
          id={`${inputId}-listbox`}
          aria-labelledby={`${inputId}-label`}
          onPointerDown={(e) => {
            e.preventDefault();
          }}
        >
          {groupedOptions.map((option, index) => {
            if (groupBy) {
              const groupedOption = option as OptionsGroup;

              return renderGroup({
                key: groupedOption.key,
                group: groupedOption.group,
                children: groupedOption.options.map((option2, index2) =>
                  renderListOption(option2, groupedOption.index + index2),
                ),
              });
            }

            return renderListOption(option, index);
          })}
        </ul>
      )}

      {loading && groupedOptions.length === 0 ? (
        <div
          className={styles.loading({
            className: classNames?.noOptions,
          })}
        >
          {loadingText}
        </div>
      ) : null}

      {groupedOptions.length === 0 && !loading ? (
        <div
          className={styles.noOptions({
            className: classNames?.noOptions,
          })}
        >
          {noOptionsText}
        </div>
      ) : null}
    </div>
  );

  const withPopper = disablePopper ? (
    list
  ) : (
    <PopperFloating sticky="always" mainOffset={offset || 5}>
      {list}
    </PopperFloating>
  );

  const listboxAvailable = open && filteredOptions.length > 0 && !readOnly;

  return (
    <PopperRoot>
      <PopperReference>
        {({ referenceRef }) =>
          renderInput({
            inputWrapperProps: {
              'aria-owns': listOpen ? `${inputId}-listbox` : undefined,
              onKeyDown: onInputWrapperKeyDown,
              onPointerDown: onInputWrapperPoiterDown,
              onPress: onInputWrapperPress,
            },
            classNames: {
              inputWrapper: styles.inputWrapper(),
              input: styles.input(),
            },
            inputWrapperRef: referenceRef,
            startContent,
            endContent,
            id: inputId,
            value: inputValue,
            onBlur: handleBlur,
            onFocus: handleFocus,
            onChange: handleInputChange,
            onPointerDown: onInputPointerDown,
            // if open then this is handled imperatively in setHighlightedIndex so don't let react override
            // only have an opinion about this when closed
            'aria-activedescendant': listOpen ? '' : undefined,
            'aria-autocomplete': 'list',
            'aria-controls': listboxAvailable
              ? `${inputId}-listbox`
              : undefined,
            'aria-expanded': listboxAvailable,
            // Disable browser's suggestion that might overlap with the popup.
            // Handle autocomplete but not autofill.
            autoComplete: 'off',
            ref: inputRef,
            autoCapitalize: 'none',
            spellCheck: 'false',
            role: 'combobox',
            disabled,
            readOnly,
          })
        }
      </PopperReference>

      {open
        ? disablePortal
          ? withPopper
          : createPortal(withPopper, globalThis?.document.body)
        : null}
    </PopperRoot>
  );
});

AutocompleteImpl.displayName = displayName;

export const Autocomplete = AutocompleteImpl as unknown as <
  Value extends string | object,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
>(
  props: AutocompleteProps<Value, Multiple, DisableClearable> &
    React.RefAttributes<HTMLUListElement>,
) => React.ReactNode;
