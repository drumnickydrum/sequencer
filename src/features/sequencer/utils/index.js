export const getNoteTally = (pattern) => {
  let noteTally = { total: 0 };
  pattern[0].forEach((_, i) => {
    noteTally[i] = 0;
  });
  pattern.forEach((step) => {
    step.forEach((sound, i) => {
      if (sound.noteOn) {
        noteTally[i]++;
        noteTally.total++;
      }
    });
  });
  return noteTally;
};

export const inc = (noteTally, sound) => {
  noteTally[sound]++;
  noteTally.total++;
};

export const dec = (noteTally, sound) => {
  noteTally[sound]--;
  noteTally.total--;
};

export const initSoundStep = (sound) => {
  sound.noteOn = false;
  sound.notes.length = 0;
  sound.notes.push({ pitch: 24, velocity: 1, length: 1 });
};
