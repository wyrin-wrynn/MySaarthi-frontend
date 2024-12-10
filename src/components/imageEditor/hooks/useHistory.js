import { useState, useRef } from 'react';
import { isArraysEqual } from '../utils/isArrayEqual';

export function useHistory(initialState) {
  const [elements, setElements] = useState(initialState);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const lastChange = useRef({ type: null, time: null }); // Track last change type and timestamp
  const debounceTimer = useRef(null); // Track debounced history saves

  const saveHistory = (newEls, changeType = 'general', debounce = false) => {
    const now = Date.now();

    if (debounce) {
      // Clear the previous timer to avoid premature saves
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Debounce the save: only save after 300ms of inactivity
      debounceTimer.current = setTimeout(() => {
        const last = history[history.length - 1];
        if (last && isArraysEqual(last, newEls)) {
          setElements(newEls);
          return;
        }

        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(newEls);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
        setElements(newEls);
        lastChange.current = { type: changeType, time: now };
      }, 300);

      setElements(newEls); // Update elements immediately for smooth UI
      return;
    }

    // Check if this change should be consolidated
    if (
      lastChange.current.type === changeType &&
      now - lastChange.current.time < 200 // Allow 200ms debounce for similar events
    ) {
      const updatedHistory = [...history];
      updatedHistory[historyStep] = newEls;
      setHistory(updatedHistory);
      setElements(newEls);
      return;
    }

    const last = history[history.length - 1];
    if (last && isArraysEqual(last, newEls)) {
      setElements(newEls);
      return;
    }

    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newEls);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    setElements(newEls);

    lastChange.current = { type: changeType, time: now };
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      setElements(history[newStep]);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      setElements(history[newStep]);
    }
  };

  return [elements, setElements, saveHistory, undo, redo, historyStep, history];
}
