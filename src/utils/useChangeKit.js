import { useContext } from 'react';
import * as Tone from 'tone';
import * as kits from '../defaults/defaultKits';
import { Kit } from '../Providers/Kit';
import { SetSequencer } from '../Providers/Sequencer';

export const useChangeKit = () => {
  const {
    kitRef,
    setCurrentKit,
    disposeSamples,
    loadSamples,
    setBuffersLoaded,
  } = useContext(Kit);
  const { stop, setRestart } = useContext(SetSequencer);

  const changeKit = (kit) => {
    setBuffersLoaded(false);
    if (Tone.Transport.state === 'started') {
      setRestart(true);
      stop();
    }
    disposeSamples();
    const newSounds = kits[kit].sounds.map((sound) => ({ ...sound }));
    const newKit = { name: kit, sounds: newSounds };
    kitRef.current = newKit;
    loadSamples(kit);
    setCurrentKit(kit);
  };

  return { changeKit };
};
