import { useState, useContext } from 'react';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';

export const useSoloAndMute = () => {
  const { kit } = useContext(Kit);
  const { selectedSound } = useContext(Pattern);
  const [solo, setSolo] = useState(false);
  const [mute, setMute] = useState(false);

  const handleSolo = () => {
    const soundCells = document.querySelectorAll('.sound-cells');
    if (solo) {
      soundCells.forEach((soundCell) => soundCell.classList.remove('off'));
      kit.sounds[selectedSound].channel.solo = false;
      setSolo(false);
    } else {
      if (mute) handleMute();
      soundCells.forEach((soundCell) => soundCell.classList.add('off'));
      kit.sounds[selectedSound].channel.solo = true;
      setSolo(true);
    }
  };

  const handleMute = () => {
    const cells = document.querySelectorAll('.noteOn');
    if (mute) {
      cells.forEach((cell) => cell.classList.remove('dim'));
      kit.sounds[selectedSound].channel.mute = false;
      setMute(false);
    } else {
      if (solo) handleSolo();
      cells.forEach((cell) => cell.classList.add('dim'));
      kit.sounds[selectedSound].channel.mute = true;
      setMute(true);
    }
  };

  return { solo, mute, handleSolo, handleMute };
};
