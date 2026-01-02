import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';

interface NoteUserProps {
  text: string;
}

export function NoteUser({ text }: NoteUserProps) {
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();

  return (
    <p
      className="text-xs italic mt-1 leading-relaxed"
      style={{ color: currentTheme.textMuted }}
    >
      {text}
    </p>
  );
}
