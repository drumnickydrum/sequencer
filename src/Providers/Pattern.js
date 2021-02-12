import React, { useState } from 'react';
import { downtempo } from './defaultSequences';

export const SelectedSound = React.createContext();
export const SetSelectedSound = React.createContext();
export const Pattern = React.createContext();
export const SetPattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const [pattern, setPattern] = useState(downtempo.pattern);
  const [selectedSound, setSelectedSound] = useState(0);

  return (
    <SetPattern.Provider value={setPattern}>
      <SetSelectedSound.Provider value={setSelectedSound}>
        <SelectedSound.Provider value={selectedSound}>
          <Pattern.Provider value={pattern}>{children}</Pattern.Provider>
        </SelectedSound.Provider>
      </SetSelectedSound.Provider>
    </SetPattern.Provider>
  );
};
