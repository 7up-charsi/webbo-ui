import { input, InputClassNames, InputVariantProps } from '@webbo-ui/theme';
import { mergeRefs } from '@webbo-ui/react-utils';
import { forwardRef, useEffect, useId, useRef } from 'react';

type InputBaseProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  inputRef?: React.ForwardedRef<HTMLInputElement>;
  textareaRef?: undefined;
  classNames?: Omit<InputClassNames, 'textarea'>;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
};

type TextareaBaseProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  textareaRef?: React.ForwardedRef<HTMLTextAreaElement>;
  classNames?: Omit<InputClassNames, 'input'>;
};

type BaseProps = InputVariantProps & {
  defaultValue?: string;
  value?: string;
  label?: string;
  id?: string;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  hideLabel?: boolean;
  className?: string;
  placeholder?: string;
  baseProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;
  labelProps?: Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'className'>;
  helperTextProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;
  errorMessageProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;
  inputWrapperProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;
  baseRef?: React.ForwardedRef<HTMLDivElement>;
  error?: boolean;
};

export type InputProps<Multiline> = BaseProps &
  (Multiline extends true
    ? TextareaBaseProps & {
        multiline: Multiline;
      }
    : InputBaseProps & {
        multiline?: false;
      });

type InputImplProps = BaseProps & { multiline?: boolean } & InputBaseProps &
  TextareaBaseProps;

const InputImpl = (
  props: InputImplProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const {
    label,
    id,
    helperText,
    errorMessage,
    startContent,
    endContent,
    classNames,
    className,
    required,
    error,
    hideLabel,
    baseRef,
    inputRef,
    baseProps = {},
    labelProps = {},
    helperTextProps = {},
    inputWrapperProps = {},
    errorMessageProps = {},
    fullWidth = false,
    disabled = false,
    multiline,
    textareaRef,
    ...restProps
  } = props;

  const labelId = useId();
  const helperTextId = useId();
  const errorMessageId = useId();
  const inputId = id || labelId;

  const innerInputRef = useRef<HTMLInputElement | null>(null);
  const innerTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && !label) {
      console.warn(
        '`Input` "label" prop is optional but recommended. if you want to hide label then pass "hideLabel" prop as well',
      );
    }
  }, [label]);

  const styles = input({
    disabled,
    fullWidth,
    required: !!required,
    multiline,
  });

  const sharedProps = {
    'aria-label': hideLabel ? label : undefined,
    'aria-describedby': helperText ? helperTextId : undefined,
    'aria-errormessage': error && errorMessage ? errorMessageId : undefined,
    'aria-required': required,
    'aria-invalid': error,
    id: inputId,
    disabled,
    autoComplete: 'off',
  };

  return (
    <div
      {...baseProps}
      ref={baseRef}
      className={styles.base({ className: classNames?.base ?? className })}
      data-disabled={disabled}
    >
      {!hideLabel && !!label && (
        <label
          {...labelProps}
          htmlFor={inputId}
          className={styles.label({ className: classNames?.label })}
        >
          {label}
        </label>
      )}

      <div
        {...inputWrapperProps}
        onPointerDown={(e) => {
          inputWrapperProps?.onPointerDown?.(e);

          if (disabled) return;
          if (e.button !== 0) return;

          if (e.target === e.currentTarget) {
            e.preventDefault();
            innerInputRef.current?.focus();
            innerTextareaRef.current?.focus();
            return;
          }
        }}
        ref={ref}
        className={styles.inputWrapper({ className: classNames?.inputWrapper })}
      >
        {!!startContent && !multiline && (
          <span
            className={styles.startContent({
              className: classNames?.startContent,
            })}
          >
            {startContent}
          </span>
        )}

        {!multiline ? null : (
          <textarea
            rows={5}
            {...restProps}
            className={styles.textarea({
              className: classNames?.textarea,
            })}
            ref={mergeRefs(innerTextareaRef, textareaRef)}
            {...sharedProps}
          ></textarea>
        )}

        {multiline ? null : (
          <input
            {...restProps}
            className={styles.input({ className: classNames?.input })}
            ref={mergeRefs(innerInputRef, inputRef)}
            {...sharedProps}
          />
        )}

        {!!endContent && !multiline && (
          <span
            className={styles.endContent({
              className: classNames?.endContent,
            })}
          >
            {endContent}
          </span>
        )}
      </div>

      {!error && helperText && (
        <div
          {...helperTextProps}
          id={helperTextId}
          className={styles.helperText({ className: classNames?.helperText })}
        >
          {helperText}
        </div>
      )}

      {error && errorMessage && (
        <div
          {...errorMessageProps}
          id={errorMessageId}
          aria-live="polite"
          className={styles.errorMessage({
            className: classNames?.errorMessage,
          })}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};

InputImpl.displayName = 'webbo-ui.Input';

export default forwardRef(InputImpl) as unknown as <
  Multiline extends boolean = false,
>(
  props: InputProps<Multiline> & React.RefAttributes<HTMLDivElement>,
) => React.ReactNode;
