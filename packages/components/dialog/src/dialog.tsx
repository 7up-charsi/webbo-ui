'use client';

import { useControllableState } from '@webbo-ui/use-controllable-state';
import { Slot } from '@webbo-ui/slot';
import { useClickOutside } from '@webbo-ui/use-click-outside';
import { mergeRefs } from '@webbo-ui/react-utils';
import { useScrollLock } from '@webbo-ui/use-scroll-lock';
import { useCallbackRef } from '@webbo-ui/use-callback-ref';
import { createPortal } from 'react-dom';
import { FocusTrap, FocusScope } from '@webbo-ui/focus-trap';
import { createContextScope } from '@webbo-ui/context';
import { forwardRef, useEffect, useId, useMemo, useRef } from 'react';
import { VisuallyHidden } from '@webbo-ui/visually-hidden';
import { DialogVariantProps, dialog } from '@webbo-ui/theme';
import { usePointerEvents } from '@webbo-ui/use-pointer-events';

type Reason = 'pointer' | 'escape' | 'outside' | 'virtual';

type CloseEvent = { preventDefault(): void };

interface RootContext {
  handleOpen: () => void;
  handleClose: (reason: Reason) => void;
  isOpen: boolean;
  focusScope: FocusScope;
  keepMounted: boolean;
  contentId: string;
  titleId: string;
  descriptionId: string;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const Root_Name = 'Dialog.Root';

const [RootProvider, useRootContext] =
  createContextScope<RootContext>(Root_Name);

const [StylesProvider, useStylesContext] =
  createContextScope<ReturnType<typeof dialog>>(Root_Name);

// *-*-*-*-* Root *-*-*-*-*

export interface RootProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
  /**
   * reason param could be "pointer" | "escape" | "outside" | "virtual"
   * 1. when dialog closed on interaction with `Close` component then reason is "pointer"
   * 2. when dialog closed on interaction outside `Content` component then reason is "outside"
   * 2. when dialog closed on Escape keypress then reason is "escape"
   * 2. when dialog closed on interaction with visually hidden close button then reason is "virtual" and this will only happen when screen reader read dialog content and close press close button
   *
   * This callback can be used to prevent close conditionally
   * if you want to prevent close when Escape is pressed then do this
   * ```
   *  onClose={(e, reason) => {
   *   if (reason === 'escape') e.preventDefault();
   *  }}
   * ```
   *
   * @default undefined
   */
  onClose?: (event: CloseEvent, reason: Reason) => void;
  /**
   * When this prop is true, all content stays in the DOM and only css visiblity changes on open/close
   *
   * @default false
   */
  keepMounted?: boolean;
}

export const Root = (props: RootProps) => {
  const {
    children,
    isOpen: isOpenProp,
    defaultOpen,
    onOpenChange,
    onClose,
    keepMounted = false,
  } = props;

  const contentId = useId();
  const titleId = useId();
  const descriptionId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const focusScope = useRef<FocusScope>({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    },
  }).current;

  const [isOpen, setOpen] = useControllableState({
    defaultValue: defaultOpen ?? false,
    value: isOpenProp,
    onChange: onOpenChange,
  });

  const handleOpen = useCallbackRef(() => {
    setOpen(true);
  });

  const handleClose = useCallbackRef((reason: Reason) => {
    if (focusScope.paused) return;

    const eventObj = { defaultPrevented: false };

    const preventDefault = () => {
      eventObj.defaultPrevented = true;
    };

    onClose?.({ preventDefault }, reason);

    if (!eventObj.defaultPrevented) setOpen(false);
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose('escape');
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleClose, isOpen]);

  return (
    <RootProvider
      handleClose={handleClose}
      handleOpen={handleOpen}
      isOpen={isOpen}
      focusScope={focusScope}
      keepMounted={keepMounted}
      contentId={contentId}
      titleId={titleId}
      descriptionId={descriptionId}
      triggerRef={triggerRef}
    >
      {children}
    </RootProvider>
  );
};

Root.displayName = 'webbo-ui.' + Root_Name;

// *-*-*-*-* Trigger *-*-*-*-*

const Trigger_Name = 'Dialog.Trigger';

export interface TriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
  (props, ref) => {
    const { onPointerDown, onPointerUp, ...restProps } = props;

    const rootContext = useRootContext(Trigger_Name);

    const pointerEvents = usePointerEvents({
      onPress: rootContext.handleOpen,
      onPointerDown,
      onPointerUp,
    });

    return (
      <Slot
        {...restProps}
        ref={mergeRefs(ref, rootContext.triggerRef)}
        aria-expanded={rootContext.isOpen}
        aria-controls={rootContext.isOpen ? rootContext.contentId : undefined}
        {...pointerEvents}
      />
    );
  },
);

