// Hook para undo/redo
import { useRef, useState } from 'react';

export function useUndoRedo<T>(initial: T) {
  const [state, setState] = useState(initial);
  const history = useRef<T[]>([initial]);
  const pointer = useRef(0);

  const set = (value: T) => {
    history.current = history.current.slice(0, pointer.current + 1);
    history.current.push(value);
    pointer.current++;
    setState(value);
  };

  const undo = () => {
    if (pointer.current > 0) {
      pointer.current--;
      setState(history.current[pointer.current]);
    }
  };

  const redo = () => {
    if (pointer.current < history.current.length - 1) {
      pointer.current++;
      setState(history.current[pointer.current]);
    }
  };

  return { state, set, undo, redo, canUndo: pointer.current > 0, canRedo: pointer.current < history.current.length - 1 };
}
