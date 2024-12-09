// src/hooks/useHistory.js
import { useState } from 'react';

const useHistory = (initialState = []) => {
  const [history, setHistory] = useState([initialState]);
  const [historyStep, setHistoryStep] = useState(0);

  const saveHistory = (newState) => {
    const updatedHistory = history.slice(0, historyStep + 1);
    updatedHistory.push(newState);
    setHistory(updatedHistory);
    setHistoryStep(updatedHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      return history[historyStep - 1];
    }
    return history[historyStep];
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      return history[historyStep + 1];
    }
    return history[historyStep];
  };

  const canUndo = historyStep > 0;
  const canRedo = historyStep < history.length - 1;

  return { history, saveHistory, undo, redo, canUndo, canRedo };
};

export default useHistory;
