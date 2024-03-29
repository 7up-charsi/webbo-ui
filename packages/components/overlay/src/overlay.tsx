'use client';

import { OverlayVariantProps, overlay } from '@webbo-ui/theme';
import { forwardRef } from 'react';

export interface OverlayProps
  extends OverlayVariantProps,
    React.HTMLAttributes<HTMLDivElement> {}

const Overlay = forwardRef<HTMLDivElement, OverlayProps>((props, ref) => {
  const { className, variant = 'opaque', ...restProps } = props;

  const styles = overlay({ variant, className });

  return <div {...restProps} ref={ref} className={styles} />;
});

Overlay.displayName = 'webbo-ui.Overlay';

export default Overlay;
