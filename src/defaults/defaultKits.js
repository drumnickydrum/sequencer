import * as Tone from 'tone';

export const MIDI_NOTES = [
  'C0',
  'C#0',
  'D0',
  'D#0',
  'E0',
  'F0',
  'F#0',
  'G0',
  'G#0',
  'A0',
  'A#0',
  'B0',
  'C1',
  'C#1',
  'D1',
  'D#1',
  'E1',
  'F1',
  'F#1',
  'G1',
  'G#1',
  'A1',
  'A#1',
  'B1',
  'C2',
  'C#2',
  'D2',
  'D#2',
  'E2',
  'F2',
  'F#2',
  'G2',
  'G#2',
  'A2',
  'A#2',
  'B2',
  'C3',
  'C#3',
  'D3',
  'D#3',
  'E3',
  'F3',
  'F#3',
  'G3',
  'G#3',
  'A3',
  'A#3',
  'B3',
  'C4',
  'C#4',
  'D4',
  'D#4',
  'E4',
  'F4',
  'F#4',
  'G4',
  'G#4',
  'A4',
  'A#4',
  'B4',
];

export const analog = {
  name: 'analog',
  sounds: [
    {
      name: 'kick',
      sample: './audio/analog/kick.mp3',
      pitchMod: 0,
      lengthMod: 1,
      velocityMod: 1,
      key: 'num1',
      color: 0,
    },
    {
      name: 'snr',
      sample: './audio/analog/snr.mp3',
      pitchMod: 0,
      lengthMod: 1,
      velocityMod: 1,
      key: 'num2',
      color: 1,
    },
    {
      name: 'clp',
      sample: './audio/analog/clp.mp3',
      pitchMod: 0,
      lengthMod: 1,
      velocityMod: 1,
      key: 'num3',
      color: 2,
    },
    {
      name: 'ch',
      sample: './audio/analog/ch.mp3',
      pitchMod: 0,
      lengthMod: 1,
      velocityMod: 1,
      key: 'num4',
      color: 3,
    },
    {
      name: 'oh',
      sample: './audio/analog/oh.mp3',
      pitchMod: 0,
      lengthMod: 1,
      velocityMod: 1,
      key: 'num5',
      color: 4,
    },
    {
      name: 'cym',
      sample: './audio/analog/cym.mp3',
      pitchMod: 0,
      lengthMod: 1,
      velocityMod: 1,
      key: 'num6',
      color: 5,
    },
    {
      name: 'ht',
      sample: './audio/analog/ht.mp3',
      pitchMod: 0,
      lengthMod: 1,
      velocityMod: 1,
      key: 'num7',
      color: 6,
    },
    {
      name: 'mt',
      sample: './audio/analog/mt.mp3',
      pitchMod: 0,
      lengthMod: 1,
      velocityMod: 1,
      key: 'num8',
      color: 7,
    },
    {
      name: 'lt',
      sample: './audio/analog/lt.mp3',
      pitchMod: 0,
      lengthMod: 1,
      velocityMod: 1,
      key: 'num9',
      color: 8,
    },
  ],
};

export const house = {
  name: 'house',
  sounds: [
    {
      name: 'verb kick',
      sampler: new Tone.Sampler({
        C2: './audio/house/kick_verb.mp3',
      }).toDestination(),
      key: 'num1',
      color: 0,
    },
    {
      name: 'kick',
      sampler: new Tone.Sampler({
        C2: './audio/house/kick.mp3',
      }).toDestination(),
      key: 'num2',
      color: 1,
    },
    {
      name: 'snr',
      sampler: new Tone.Sampler({
        C2: './audio/house/snr.mp3',
      }).toDestination(),
      key: 'num3',
      color: 2,
    },
    {
      name: 'shk',
      sampler: new Tone.Sampler({
        C2: './audio/house/shk.mp3',
      }).toDestination(),
      key: 'num4',
      color: 3,
    },
    {
      name: 'oh',
      sampler: new Tone.Sampler({ C2: './audio/house/oh.mp3' }).toDestination(),
      key: 'num5',
      color: 4,
    },
    {
      name: 'clp',
      sampler: new Tone.Sampler({
        C2: './audio/house/clp.mp3',
      }).toDestination(),
      key: 'num6',
      color: 5,
    },
    {
      name: 'voc',
      sampler: new Tone.Sampler({
        C2: './audio/house/voc.mp3',
      }).toDestination(),
      key: 'num7',
      color: 6,
    },
    {
      name: 'mt',
      sampler: new Tone.Sampler({ C2: './audio/house/mt.mp3' }).toDestination(),
      key: 'num8',
      color: 7,
    },
    {
      name: 'lt',
      sampler: new Tone.Sampler({ C2: './audio/house/lt.mp3' }).toDestination(),
      key: 'num9',
      color: 8,
    },
  ],
};

