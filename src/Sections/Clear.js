import React, { useContext } from 'react';
import { Pattern } from '../Providers/Pattern';

export const Clear = () => {
  const { clearPattern, printPattern } = useContext(Pattern);

  return (
    <div id='clear'>
      <p>Clear: </p>
      <button id='clear-sound' onClick={() => clearPattern(true)}>
        Sound
      </button>
      <button id='clear-all' onClick={() => clearPattern()}>
        All
      </button>
      <p>Print: </p>
      <button id='pattern-btn' onClick={printPattern}>
        Pattern
      </button>
    </div>
  );
};
