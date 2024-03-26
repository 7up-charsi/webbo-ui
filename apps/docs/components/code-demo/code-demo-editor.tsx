import Editor from 'react-simple-code-editor';
import { focusWithIn } from '@webbo-ui/theme';
import { useCodeDemoContext } from './code-demo-provider';
import { highlightCode } from '@/lib/highlight-code';

export const CodeDemoEditor = () => {
  const { code, onCodeChange, language } = useCodeDemoContext('CodeDemoEditor');

  return (
    <Editor
      lang={language}
      value={code}
      onValueChange={onCodeChange}
      highlight={(code) => `<code>${highlightCode(code, language)}</code>`}
      className={`code-demo-editor min-w-full rounded-b border border-t-0 border-inherit hover:ring-2 hover:ring-focus-8 ${focusWithIn}`}
      padding={20}
      textareaClassName="outline-none"
    />
  );
};

CodeDemoEditor.displayName = 'CodeDemoEditor';