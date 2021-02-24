# DrumNickyDrum Sequencer

## Dev notes

### 2/24/2021

- Touch and drag input was hard to figure out for touch-screen. Had to disable touch-action via css and attach custom event listeners to each cell. Then grab clientX/Y from `touchmove` on the grid and call out events as the finger passes through cells. It's a lot of checking. Might need to debounce touchmove. The `void element.offsetWidth` hack made the animations too slow on phone, so I switched it to a `setTimeout` class removal. This helped, but I think I'll need to revisit the toggling of classes to make it all faster. There is some weird flashing going on. This might have to do with svg stroke width on the border of cells.
- The whole sizing of the layout is a little off. I think I might try to get rid of cell icons altogether. Maybe this will fix both the sizing and flashing issue. It might make it faster too if I make cells a fixed small pixel size and use `transform: scale()` to bring them up to the correct size.
- Need to add undo/redo, clear, and auto-add cells features to make playing with it easier.
- Need to add pattern/kit select.

### 2/12/2021

- Still playing around with data structure. Instrument and pattern are currently an array to work with ease of 0-based indexing.
- Memoized Cell and SoundCell for as few re-paints as possible. It was repainting 576 divs every time the selected sound was changed (64 cells x 9 sound-cells). Now it only repaints the cells that are affected.
  - result is ~1-10% of previous re-paints:
    - 64 cells re-paint on selected sound change.
    - 1 sound-cell re-paints on cell click.
  - cost of memo comparison not figured into this. Can't be certain this is a gain or a loss just yet.

## Structure

Naming is important. Trying to avoid collisions and confusion such as:

- `play()` ... is this play sequence or play sample?
- sequence vs pattern ?

### Current solution:

- `start()` sequence
- `trigger()` sample/note
- 'instrument' is a collection of 'samples' (or in the future oscillators, etc...)
- working towards the following sequence structure:

```
sequence: {
    bpm: number,
    instrument: {
        sample1: {
            sampler: Tone.Sampler,
            key: <event code>,
        },
        sample2: ...,
        sample3: ...,
        sample4: ...,
    },
    pattern: [
        // array of which samples to trigger
        // at each step of the sequence
        {
            instrument[sample1]: [vol, tune, length],
            instrument[sample2]: [vol, tune, length],
            instrument[sample3]: [vol, tune, length],
            instrument[sample4]: [vol, tune, length],
        },
        {},{},{}...
    ],
}
```
