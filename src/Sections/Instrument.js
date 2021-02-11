import React, { useContext } from 'react';
import { Samples } from '../Providers/Samples';

export const Instrument = () => {
  const { samples, selectedSample, setSelectedSample } = useContext(Samples);
  return (
    <div id='instrument'>
      {Object.keys(samples).map((sample) => {
        return (
          <div
            key={`inst-panel-${sample}`}
            className={
              sample === selectedSample
                ? `instrument selected border${samples[selectedSample].color}`
                : 'instrument'
            }
            onClick={() => setSelectedSample(sample)}
          >
            {sample}
          </div>
        );
      })}
    </div>
  );
};
