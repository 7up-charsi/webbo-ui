'use client';

import { createContextScope } from '@webbo-ui/context';
import { Slot } from '@webbo-ui/slot';
import { useSize } from '@webbo-ui/use-size';
import { forwardRef, useEffect, useState } from 'react';
import {
  Boundary,
  DetectOverflowOptions,
  FlipOptions,
  Padding,
  Side,
  UseFloatingOptions,
  UseFloatingReturn,
  arrow as arrowMiddleware,
  autoUpdate,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react-dom';
import { mergeRefs } from '@webbo-ui/react-utils';

interface PopperContext {
  reference: HTMLElement | null;
  setReference: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

const Popper_Name = 'Popper.Root';

const [Provider, useContext] = createContextScope<PopperContext>(Popper_Name);

export interface PopperProps {
  children?: React.ReactNode;
}

export const Root = (props: PopperProps) => {
  const { children } = props;

  const [reference, setReference] = useState<HTMLElement | null>(null);

  return (
    <Provider reference={reference} setReference={setReference}>
      {children}
    </Provider>
  );
};

Root.displayName = 'webbo-ui.' + Popper_Name;

const Reference_Name = 'Popper.Reference';

export interface ReferenceProps {
  children?:
    | React.ReactNode
    | ((props: {
        referenceRef: PopperContext['setReference'];
      }) => React.ReactNode);
  /**
   * Position a floating element relative to a custom reference area, useful for context menus, range selections, following the cursor, and more.
   *
   * @see {@link https://floating-ui.com/docs/virtual-elements virtual-elements}
   *
   * @default false
   */
  virturalElement?: HTMLElement | null;
}

export const Reference = (props: ReferenceProps) => {
  const { children, virturalElement } = props;

  const context = useContext(Reference_Name);

  useEffect(() => {
    if (virturalElement) context.setReference(virturalElement);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virturalElement]);

  return virturalElement ? null : typeof children === 'function' ? (
    children({ referenceRef: context.setReference })
  ) : (
    <Slot ref={context.setReference}>{children}</Slot>
  );
};

Reference.displayName = 'webbo-ui.' + Reference_Name;

const Floating_Name = 'Popper.Reference';

interface ArrowContext {
  side: Side;
  arrowX?: number;
  arrowY?: number;
  setArrow: React.Dispatch<React.SetStateAction<HTMLSpanElement | null>>;
  shouldHideArrow: boolean;
}

const [ArrowProvider, useArrowContext] =
  createContextScope<ArrowContext>(Floating_Name);

export interface FloatingProps {
  children?:
    | React.ReactNode
    | ((props: {
        floatingRef: UseFloatingReturn['refs']['setFloating'];
        style: React.CSSProperties;
      }) => React.ReactNode);
  placement?: UseFloatingOptions['placement'];
  updatePositionStrategy?: 'optimized' | 'always';
  /**
   * Represents the distance (gutter or margin) between the floating element and the reference element
   *
   * @see {@link https://floating-ui.com/docs/offset#mainaxis mainaxis}
   * @default 0
   */
  mainOffset?: number;
  /**
   * Represents the skidding between the floating element and the reference element
   *
   * @see {@link https://floating-ui.com/docs/offset#alignmentaxis alignmentaxis}
   * @default 0
   */
  alignOffset?: number;
  arrow?: boolean;
  /**
   * This describes the padding between the arrow and the edges of the floating element. If your floating element has border-radius, this will prevent it from overflowing the corners.
   *
   * @see {@link https://floating-ui.com/docs/arrow#padding padding}
   * @default 0
   */
  arrowPadding?: number;
  sticky?: 'partial' | 'always';
  hideWhenDetached?: boolean;
  /**
   * @see {@link https://floating-ui.com/docs/flip#fallbackplacements fallbackPlacements}
   */
  fallbackPlacements?: FlipOptions['fallbackPlacements'];
  /**
   * @see {@link https://floating-ui.com/docs/flip#mainaxis mainAxis}
   * @default true
   */
  allowMainAxisFlip?: boolean;
  /**
   * when "sticky" prop is "partial" then its value will be false and it will not effect
   *
   * @see {@link https://floating-ui.com/docs/flip#crossaxis crossAxis}
   * @default true
   */
  allowCrossAxisFlip?: boolean;
  /**
   * This describes the virtual padding around the boundary to check for overflow.
   *
   * @see {@link https://floating-ui.com/docs/detectoverflow#padding padding}
   * @default 0
   */
  boundaryPadding?: Padding;
  /**
   * This describes the clipping element(s) or area that overflow will be checked relative to.
   *
   * @see {@link https://floating-ui.com/docs/detectoverflow#boundary boundary}
   * @default clippingAncestors
   */
  clippingBoundary?: Boundary;
}

export const Floating = forwardRef<HTMLElement, FloatingProps>((props, ref) => {
  const {
    children,
    placement: placementProp,
    updatePositionStrategy = 'optimized',
    mainOffset = 0,
    alignOffset = 0,
    arrow: arrowProp = true,
    arrowPadding = 0,
    sticky = 'partial',
    hideWhenDetached = true,
    fallbackPlacements,
    allowCrossAxisFlip = true,
    allowMainAxisFlip = true,
    boundaryPadding = 0,
    clippingBoundary = 'clippingAncestors',
  } = props;

  const context = useContext(Floating_Name);
  const [arrow, setArrow] = useState<HTMLSpanElement | null>(null);
  const arrowSize = useSize(arrow);
  const referenceSize = useSize(context.reference);

  const detectOverflow: DetectOverflowOptions = {
    padding:
      typeof boundaryPadding === 'number'
        ? boundaryPadding
        : { top: 0, left: 0, right: 0, bottom: 0, ...boundaryPadding },
    boundary: clippingBoundary,
  };

  const { middlewareData, placement, floatingStyles, refs } = useFloating({
    strategy: 'fixed',
    placement: placementProp,
    elements: { reference: context.reference },
    whileElementsMounted: (...args) =>
      autoUpdate(...args, {
        animationFrame: updatePositionStrategy === 'always',
      }),
    middleware: [
      offset({
        mainAxis: mainOffset + (arrowSize?.height ?? 0),
        alignmentAxis: alignOffset,
      }),
      !allowMainAxisFlip && !allowCrossAxisFlip
        ? false
        : flip({
            fallbackPlacements,
            mainAxis: allowMainAxisFlip,
            crossAxis: sticky === 'partial' ? false : allowCrossAxisFlip,
            ...detectOverflow,
          }),
      sticky === 'partial' &&
        shift({
          ...detectOverflow,
          limiter: limitShift({
            offset: ({ placement, elements }) =>
              placement.includes('top') || placement.includes('bottom')
                ? elements.reference.offsetWidth / 2
                : elements.reference.offsetHeight / 2,
          }),
        }),
      arrowProp && arrowMiddleware({ padding: arrowPadding, element: arrow }),
      hideWhenDetached &&
        hide({ strategy: 'referenceHidden', ...detectOverflow }),
    ],
  });

  const arrowData = middlewareData.arrow;
  const hideData = middlewareData.hide;

  const childrenProps = {
    floatingRef: refs.setFloating,
    style: {
      ...floatingStyles,
      visibility: (hideData?.referenceHidden
        ? 'hidden'
        : 'visible') as React.CSSProperties['visibility'],
      '--reference-width': `${referenceSize?.width}px`,
      '--reference-height': `${referenceSize?.height}px`,
    },
  };

  return (
    <ArrowProvider
      arrowX={arrowData?.x}
      arrowY={arrowData?.y}
      side={placement.split('-')[0] as Side}
      setArrow={setArrow}
      shouldHideArrow={!!hideData?.referenceHidden}
    >
      {typeof children === 'function' ? (
        children(childrenProps)
      ) : (
        <Slot<HTMLElement, React.HTMLAttributes<HTMLElement>>
          ref={mergeRefs(refs.setFloating, ref)}
          style={childrenProps.style}
        >
          {children}
        </Slot>
      )}
    </ArrowProvider>
  );
});

Floating.displayName = 'webbo-ui.' + Floating_Name;

const Arrow_Name = 'Popper.Arrow';

const OPPOSITE_SIDE: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

export const Arrow = forwardRef<
  SVGSVGElement,
  React.SVGAttributes<SVGSVGElement>
>((props, ref) => {
  const context = useArrowContext(Arrow_Name);
  const baseSide = OPPOSITE_SIDE[context.side];

  return (
    <span
      ref={context.setArrow}
      style={{
        position: 'absolute',
        left: context.arrowX,
        top: context.arrowY,
        [baseSide]: 0,
        transformOrigin: {
          top: '',
          right: '0 0',
          bottom: 'center 0',
          left: '100% 0',
        }[context.side],
        transform: {
          top: 'translateY(100%)',
          right: 'translateY(50%) rotate(90deg) translateX(-50%)',
          bottom: `rotate(180deg)`,
          left: 'translateY(50%) rotate(-90deg) translateX(50%)',
        }[context.side],
        visibility: context.shouldHideArrow ? 'hidden' : 'visible',
      }}
    >
      <svg
        {...props}
        width={props.width || 9}
        height={props.height || 5}
        ref={ref}
        viewBox="0 0 30 10"
        preserveAspectRatio="none"
        style={{ ...props.style, fill: 'var(--arrowFill)' }}
      >
        <polygon points="0,0 30,0 15,10" />
      </svg>
    </span>
  );
});

Arrow.displayName = 'webbo-ui.' + Arrow_Name;
