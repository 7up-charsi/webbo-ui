import { forwardRef } from 'react';
import { SkeletonVariantProps, skeleton } from '@gist-ui/theme';
import { ClassValue } from 'tailwind-variants';

export interface SkeletonProps extends SkeletonVariantProps {
  className?: ClassValue;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>((props, ref) => {
  const { variant, className, animation } = props;

  const styles = skeleton({ variant, className, animation });

  return <div ref={ref} className={styles} />;
});

Skeleton.displayName = 'gist-ui.Skeleton';

export default Skeleton;
