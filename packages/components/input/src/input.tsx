import { input, InputClassNames, InputVariantProps } from '@gist-ui/theme';
import { mergeProps, mergeRefs } from '@gist-ui/react-utils';
import { useFocusRing } from '@react-aria/focus';
import { useControllableState } from '@gist-ui/use-controllable-state';
import { useFocus, useHover } from '@react-aria/interactions';
import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from 'react';

export interface InputProps extends Omit<InputVariantProps, 'error'> {
  type?: 'text' | 'multiline';
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  id?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  required?: boolean;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  classNames?: InputClassNames;
  /**
   * When error prop is true, its value is used in "errorMessage" aria-live attribute
   * @default polite
   */
  a11yFeedback?: 'polite' | 'assertive';
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'defaultValue'
    | 'value'
    | 'onChange'
    | 'id'
    | 'onBlur'
    | 'onFocus'
    | 'required'
  >;
  inputWrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => {
  const {
    label,
    id,
    helperText,
    errorMessage,
    startContent,
    endContent,
    value: valueProp,
    defaultValue,
    onBlur,
    onFocus,
    classNames,
    required,
    onChange,
    isDisabled,
    error,
    color,
    fullWidth,
    hideLabel,
    size,
    inputProps = {},
    inputWrapperProps = {},
    type = 'text',
    a11yFeedback = 'polite',
    variant = 'filled',
  } = props;

  const labelId = useId();
  const helperTextId = useId();
  const errorMessageId = useId();
  const inputId = id || labelId;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && !label) {
      console.warn(
        '`Input` "label" prop is optional but recommended. if you want to hide label then pass "hideLabel" prop as well',
      );
    }
  }, [label]);

  useImperativeHandle(
    ref,
    () => {
      inputWrapperRef.current!.focus = () => {
        inputRef.current?.focus();
        textareaRef.current?.focus();
      };

      return inputWrapperRef.current!;
    },
    [],
  );

  const [value, setValue] = useControllableState({
    defaultValue: defaultValue ?? '',
    value: valueProp,
    onChange,
    resetStateValue: '',
  });

  const {
    focusProps: focusRingProps,
    isFocusVisible,
    isFocused,
  } = useFocusRing({ isTextInput: true });

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const { focusProps } = useFocus<HTMLInputElement>({ onFocus, onBlur });

  const styles = input({
    isDisabled,
    error,
    color,
    fullWidth,
    hideLabel,
    size,
    variant,
    multiline: type === 'multiline',
  });

  const sharedProps = {
    ...mergeProps(focusProps, focusRingProps, inputProps),
    value,
    'aria-label': hideLabel ? label : undefined,
    'aria-describedby': helperText ? helperTextId : undefined,
    'aria-errormessage': error && errorMessage ? errorMessageId : undefined,
    'aria-required': required,
    'aria-invalid': error,
    id: inputId,
    disabled: isDisabled,
  };

  return (
    <div
      className={styles.base({ className: classNames?.base })}
      data-focused={isFocused}
      data-focus-visible={isFocusVisible && isFocused}
      data-filled={!!value}
      data-shrink={isFocused || !!value || !!startContent}
      data-hovered={isHovered}
      data-disabled={isDisabled}
      data-start={!!startContent}
      data-end={!!endContent}
    >
      {!hideLabel && !!label && (
        <label
          htmlFor={inputId}
          className={styles.label({ className: classNames?.label })}
        >
          {label}
        </label>
      )}

      <div
        ref={mergeRefs(ref, inputWrapperRef)}
        className={styles.inputWrapper({ className: classNames?.inputWrapper })}
        {...mergeProps(hoverProps, inputWrapperProps)}
        onPointerDown={(e) => {
          inputWrapperProps.onPointerDown?.(e);

          if (isDisabled) return;
          if (e.button !== 0) return;

          if (type !== 'multiline' && e.target !== inputRef.current) {
            e.preventDefault();
            inputRef.current?.focus();
            return;
          }

          if (type === 'multiline' && e.target !== textareaRef.current) {
            e.preventDefault();
            textareaRef.current?.focus();
          }
        }}
      >
        {startContent && (
          <div
            className={styles.startContent({
              className: classNames?.startContent,
            })}
          >
            {startContent}
          </div>
        )}

        {type === 'multiline' ? (
          <textarea
            rows={3}
            {...sharedProps}
            onChange={(e) => setValue(e.target.value)}
            className={styles.textarea({ className: classNames?.textarea })}
            ref={textareaRef}
          ></textarea>
        ) : (
          <input
            {...sharedProps}
            onChange={(e) => setValue(e.target.value)}
            className={styles.input({ className: classNames?.input })}
            ref={inputRef}
          />
        )}

        {endContent && (
          <div
            className={styles.endContent({ className: classNames?.endContent })}
          >
            {endContent}
          </div>
        )}

        {variant === 'border' ? (
          <fieldset
            aria-hidden="true"
            className={styles.fieldset({ className: classNames?.fieldset })}
          >
            {!hideLabel && (
              <legend
                className={styles.legend({ className: classNames?.legend })}
              >
                {label}
              </legend>
            )}
          </fieldset>
        ) : null}
      </div>

      {!error && helperText && (
        <div
          id={helperTextId}
          className={styles.helperText({ className: classNames?.helperText })}
        >
          {helperText}
        </div>
      )}

      {error && errorMessage && (
        <div
          id={errorMessageId}
          aria-live={a11yFeedback}
          className={styles.helperText({ className: classNames?.helperText })}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'gist-ui.Input';

export default Input;
