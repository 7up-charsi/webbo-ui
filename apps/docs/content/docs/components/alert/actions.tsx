import { Alert } from '@webbo-ui/alert';
import { Button } from '@webbo-ui/button';

export default function App() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Alert color="info" onClose={() => {}}>
        This is `info` Alert with default action button.
      </Alert>

      <Alert
        color="warning"
        onClose={() => {}}
        action={
          <Button color="warning" size="sm">
            UNDO
          </Button>
        }
      >
        This is `warning` Alert with default action button.
      </Alert>
    </div>
  );
}