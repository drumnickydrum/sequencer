import React, { useState, useEffect, useContext, useRef } from 'react';
import { Knob } from '../icons/Knob';
import { SwipeVerticalIcon } from '../icons';
import { Info } from '../Providers/Info';
import { Undo } from '../Providers/UndoProvider';
import { Kit } from '../Providers/Kit';

export const SoundEdit = ({ selectedSound }) => {
  const { setInfo } = useContext(Info);
  const { kit, setRefreshMods } = useContext(Kit);
  const { addToKitUndo } = useContext(Undo);

  const [velocityVal, setVelocityVal] = useState(
    kit[selectedSound].velocityMod * 100
  );
  const [pitchVal, setPitchVal] = useState(
    Math.round(kit[selectedSound].pitchMod / 0.1) + 50
  );
  const [lengthVal, setLengthVal] = useState(
    kit[selectedSound].lengthMod * 100 + 0.1
  );

  useEffect(() => {
    kit[selectedSound].velocityMod = velocityVal * 0.01;
  }, [velocityVal]);

  useEffect(() => {
    let pitchMod = Math.round((pitchVal - 50) * 0.1);
    kit[selectedSound].pitchMod =
      pitchMod < -5 ? -5 : pitchMod > 5 ? 5 : pitchMod;
  }, [pitchVal]);

  useEffect(() => {
    kit[selectedSound].lengthMod = lengthVal * 0.01 + 0.01;
  }, [lengthVal]);

  const [y, setY] = useState(null);
  const prevModsRef = useRef({});
  const handleTouchStart = (e, type) => {
    prevModsRef.current = {
      pitchMod: kit[selectedSound].pitchMod,
      velocityMod: kit[selectedSound].velocityMod,
      lengthMod: kit[selectedSound].lengthMod,
    };
    setInfo({
      h: '',
      i: <SwipeVerticalIcon />,
      p: 'Swipe vertically to adjust',
      show: true,
    });
    setY(e.changedTouches[0].clientY);
  };

  const handleTouchMove = (e, type) => {
    const newY = e.changedTouches[0].clientY;
    if (newY - y > 1) {
      switch (type) {
        case 'velocity':
          setVelocityVal((val) => (val - 6 < 10 ? 10 : val - 6));
          break;
        case 'pitch':
          setPitchVal((val) => (val - 6 < 0 ? 0 : val - 6));
          break;
        case 'length':
          setLengthVal((val) => (val - 6 < 10 ? 10 : val - 6));
          break;
        default:
          return;
      }
    } else if (newY - y < -1) {
      switch (type) {
        case 'velocity':
          setVelocityVal((val) => (val + 6 > 100 ? 100 : val + 6));
          break;
        case 'pitch':
          setPitchVal((val) => (val + 6 > 100 ? 100 : val + 6));
          break;
        case 'length':
          setLengthVal((val) => (val + 6 > 100 ? 100 : val + 6));
          break;
        default:
          return;
      }
    }
    setY(newY);
  };

  const handleTouchEnd = (type) => {
    setInfo({ h: '', i: null, p: '', show: false });
    setY(null);
    let { pitchMod, velocityMod, lengthMod } = prevModsRef.current;
    let updated = false;
    if (type === 'velocity') {
      velocityMod = kit[selectedSound].velocityMod;
      if (velocityMod !== prevModsRef.current.velocityMod) updated = true;
    } else if (type === 'pitch') {
      pitchMod = kit[selectedSound].pitchMod;
      if (pitchMod !== prevModsRef.current.pitchMod) updated = true;
    } else {
      lengthMod = kit[selectedSound].lengthMod;
      if (lengthMod !== prevModsRef.current.lengthMod) updated = true;
    }
    const newMods = { pitchMod, velocityMod, lengthMod };
    if (updated) {
      setRefreshMods(true);
      addToKitUndo(prevModsRef.current, newMods, kit[selectedSound]);
      prevModsRef.current = { ...newMods };
    }
  };

  const handleReset = (type) => {
    if (type === 'velocity') setVelocityVal(100);
    if (type === 'pitch') setPitchVal(50);
    if (type === 'length') setLengthVal(100);
    setRefreshMods(true);
    addToKitUndo(
      prevModsRef.current,
      { pitchMod: 0, velocityMod: 1, lengthMod: 1 },
      kit[selectedSound]
    );
  };

  return (
    <div className='sound-edit'>
      <div className={`sample-edit color${selectedSound}`}>
        <div className='knob-wrapper'>
          <div
            className='knob'
            id='velocity-knob'
            onTouchStart={(e) => handleTouchStart(e, 'velocity')}
            onTouchMove={(e) => handleTouchMove(e, 'velocity')}
            onTouchEnd={() => handleTouchEnd('velocity')}
          >
            <label htmlFor='velocity-knob'>velocity</label>
            <Knob value={velocityVal} />
          </div>
          <p onClick={() => handleReset('velocity')}>reset</p>
        </div>
        <div className='knob-wrapper'>
          <div
            className='knob'
            id='pitch-knob'
            onTouchStart={(e) => handleTouchStart(e, 'pitch')}
            onTouchMove={(e) => handleTouchMove(e, 'pitch')}
            onTouchEnd={() => handleTouchEnd('pitch')}
          >
            <label htmlFor='pitch-knob'>pitch</label>

            <Knob value={pitchVal} />
          </div>
          <p onClick={() => handleReset('pitch')}>reset</p>
        </div>
        <div className='knob-wrapper'>
          <div
            className='knob'
            id='length-knob'
            onTouchStart={(e) => handleTouchStart(e, 'length')}
            onTouchMove={(e) => handleTouchMove(e, 'length')}
            onTouchEnd={() => handleTouchEnd('length')}
          >
            <label htmlFor='length-knob'>length</label>
            <Knob value={lengthVal} />
          </div>
          <p onClick={() => handleReset('length')}>reset</p>
        </div>
      </div>
    </div>
  );
};