Trigger.displayName = 'webbo-ui.' + Trigger_Name;

// *-*-*-*-* Close *-*-*-*-*

const Close_Name = 'Dialog.Close';

export interface CloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Close = forwardRef<HTMLButtonElement, TriggerProps>(
  (props, ref) => {
    const { onPointerDown, onPointerUp, ...restProps } = props;

    const { handleClose } = useRootContext(Close_Name);

    const pointerEvents = usePointerEvents({
      onPress: () => {
        handleClose('pointer');
      },
      onPointerDown,
      onPointerUp,
    });

    return <Slot {...restProps} {...pointerEvents} ref={ref} />;
  },
);

Close.displayName = 'webbo-ui.' + Close_Name;

// *-*-*-*-* Portal *-*-*-*-*

const Portal_Name = 'Dialog.Portal';

export interface PortalProps {
  children?: React.ReactNode;
  container?: HTMLElement;
}

export const Portal = (props: PortalProps) => {
  const { children, container = globalThis?.document?.body } = props;

  const rootContext = useRootContext(Portal_Name);

  if (rootContext.keepMounted) {
    return createPortal(
      <div style={{ visibility: rootContext.isOpen ? 'visible' : 'hidden' }}>
        {children}
      </div>,
      container,
    );
  }

  return rootContext.isOpen ? createPortal(children, container) : null;
};

Portal.displayName = 'webbo-ui.' + Portal_Name;

// *-*-*-*-* Title *-*-*-*-*

const Title_Name = 'Dialog.Title';

export interface TitleProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Title = forwardRef<HTMLDivElement, TitleProps>((props, ref) => {
  const { className, ...restProps } = props;

  const rootContext = useRootContext(Title_Name);
  const styles = useStylesContext(Description_Name);

  return (
    <div
      {...restProps}
      ref={ref}
      id={rootContext.titleId}
      className={styles.title({ className })}
    />
  );
});

Title.displayName = 'webbo-ui.' + Title_Name;

// *-*-*-*-* Description *-*-*-*-*

const Description_Name = 'Dialog.Description';

export interface DescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const Description = forwardRef<HTMLDivElement, TitleProps>(
  (props, ref) => {
    const { className, ...restProps } = props;

    const rootContext = useRootContext(Description_Name);
    const styles = useStylesContext(Description_Name);

    return (
      <div
        {...restProps}
        ref={ref}
        id={rootContext.descriptionId}
        className={styles.description({ className })}
      />
    );
  },
);

Description.displayName = 'webbo-ui.' + Description_Name;

// *-*-*-*-* Content *-*-*-*-*

const Content_Name = 'Dialog.Content';

export interface ContentProps
  extends DialogVariantProps,
    React.HTMLAttributes<HTMLDivElement> {
  noA11yTitle?: boolean;
  noA11yDescription?: boolean;
}

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  (props, ref) => {
    const {
      children,
      className,
      noA11yDescription,
      noA11yTitle,
      shadow,
      ...restProps
    } = props;

    const rootContext = useRootContext(Content_Name);

    useScrollLock();

    const setOutsideEle = useClickOutside({
      callback: (e) => {
        if (rootContext.triggerRef.current?.contains(e.target as Node)) return;
        if ((e.target as HTMLElement).closest('[role=dialog]')) return;

        rootContext.handleClose('outside');
      },
    });

    const styles = useMemo(() => dialog({ shadow }), [shadow]);

    return (
      <StylesProvider {...styles}>
        <FocusTrap
          loop
          trapped
          focusScope={rootContext.focusScope}
          disabled={!rootContext.isOpen}
          asChild
        >
          <div
            {...restProps}
            ref={mergeRefs(ref, setOutsideEle)}
            role="dialog"
            aria-labelledby={noA11yTitle ? undefined : rootContext.titleId}
            aria-describedby={
              noA11yDescription ? undefined : rootContext.descriptionId
            }
            aria-modal={true}
            id={rootContext.contentId}
            className={styles.content({ className })}
          >
            <VisuallyHidden>
              <button onPointerUp={() => rootContext.handleClose('virtual')}>
                close
              </button>
            </VisuallyHidden>

            {children}

            <VisuallyHidden>
              <button onPointerUp={() => rootContext.handleClose('virtual')}>
                close
              </button>
            </VisuallyHidden>
          </div>
        </FocusTrap>
      </StylesProvider>
    );
  },
);

Content.displayName = 'webbo-ui.' + Content_Name;
