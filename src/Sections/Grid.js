import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { Pattern } from '../Providers/Pattern';
import { Kit } from '../Providers/Kit';
import { SawIcon } from '../icons';

export const Grid = () => {
  const { patternRef, painting, prevCellRef, toggleEventsRef } = useContext(
    Pattern
  );

  const handleDrag = (e) => {
    if (!painting) return;
    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (cell) {
      const id = cell.id;
      if (!id.match(/cell/)) return;
      if (prevCellRef.current !== id) {
        document.dispatchEvent(toggleEventsRef.current[id]);
        prevCellRef.current = id;
      }
    }
  };

  return (
    <div id='grid' onTouchMove={handleDrag}>
      {patternRef.current.map((_, step) => {
        const id = `cell-${step}`;
        return <Cell key={id} id={id} step={step} />;
      })}
    </div>
  );
};

const Cell = ({ id, step }) => {
  const {
    patternRef,
    refreshAll,
    setRefreshAll,
    refreshEventsRef,
    prevCellRef,
    toggleEventsRef,
    toggleCell,
    selectedSound,
    modRef,
    modify,
    slicingRef,
    sliceStep,
  } = useContext(Pattern);
  const { kit } = useContext(Kit);

  const [refresh, setRefresh] = useState(true);

  const [color, setColor] = useState(-1);
  const [on, setOn] = useState(false);
  const [pitch, setPitch] = useState(24);
  const [velocity, setVelocity] = useState(1);
  const [length, setLength] = useState(1);
  const [slice, setSlice] = useState(1);

  useEffect(() => {
    if (selectedSound === -1) {
      if (on === true) setOn(false);
    } else {
      setColor(selectedSound);
      setOn(patternRef.current[step][selectedSound].noteOn);
      const { pitch, velocity, length } = patternRef.current[step][
        selectedSound
      ].notes[0];
      setPitch(pitch + kit.sounds[selectedSound].pitchMod);
      setVelocity(velocity * kit.sounds[selectedSound].velocityMod);
      setLength(length * kit.sounds[selectedSound].lengthMod);
      setSlice(patternRef.current[step][selectedSound].notes.length);
    }
    setRefresh(false);
    setRefreshAll(false);
  }, [
    selectedSound,
    refresh,
    refreshAll,
    step,
    kit,
    on,
    patternRef,
    setRefreshAll,
  ]);

  const handleToggle = useCallback(() => {
    if (selectedSound === -1) return;
    if (slicingRef.current) {
      if (on) {
        sliceStep(step);
        setSlice((slice) => (slice === 3 ? 1 : slice + 1));
      }
    } else {
      toggleCell(step);
    }
    setRefresh(true);
  }, [selectedSound, on, step, slicingRef, toggleCell, sliceStep]);

  const cellRef = useRef(null);
  useEffect(() => {
    if (cellRef.current) {
      const toggleEvent = new Event(`toggle-${id}`);
      document.addEventListener(`toggle-${id}`, handleToggle);
      toggleEventsRef.current[id] = toggleEvent;
      const refreshEvent = new Event(`refresh-${id}`);
      document.addEventListener(`refresh-${id}`, () => setRefresh(true));
      refreshEventsRef.current[id] = refreshEvent;
    }
    return () => document.removeEventListener(`toggle-${id}`, handleToggle);
  }, [id, toggleEventsRef, handleToggle, refreshEventsRef]);

  const handleTouchStart = (e) => {
    e.stopPropagation();
    if (modRef.current) {
      if (on) modStart(e);
    } else {
      prevCellRef.current = id;
      handleToggle();
    }
  };

  const prevVal = useRef(null);
  const xRef = useRef(null);
  const yRef = useRef(null);
  const modStart = (e) => {
    prevVal.current =
      modRef.current === 'pitch'
        ? pitch
        : modRef.current === 'velocity'
        ? velocity
        : length;
    xRef.current = e.changedTouches[0].clientX;
    yRef.current = e.changedTouches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!modRef.current || !on) return;
    e.stopPropagation();
    const newX = e.changedTouches[0].clientX;
    const newY = e.changedTouches[0].clientY;
    if (modRef.current === 'pitch') {
      if (newY - yRef.current > 1) {
        setPitch((pitch) => pitch - 1);
      } else if (newY - yRef.current < -1) {
        setPitch((pitch) => pitch + 1);
      }
    } else if (modRef.current === 'velocity') {
      if (newY - yRef.current > 1) {
        setVelocity((velocity) => velocity - 0.05);
      } else if (newY - yRef.current < -1) {
        setVelocity((velocity) => velocity + 0.05);
      }
    } else {
      if (newX - xRef.current > 1) {
        setLength((length) => length + 0.05);
      } else if (newX - xRef.current < -1) {
        setLength((length) => length - 0.05);
      }
    }
    xRef.current = newX;
    yRef.current = newY;
  };

  const handleTouchEnd = () => {
    if (modRef.current) {
      if (on) modEnd();
    } else {
      prevCellRef.current = null;
    }
  };

  const modEnd = () => {
    let newVal;
    if (modRef.current === 'pitch') {
      yRef.current = null;
      newVal = pitch;
      if (newVal < 12) {
        newVal = 12;
        setPitch(newVal);
      } else if (newVal > 36) {
        newVal = 36;
        setPitch(newVal);
      }
    } else if (modRef.current === 'velocity') {
      yRef.current = null;
      newVal = velocity;
      if (newVal < 0) {
        newVal = 0.1;
        setVelocity(newVal);
      } else if (newVal > 1) {
        newVal = 1;
        setVelocity(newVal);
      }
    } else {
      xRef.current = null;
      newVal = length;
      if (newVal < 0) {
        newVal = 0.01;
        setLength(newVal);
      } else if (newVal > 1) {
        newVal = 1;
        setLength(newVal);
      }
    }
    modify(prevVal.current, newVal, step);
  };

  // const cellMemo = useMemo(() => {
  // console.log('rendering cell: ', i);
  const modStyle = {
    opacity: on ? velocity : 1,
    width: `${100 * length}%`,
  };
  return (
    <div className='cell-wrapper'>
      <div
        ref={cellRef}
        id={id}
        className={on ? 'cell on' : 'cell'}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={on ? `cell-mods bg${color}` : ''} style={modStyle}>
          {on && pitch > 24 && <p className='pitch-up'>+{pitch - 24}</p>}
          {on && pitch < 24 && <p className='pitch-down'>{pitch - 24}</p>}
          {on && slice > 1 && (
            <div className={slice === 2 ? 'slice' : 'slice slice-3'}>
              <SawIcon />
            </div>
          )}
          {on && slice > 2 && (
            <div className='slice slice-2'>
              <SawIcon />
            </div>
          )}
        </div>
        <div className='sound-cells'>
          {kit.sounds.map((_, sound) => {
            const scId = `${id}-${sound}`;
            const color = patternRef.current[step][sound].noteOn
              ? `bg${sound}`
              : '';
            const velocity = patternRef.current[step][sound].notes[0];
            return (
              <SoundCell
                key={scId}
                id={scId}
                color={color}
                velocity={velocity}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
  // }, [color, on, pitch, velocity, length, pattern[step].updated]);

  // return cellMemo;
};

const SoundCell = ({ id, color, velocity }) => {
  // const soundCellMemo = useMemo(() => {
  // console.log('rendering soundCell: ', id);
  const classes = `sound-cell ${color}`;
  return <div id={id} className={classes} style={{ opacity: velocity }} />;
  // }, [velocity]);

  // return soundCellMemo;
};
