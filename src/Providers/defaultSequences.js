import * as Tone from 'tone';

const INITIAL_SAMPLES = {
  kick: {
    sampler: new Tone.Sampler({ C2: './audio/kick.mp3' }).toDestination(),
    key: 'num1',
  },
  snr: {
    sampler: new Tone.Sampler({ C2: './audio/snr.mp3' }).toDestination(),
    key: 'num2',
  },
  ch: {
    sampler: new Tone.Sampler({ C2: './audio/ch.mp3' }).toDestination(),
    key: 'num3',
  },
  oh: {
    sampler: new Tone.Sampler({ C2: './audio/oh.mp3' }).toDestination(),
    key: 'num4',
  },
};

export const init = {
  bpm: 128,
  instrument: INITIAL_SAMPLES,
  pattern: [
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
  ],
};

export const downtempo = {
  bpm: 88,
  instrument: INITIAL_SAMPLES,
  pattern: [
    {
      kick: 1,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 1,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 1,
      ch: 0.5,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 1,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
    {
      kick: 1,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 1,
      ch: 0,
      oh: 0,
    },
    {
      kick: 0.5,
      snr: 0,
      ch: 0.5,
      oh: 0,
    },
    {
      kick: 1,
      snr: 0,
      ch: 0,
      oh: 1,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0,
      oh: 0,
    },
  ],
};

export const edm = {
  bpm: 128,
  instrument: INITIAL_SAMPLES,
  pattern: [
    {
      kick: 1,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0.5,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 1,
      snr: 1,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0.5,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 1,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0.5,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 1,
      snr: 1,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 0.5,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
  ],
};

export const dnb = {
  bpm: 200,
  instrument: INITIAL_SAMPLES,
  pattern: [
    {
      kick: 1,
      snr: 0,
      ch: 1,
      oh: 1,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 1,
      ch: 1,
      oh: 1,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 1,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 1,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 1,
      ch: 1,
      oh: 1,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
    {
      kick: 0,
      snr: 0,
      ch: 1,
      oh: 0,
    },
  ],
};
