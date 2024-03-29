'use client';

import { forwardRef, useId } from 'react';
import { RadioClassNames, RadioVariantProps, radio } from '@webbo-ui/theme';
import { Icon } from '@webbo-ui/icon';

const icon_svg = (
  <Icon>
    <svg fill="none" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 19.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zm0 1.5a9 9 0 100-18 9 9 0 000 18z"
        clipRule="evenodd"
      ></path>
    </svg>
  </Icon>
);

const checked_svg = (
  <Icon>
    <svg fill="none" viewBox="0 0 24 24">
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M12 19.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zm0 1.5a9 9 0 100-18 9 9 0 000 18z"
          clipRule="evenodd"
        ></path>
        <circle cx="12" cy="12" r="5.25"></circle>
      </g>
    </svg>
  </Icon>
);

export interface RadioProps
  extends RadioVariantProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color' | 'size'> {
  classNames?: RadioClassNames;
  label?: string;
  icon?: React.ReactNode;
  checkedIcon?: React.ReactNode;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const {
    classNames,
    className,
    label,
    id: idProp,
    checked,
    icon = icon_svg,
    checkedIcon = checked_svg,
    size = 'md',
    color = 'primary',
    labelPlacement = 'right',
    ...inpuProps
  } = props;

  const autoId = useId();
  const id = idProp ?? autoId;

  const styles = radio({ labelPlacement, color, size });

  return (
    <div className={styles.base({ className: classNames?.base ?? className })}>
      <div className={styles.radio({ className: classNames?.radio })}>
        <input
          {...inpuProps}
          checked={checked}
          id={id}
          ref={ref}
          type="radio"
          className={styles.input({ className: classNames?.input })}
        />

        <div className={styles.icon({ className: classNames?.icon })}>
          {icon}
        </div>
        <div
          className={styles.checkedIcon({ className: classNames?.checkedIcon })}
        >
          {checkedIcon}
        </div>
      </div>

      {label && (
        <label
          htmlFor={id}
          className={styles.label({ className: classNames?.label })}
        >
          {label}
        </label>
      )}
    </div>
  );
});

Radio.displayName = 'webbo-ui.Radio';

export default Radio;
