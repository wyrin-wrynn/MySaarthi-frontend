// src/hooks/useElements.js
import { useState } from 'react';

const useElements = (initialElements = [], saveHistory) => {
  const [elements, setElements] = useState(initialElements);

  const addElement = (element) => {
    const newElements = [...elements, element];
    setElements(newElements);
    saveHistory(newElements);
  };

  const updateElement = (id, updatedAttrs) => {
    const newElements = elements.map((el) =>
      el.id === id ? { ...el, ...updatedAttrs } : el
    );
    setElements(newElements);
    saveHistory(newElements);
  };

  const deleteElement = (id) => {
    const newElements = elements.filter((el) => el.id !== id);
    setElements(newElements);
    saveHistory(newElements);
  };

  return { elements, addElement, updateElement, deleteElement };
};

export default useElements;