export const lush = {
  name: 'lush',
  sounds: [
    {
      name: 'long kick',
      sampler: new Tone.Sampler({
        C2: './audio/lush/kick_long.mp3',
      }).toDestination(),
      key: 'num1',
      color: 0,
    },
    {
      name: 'mid kick',
      sampler: new Tone.Sampler({
        C2: './audio/lush/kick_mid.mp3',
      }).toDestination(),
      key: 'num2',
      color: 1,
    },
    {
      name: 'short kick',
      sampler: new Tone.Sampler({
        C2: './audio/lush/kick_short.mp3',
      }).toDestination(),
      key: 'num3',
      color: 2,
    },
    {
      name: 'ch',
      sampler: new Tone.Sampler({ C2: './audio/lush/ch.mp3' }).toDestination(),
      key: 'num4',
      color: 3,
    },
    {
      name: 'oh',
      sampler: new Tone.Sampler({ C2: './audio/lush/oh.mp3' }).toDestination(),
      key: 'num5',
      color: 4,
    },
    {
      name: 'snr',
      sampler: new Tone.Sampler({ C2: './audio/lush/snr.mp3' }).toDestination(),
      key: 'num6',
      color: 5,
    },
    {
      name: 'tamb',
      sampler: new Tone.Sampler({
        C2: './audio/lush/tamb.mp3',
      }).toDestination(),
      key: 'num7',
      color: 6,
    },
    {
      name: 'plop',
      sampler: new Tone.Sampler({
        C2: './audio/lush/plop.mp3',
      }).toDestination(),
      key: 'num8',
      color: 7,
    },
    {
      name: 'clp',
      sampler: new Tone.Sampler({ C2: './audio/lush/clp.mp3' }).toDestination(),
      key: 'num9',
      color: 8,
    },
  ],
};

export const vinyl = {
  name: 'vinyl',
  sounds: [
    {
      name: 'kick',
      sampler: new Tone.Sampler({
        C2: './audio/vinyl/kick.mp3',
      }).toDestination(),
      key: 'num1',
      color: 0,
    },
    {
      name: 'kick2',
      sampler: new Tone.Sampler({
        C2: './audio/vinyl/kick2.mp3',
      }).toDestination(),
      key: 'num2',
      color: 1,
    },
    {
      name: 'snr',
      sampler: new Tone.Sampler({
        C2: './audio/vinyl/snr.mp3',
      }).toDestination(),
      key: 'num3',
      color: 2,
    },
    {
      name: 'ch',
      sampler: new Tone.Sampler({ C2: './audio/vinyl/ch.mp3' }).toDestination(),
      key: 'num4',
      color: 3,
    },
    {
      name: 'oh',
      sampler: new Tone.Sampler({ C2: './audio/vinyl/oh.mp3' }).toDestination(),
      key: 'num5',
      color: 4,
    },
    {
      name: 'clp',
      sampler: new Tone.Sampler({
        C2: './audio/vinyl/clp.mp3',
      }).toDestination(),
      key: 'num6',
      color: 5,
    },
    {
      name: 'bass',
      sampler: new Tone.Sampler({
        C2: './audio/vinyl/bass.mp3',
      }).toDestination(),
      key: 'num7',
      color: 6,
    },
    {
      name: 'shk',
      sampler: new Tone.Sampler({
        C2: './audio/vinyl/shk.mp3',
      }).toDestination(),
      key: 'num8',
      color: 7,
    },
    {
      name: 'rim',
      sampler: new Tone.Sampler({
        C2: './audio/vinyl/rim.mp3',
      }).toDestination(),
      key: 'num9',
      color: 8,
    },
  ],
};
