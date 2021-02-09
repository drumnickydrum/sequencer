import React, { useState, useContext, useCallback } from 'react';
import { Sampler } from './Sampler';
import { downtempo } from './patterns';

export const Pattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const { setSampler } = useContext(Sampler);
  const [pattern, setPattern] = useState(downtempo.pattern);

  const scheduleCell = useCallback((time, step) => {
    for (const [inst, vol] of Object.entries(pattern[step.current])) {
      if (pattern[step.current][inst]) {
        setSampler((sampler) => {
          sampler[inst]?.triggerAttack('C2', time, vol / 2);
          return sampler;
        });
      }
    }
    step.current = step.current === pattern.length - 1 ? 0 : step.current + 1;
  });

  return (
    <Pattern.Provider value={{ setPattern, scheduleCell }}>
      {children}
    </Pattern.Provider>
  );
};
