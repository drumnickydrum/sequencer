import React from 'react';

import { PatternStateProvider } from './State/Pattern';
import { PatternFunctionProvider } from './Functions/Pattern';
import { PatternActionProvider } from './Actions/Pattern';

export const PatternProvider = ({ children }) => {
  return (
    <PatternStateProvider>
      <PatternFunctionProvider>
        <PatternActionProvider>{children} </PatternActionProvider>
      </PatternFunctionProvider>
    </PatternStateProvider>
  );
};
