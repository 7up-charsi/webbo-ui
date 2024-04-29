import React from 'react';
import {
  Button,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverPortal,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from '../src';

const meta = {
  title: 'Components/Popover',
  args: {
    defaultOpen: true,
  },
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'right',
        'bottom',
        'left',
        'top-end',
        'top-start',
        'right-end',
        'right-start',
        'bottom-end',
        'bottom-start',
        'left-end',
        'left-start',
      ],
    },
    sticky: {
      control: 'select',
      options: ['partial', 'always'],
    },
  },
};

export default meta;

const Template = (args) => {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: 'instant',
      block: 'center',
      inline: 'center',
    });
  }, []);

  return (
    <div className="w-[300vw] h-[300vh] flex items-center justify-center">
      <PopoverRoot defaultOpen={args.defaultOpen}>
        <PopoverTrigger>
          <Button ref={ref}>open popver</Button>
        </PopoverTrigger>

        <PopoverPortal>
          <PopoverContent
            alignOffset={args.alignOffset}
            arrow={args.arrow}
            mainOffset={args.mainOffset}
            sticky={args.sticky}
            placement={args.placement}
            arrowPadding={args.arrowPadding}
            hideWhenDetached={args.hideWhenDetached}
            allowMainAxisFlip={args.allowMainAxisFlip}
            allowCrossAxisFlip={args.allowCrossAxisFlip}
          >
            {args.arrow && <PopoverArrow />}

            <PopoverTitle>Lorem ipsum dolor</PopoverTitle>

            <PopoverDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis
              aperiam facere, molestias eius suscipit in, est distinctio
              deserunt culpa odit, sunt nostrum. Ad culpa excepturi assumenda
              perferendis similique dolore qui.
            </PopoverDescription>

            <div className="pt-3 flex gap-2 justify-end">
              <PopoverClose>
                <Button variant="text" color="danger">
                  Close
                </Button>
              </PopoverClose>

              <Button color="success">Agree</Button>
            </div>
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
    </div>
  );
};

export const Default = {
  render: Template,
  args: {
    alignOffset: 0,
    mainOffset: 0,
    arrowPadding: 10,
    hideWhenDetached: true,
    boundaryPadding: 0,
    sticky: 'partial',
    placement: 'bottom',
    arrow: true,
    allowMainAxisFlip: true,
    allowCrossAxisFlip: true,
  },
};