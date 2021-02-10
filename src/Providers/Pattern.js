import React, { useState, useContext, useCallback } from 'react';
import { Samples } from './Samples';
import { downtempo } from './defaultSequences';

export const Pattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const { setSamples } = useContext(Samples);
  const [pattern, setPattern] = useState(downtempo.pattern);

  const scheduleCell = useCallback((time, step) => {
    for (const [inst, vol] of Object.entries(pattern[step.current])) {
      if (pattern[step.current][inst]) {
        setSamples((samples) => {
          samples[inst]?.sampler.triggerAttack('C2', time, vol / 2);
          return samples;
        });
      }
    }
    step.current = step.current === pattern.length - 1 ? 0 : step.current + 1;
  });

  return (
    <Pattern.Provider value={{ pattern, setPattern, scheduleCell }}>
      {children}
    </Pattern.Provider>
  );
};
