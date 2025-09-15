import { useHotkeys } from 'react-hotkeys-hook';

export const useKeyboardShortcuts = (handlers: Record<string, (() => void) | undefined>) => {
  useHotkeys('ctrl+s', handlers['ctrl+s'] ?? (() => {}));
  useHotkeys('ctrl+z', handlers['ctrl+z'] ?? (() => {}));
  useHotkeys('ctrl+y', handlers['ctrl+y'] ?? (() => {}));
  useHotkeys('ctrl+shift+f', handlers['ctrl+shift+f'] ?? (() => {}));
};