// ScoreContext.js
import React, { createContext, useState } from 'react';

export const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);

  return (
    <ScoreContext.Provider value={{ score, setScore, timer, setTimer }}>
      {children}
    </ScoreContext.Provider>
  );
};
