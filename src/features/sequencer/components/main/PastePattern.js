import React, { useContext, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Kit } from '../../providers/Kit';
import * as icons from '../../../../icons/kit';
import { MODES } from '../../reducers/editModeSlice';
import { paste } from '../../reducers/sequencerSlice';

export const PastePattern = () => {
  const { kitRef } = useContext(Kit);

  const mode = useSelector((state) => state.editMode.mode);
  const pasting = mode === MODES.COPYING;

  const pastePatternMemo = useMemo(() => {
    console.log('rendering: PastePattern');
    return (
      <div id='paste-pattern' className={pasting ? 'show' : ''}>
        <div id='paste-pattern-sounds'>
          {kitRef.current.sounds.map((sound, i) => {
            return (
              <SoundBtn
                key={`paste-pattern-${sound.name}`}
                i={i}
                sound={sound}
              />
            );
          })}
        </div>
      </div>
    );
  }, [kitRef, pasting]);
  return pastePatternMemo;
};

const SoundBtn = ({ i, sound }) => {
  const dispatch = useDispatch();
  const selectedSound = useSelector((state) => state.editMode.selectedSound);
  const pattern = useSelector((state) => state.sequencer.present.pattern);
  const ref = useRef(null);

  const soundBtnMemo = useMemo(() => {
    const onClick = () => {
      dispatch(paste({ sound: i, selectedSound }));
      if (ref.current) {
        ref.current.classList.add('selected');
        setTimeout(() => ref.current.classList.remove('selected'));
      }
    };

    let classes = `sound borderDefault`;
    const selected = i === selectedSound;
    if (selected) classes += ' flashing';

    console.log('rendering: SoundBtn');
    return (
      <div className={classes} onClick={onClick}>
        {selected ? (
          <p className='flashing'>copying...</p>
        ) : (
          <div className='paste-icon-wrapper'>
            {icons[sound.icon](sound.color)}
          </div>
        )}
        <div ref={ref} className={selected ? 'cells selected' : 'cells'}>
          {pattern.map((step, s) => {
            const classes = step[i].noteOn ? `cell bg${i} on` : 'cell';
            return <div key={`paste-pattern-${s}-${i}`} className={classes} />;
          })}
        </div>
        <div className='border-flashing' />
      </div>
    );
  }, [dispatch, i, pattern, selectedSound, sound.color, sound.icon]);
  return soundBtnMemo;
};
