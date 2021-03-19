import { useState, useContext } from 'react';
import { Kit } from '../Providers/Kit';
import { PatternState } from '../Providers/State/Pattern';

export const useSoloAndMute = () => {
  const { kitRef } = useContext(Kit);
  const { selectedSound } = useContext(PatternState);
  const [solo, setSolo] = useState(false);
  const [mute, setMute] = useState(false);

  const handleSolo = () => {
    const soundCells = document.querySelectorAll('.sound-cells');
    if (solo) {
      soundCells.forEach((soundCell) => soundCell.classList.remove('off'));
      kitRef.current.sounds[selectedSound].channel.solo = false;
      setSolo(false);
    } else {
      if (mute) handleMute();
      soundCells.forEach((soundCell) => soundCell.classList.add('off'));
      kitRef.current.sounds[selectedSound].channel.solo = true;
      setSolo(true);
    }
  };

  const handleMute = () => {
    const cells = document.querySelectorAll('.noteOn');
    if (mute) {
      cells.forEach((cell) => cell.classList.remove('dim'));
      kitRef.current.sounds[selectedSound].channel.mute = false;
      setMute(false);
    } else {
      if (solo) handleSolo();
      cells.forEach((cell) => cell.classList.add('dim'));
      kitRef.current.sounds[selectedSound].channel.mute = true;
      setMute(true);
    }
  };

  return { solo, mute, handleSolo, handleMute };
};
