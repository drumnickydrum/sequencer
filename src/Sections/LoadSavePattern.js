import React, { useContext } from 'react';
import { Pattern } from '../Providers/Pattern';
import { LoadPattern } from './LoadPattern';
import { SavePattern } from './SavePattern';

export const LoadSavePattern = () => {
  const { showLoad, setShowLoad } = useContext(Pattern);
  return (
    <div className={showLoad ? 'load-save-pattern show' : 'load-save-pattern'}>
      <LoadPattern />
      <SavePattern />
      <button onClick={() => setShowLoad(false)}>close</button>
    </div>
  );
};
