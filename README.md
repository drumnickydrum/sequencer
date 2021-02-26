# DrumNickyDrum Sequencer

## Dev notes

### 2/26/2021

- Going to work on kit panel today... for each sound:
  - volume knob
  - pitch knob
  - length knob
- I'd also like to figure out the 'slicer' option... I remember there was something in tone.js where if you schedule an array it will fit the notes within the current subdivision, effectively 'slicing' it up.
- I'd also like to implement a feature to copy the current sound's pattern to another sound.

### 2/25/2021

- I forgot to deep copy the pattern array... I have been mutating the inner arrays and that is why I have some weird behavior. Oh but guess what? Now when I do it the right way I can no longer edit on the fly while the transport is started! The cells toggle visually, but the Tone schedule is not updated. So I think I need to figure out how to follow proper React practices while also updating the pattern that Tone is reading from. Or sacrifice either of those for the right functionality.
  - Update @ 1:30PM => solved! Use a ref to store the pattern, updated everytime pattern state is updated with a useEffect. Tone reads from the ref instead of state and for some reason this stays the most current while transport is already started.
- Fixed a flicker when selecting a different sound. `vol` was being set as a side effect, so `color` is now also a state variable being set the same way so they update together.
- After much playing around with layout I'm trying the grid on top, smaller instrument panel in the middle (mid-bottom), and transport/edit panels on the bottom. The bottom panel scrolls.
- Added labels to edit panel.
- New plan to make the SoundSelector buttons open an editor panel for the selected sound.

### 2/24/2021

- The svg icons for cells were totally unneccessary. They are now simply divs with border, border-radius, and background. The tradeoff is a funny way of handling perfect squares and circles with the `padding-bottom` hack. So far so good tho.
- Focusing on touch handling. Editing cells is smoother now.
- Clear sound/all buttons work but don't update the `scheduleRepeat` until a stop/start. It's not clear to me why this doesn't work the way `toggleCell` does.
- Undo/Redo works well. Undo pops the function off the stack and adds it to the redo stack. If you edit the grid it clears the redo stack. The wording of arguments can be a little confusing. Remember that when you call `toggleCell` with a value, it's going to calculate the new value. So if you pass it an argument like `newVal` it's going to become a new newVal! This will change when I switch over to 0-1 range of volumes instead of on/off.

### 2/23/2021

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
