import { useState, useCallback, useRef } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UseHistoryResult<T> {
  state: T;
  set: (newState: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const useHistory = <T>(initialState: T, historyLimit: number = 50): UseHistoryResult<T> => {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });
  const isUpdatingRef = useRef(false); // Ref to prevent history updates during undo/redo

  const set = useCallback((newState: T) => {
    if (isUpdatingRef.current) {
      // If we are in the middle of an undo/redo, don't add to history
      isUpdatingRef.current = false;
      return;
    }

    setHistory(prevHistory => {
      const { past, present, future } = prevHistory;

      // If the new state is the same as the current state, don't add to history
      if (JSON.stringify(newState) === JSON.stringify(present)) {
        return prevHistory;
      }

      const newPast = [...past, present];
      // Limit history size
      if (newPast.length > historyLimit) {
        newPast.shift(); // Remove the oldest state
      }

      return {
        past: newPast,
        present: newState,
        future: [], // Clear future when a new state is set
      };
    });
  }, [historyLimit]);

  const undo = useCallback(() => {
    setHistory(prevHistory => {
      const { past, present, future } = prevHistory;
      if (past.length === 0) return prevHistory;

      isUpdatingRef.current = true; // Set flag to prevent `set` from adding to history
      const newPast = past.slice(0, past.length - 1);
      const newPresent = past[past.length - 1];
      const newFuture = [present, ...future];

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prevHistory => {
      const { past, present, future } = prevHistory;
      if (future.length === 0) return prevHistory;

      isUpdatingRef.current = true; // Set flag to prevent `set` from adding to history
      const newPast = [...past, present];
      const newPresent = future[0];
      const newFuture = future.slice(1);

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  return {
    state: history.present,
    set,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
};

export default useHistory;
