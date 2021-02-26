import * as Tone from 'tone';

export const channels = [];
for (let i = 0; i < 9; i++)
  channels.push(
    new Tone.Channel({ volume: 0, pan: 0, channelCount: 2 }).toDestination()
  );

export const analog = [
  {
    name: 'kick',
    sampler: new Tone.Sampler({
      C2: './audio/analog/kick.mp3',
    }).connect(channels[0]),
    key: 'num1',
    color: 0,
  },
  {
    name: 'snr',
    sampler: new Tone.Sampler({ C2: './audio/analog/snr.mp3' }).connect(
      channels[1]
    ),
    key: 'num2',
    color: 1,
  },
  {
    name: 'clp',
    sampler: new Tone.Sampler({ C2: './audio/analog/clp.mp3' }).connect(
      channels[2]
    ),
    key: 'num3',
    color: 2,
  },
  {
    name: 'ch',
    sampler: new Tone.Sampler({ C2: './audio/analog/ch.mp3' }).connect(
      channels[3]
    ),
    key: 'num4',
    color: 3,
  },
  {
    name: 'oh',
    sampler: new Tone.Sampler({ C2: './audio/analog/oh.mp3' }).connect(
      channels[4]
    ),
    key: 'num5',
    color: 4,
  },
  {
    name: 'cym',
    sampler: new Tone.Sampler({ C2: './audio/analog/cym.mp3' }).connect(
      channels[5]
    ),
    key: 'num6',
    color: 5,
  },
  {
    name: 'ht',
    sampler: new Tone.Sampler({ C2: './audio/analog/ht.mp3' }).connect(
      channels[6]
    ),
    key: 'num7',
    color: 6,
  },
  {
    name: 'mt',
    sampler: new Tone.Sampler({ C2: './audio/analog/mt.mp3' }).connect(
      channels[7]
    ),
    key: 'num8',
    color: 7,
  },
  {
    name: 'lt',
    sampler: new Tone.Sampler({ C2: './audio/analog/lt.mp3' }).connect(
      channels[8]
    ),
    key: 'num9',
    color: 8,
  },
];

export const house = [
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
    sampler: new Tone.Sampler({ C2: './audio/house/kick.mp3' }).toDestination(),
    key: 'num2',
    color: 1,
  },
  {
    name: 'snr',
    sampler: new Tone.Sampler({ C2: './audio/house/snr.mp3' }).toDestination(),
    key: 'num3',
    color: 2,
  },
  {
    name: 'shk',
    sampler: new Tone.Sampler({ C2: './audio/house/shk.mp3' }).toDestination(),
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
    sampler: new Tone.Sampler({ C2: './audio/house/clp.mp3' }).toDestination(),
    key: 'num6',
    color: 5,
  },
  {
    name: 'voc',
    sampler: new Tone.Sampler({ C2: './audio/house/voc.mp3' }).toDestination(),
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
];

export const lush = [
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
    sampler: new Tone.Sampler({ C2: './audio/lush/tamb.mp3' }).toDestination(),
    key: 'num7',
    color: 6,
  },
  {
    name: 'plop',
    sampler: new Tone.Sampler({ C2: './audio/lush/plop.mp3' }).toDestination(),
    key: 'num8',
    color: 7,
  },
  {
    name: 'clp',
    sampler: new Tone.Sampler({ C2: './audio/lush/clp.mp3' }).toDestination(),
    key: 'num9',
    color: 8,
  },
];

export const vinyl = [
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
    sampler: new Tone.Sampler({ C2: './audio/vinyl/snr.mp3' }).toDestination(),
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
    sampler: new Tone.Sampler({ C2: './audio/vinyl/clp.mp3' }).toDestination(),
    key: 'num6',
    color: 5,
  },
  {
    name: 'bass',
    sampler: new Tone.Sampler({ C2: './audio/vinyl/bass.mp3' }).toDestination(),
    key: 'num7',
    color: 6,
  },
  {
    name: 'shk',
    sampler: new Tone.Sampler({ C2: './audio/vinyl/shk.mp3' }).toDestination(),
    key: 'num8',
    color: 7,
  },
  {
    name: 'rim',
    sampler: new Tone.Sampler({ C2: './audio/vinyl/rim.mp3' }).toDestination(),
    key: 'num9',
    color: 8,
  },
];
