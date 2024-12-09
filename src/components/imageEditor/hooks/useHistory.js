// components/imageEditor/hooks/useHistory.js
import { useState } from 'react';
import { isArraysEqual } from '../utils/isArraysEqual';

export function useHistory(initialState) {
  const [elements, setElements] = useState(initialState);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const saveHistory = (newEls) => {
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
  };

  // Initialize empty state once
  if (historyStep === -1 && history.length === 0) {
    saveHistory([]);
  }

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
