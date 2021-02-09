import React, { useState, useContext } from 'react';
import { SetSamplers } from './Samplers';
import { downtempo } from './patterns';

export const Pattern = React.createContext();
export const SetPattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const { setSamplers } = useContext(SetSamplers);
  const [pattern, setPattern] = useState(downtempo.pattern);

  const triggerCell = (time, step) => {
    for (const [inst, vol] of Object.entries(pattern[step.current])) {
      if (pattern[step.current][inst]) {
        setSamplers((samplers) => {
          samplers[inst]?.triggerAttack('C2', time, vol / 2);
          return samplers;
        });
      }
    }
    step.current = step.current === pattern.length - 1 ? 0 : step.current + 1;
  };

  return (
    <SetPattern.Provider value={{ setPattern, triggerCell }}>
      <Pattern.Provider value={{ pattern }}>{children}</Pattern.Provider>
    </SetPattern.Provider>
  );
};
