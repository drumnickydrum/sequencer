import * as Tone from 'tone';

const INITIAL_SAMPLES = [
  {
    name: 'kick',
    sampler: new Tone.Sampler({ C2: './audio/kick.mp3' }).toDestination(),
    key: 'num1',
    color: 0,
  },
  {
    name: 'snr',
    sampler: new Tone.Sampler({ C2: './audio/snr.mp3' }).toDestination(),
    key: 'num2',
    color: 1,
  },
  {
    name: 'clp',
    sampler: new Tone.Sampler({ C2: './audio/clp.mp3' }).toDestination(),
    key: 'num3',
    color: 2,
  },
  {
    name: 'ch',
    sampler: new Tone.Sampler({ C2: './audio/ch.mp3' }).toDestination(),
    key: 'num4',
    color: 3,
  },
  {
    name: 'oh',
    sampler: new Tone.Sampler({ C2: './audio/oh.mp3' }).toDestination(),
    key: 'num5',
    color: 4,
  },
  {
    name: 'cym',
    sampler: new Tone.Sampler({ C2: './audio/cym.mp3' }).toDestination(),
    key: 'num6',
    color: 5,
  },
  {
    name: 'ht',
    sampler: new Tone.Sampler({ C2: './audio/ht.mp3' }).toDestination(),
    key: 'num7',
    color: 6,
  },
  {
    name: 'mt',
    sampler: new Tone.Sampler({ C2: './audio/mt.mp3' }).toDestination(),
    key: 'num8',
    color: 7,
  },
  {
    name: 'lt',
    sampler: new Tone.Sampler({ C2: './audio/lt.mp3' }).toDestination(),
    key: 'num9',
    color: 8,
  },
];

const initPattern = [];
for (let i = 0; i < 64; i++) {
  initPattern.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

export const init = {
  bpm: 128,
  instrument: INITIAL_SAMPLES,
  pattern: initPattern,
};

export const downtempo = {
  bpm: 100,
  instrument: INITIAL_SAMPLES,
  pattern: [
    [1, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 0, 0, 0, 0, 0],
    [0.5, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0.5, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0.5, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 0.5, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 1, 0],
    [1, 1, 0, 1, 1, 0, 0, 0.5, 0],
    [0, 0, 0, 0.5, 0, 0, 0, 0, 1],
    [0, 1, 1, 0, 1, 0, 1, 0, 0],
    [0.5, 1, 0, 1, 0, 0, 0, 1, 0],
    [1, 1, 0, 1, 1, 0, 0, 0.5, 0.5],
    [0.5, 0, 0, 1, 0, 0, 0, 0, 1],
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
