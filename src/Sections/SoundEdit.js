import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  LengthIcon,
  PitchIcon,
  SwipeVerticalIcon,
  VelocityIcon,
} from '../icons';
import { Info } from '../Providers/Info';
import { Undo } from '../Providers/UndoProvider';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';

export const SoundEdit = ({ mod, finish }) => {
  const { setInfo } = useContext(Info);
  const { kit } = useContext(Kit);
  const { selectedSound, setRefreshAll } = useContext(Pattern);
  const { addToModsUndo } = useContext(Undo);

  const [velocityVal, setVelocityVal] = useState(
    kit[selectedSound].velocityMod * 100
  );
  const [pitchVal, setPitchVal] = useState(
    Math.round(kit[selectedSound].pitchMod / 0.1) + 50
  );
  const [lengthVal, setLengthVal] = useState(
    kit[selectedSound].lengthMod * 100
  );

  useEffect(() => {
    kit[selectedSound].velocityMod = velocityVal * 0.01;
  }, [kit, selectedSound, velocityVal]);

  useEffect(() => {
    let pitchMod = Math.round((pitchVal - 50) * 0.1);
    kit[selectedSound].pitchMod =
      pitchMod < -5 ? -5 : pitchMod > 5 ? 5 : pitchMod;
  }, [kit, selectedSound, pitchVal]);

  useEffect(() => {
    kit[selectedSound].lengthMod = lengthVal * 0.01;
  }, [kit, selectedSound, lengthVal]);

  const handleChange = ({ target: { value } }) => {
    console.log(value);
  };

  return (
    <div className='sound-edit'>
      <div className={`sample-edit color${selectedSound}`}>
        {mod === 'pitch' ? (
          <PitchIcon />
        ) : mod === 'velocity' ? (
          <VelocityIcon />
        ) : (
          <LengthIcon />
        )}
        <div className='mod-slider-div'>
          <p>Use slider to adjust all cells</p>
          <input
            className={mod === 'length' ? '' : 'deg270'}
            type='range'
            onChange={handleChange}
          />
          <p>
            or {mod === 'length' ? ' horizontally ' : ' vertically '}drag
            individual cell
          </p>
        </div>
      </div>
    </div>
  );
};
