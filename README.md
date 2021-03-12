# DrumNickyDrum Sequencer

## Dev notes

### 3/12/2021

- Changed `.on` to `.noteOn` to match mongoose schema.
- Saving patterns to db.
- Chooose between default and user patterns.

### 3/11/2021

- Setup a user provider and login page.
- Setup login methods:
  - Google
  - Twitter

### 3/10/2021

- You can now change kits even while transport is started. (juggles a restart)
- I was getting Buffer errors until cleaning up old kit buffers. Sampler/Channel is disposed by calling `dispose()` and then `delete` on the object.
- `ChangePattern` works well. A callback function to `changePattern` allows `setBpm` to be called and added to the undo/redo function.
- Undo/Redo and ClearOne are disabled if not available.
- The iOS bpm bug was because of css `user-select: none`.

### 3/9/2021

#### NEXT:

- implement `ChangeKit`
- implement `ChangePattern`

- Added 'paint' mode.
- Cell/All mods are handled in PatternProvider. If no step provided it's an all update. This also handles undo/redo. And reset handles both.
- The scrolling menus work so much better on mobile because the screen doesn't move all over the place.
- Added scroll indicators... dunno how I feel about them.
- `kit` is now an object with `name` and `sound` properties.

### 3/8/2021

- Need to re-implement mod-all.
- Need to add an edit for 'paint' mode. That way you can click and drag the screen around without toggling by mistake.
- Need to indicate that the transport bar is x-scrollable.
- Need to refine those little instructions animations in mods once I get the sizing right.

### 3/7/2021

- `resetCellMods` currently looks ugly to me because of undo stuff, but as of right now it's the only way I can preserve the previous state without screwing up object references elsewhere. There are two deep copies happening, but only when you hit reset. When you're undoing/redoing it only costs one deep copy.
- I've introduced a bug from yesterday with the whole propagation/drag handler thing. When a cell mod is active you can click and drag to toggle on cells, or toggle on a cell and adjust the cell mod, or not... it's buggy.
- Right now I am deep copy the pattern when I need something to edit temporarily or save for later. That way I'm only ever altering the current pattern, never assigning a new reference.

### 3/6/2021

- Working on a performant (but verbose) implementation of adding to undo per function.
  - Update: the flow is now to define a function then run it, then add that function with prev/new values to the undo ref.
- Don't forget to `e.stopPropagation()`. This removed the need for lots of unneccessary events in parent div. (Grid `handleDrag()` not neeeding to be called when Cell `handleTouchMove()` called)

### 3/5/2021

NEXT:

- Consolidate mods into step/all

- I'm becoming more clear on how I should use certain hooks:
  - Should the change in value cause a UI change? -> useState
  - Should every change in value not cause a UI change? -> useRef
  - Is the value coming from outside this function scope, and I know we're not updating this component's state? -> useRef
- I also fixed an error where I was putting a ref value as a condition to a touch handler. this doesn't make sense because it's only going to use the condition as it was on mount. You need to check the ref in the function definition and then return if neccessary.

### 3/4/2021

< 6:00 PM: It's a spaghetti mess right now trying to make as few unnecessary copies / updates / repaints as possible. Need to rethink this whole efficiency thing. Getting foggy, will stop for today.

> 3:00 PM:

- I need to simplify these pattern updates vs step updates. These deep copies are making pattern editing janky.

< 12:00 PM:

- Began an implementation of the often used useStateAndRef flow.
- Reorganizing PatternProvider so related values are all together.
- Change in terms:
  - `step` is related to the sequencer timing
  - `cell` is the visual grid representation of a step
- Schedule functions are now in Sequencer Provider. PatternProvider is less hell to look at now.
- Extracted components out of SoundPanel.

### 3/3/2021

> 5:00 PM:

- each sound's mods are now functioning in undo/redo.

< 5:00 PM:

- Extracted undo/redo out of PatternProvider. It was a nightmare. Reference errors, repeat pushes to undo list, etc... It's now all handled in one place, a useEffect each time pattern is updated. Will need to do the same for kit updates.
- Learned about the weirdness of React.StrictMode adding additional renders and driving me nuts trying to figure out why certain functions are being called twice.

< 12:00PM:

- It would be wise to go through and clean things up now that I have a good idea of how everything communicates.
- I've also realized there is a serious performance hit when transitioning color/bg and instead should be using opacity layers to do this sort of thing. Also transform is slick compared to width/height transitions which cause re-painting.

### 3/2/2021

> 5:00 PM:

- Cells now have editable pitch. The attack time shift is very noticeable atleast within chrome on desktop.
- The `flashing` animation was killing the performance. I added a `pause` class when the start button is pressed so that playback won't be affected. Need to do some resesarch.
- Responsive pitch icons don't work tooooo great. But they're close.
- NEXT: Need to refactor some before moving on? Code is getting pretty gnarly.

< 5:00 PM:

- Implemented Solo and Mute per sound, but it is buggy. I cleared up what I know are my own logic bugs, I think what is left is something to do with Tone or my kit setup. I've raised an issue with Tone.js on github.
- Fixed bugs and changed names of sound edit knobs for accuracy:
  - Velocity
  - Pitch
  - Length
- I have the close button for the sound-edit panel outside the scrolling components. A ref is passed to each component so they can add their callback functions to be executed on close.
- Right now you are actually 'closing' the sound-edit panel, so it starts at the same component each time you open it. Maybe it should just be hidden instead so it will stay where you left it and not have to scroll to the same component every time you open it.
- Each sound's cells are now reflecting velocity (opacity) and length (width).
- Cells now have editable velocity and length.

### 2/29/2021

> 4:00pm:

- Copy pattern is implemented. Need to figure out the look of the UI.

> 12:00pm:

- Slick'd up the slicing and scheduling a bit. Instead of a `slice` property I now use an array of notes, similar to how Tone does the `Schedule` subdivision. It works and reads pretty clean.
- Deep copy of a pattern now look like this:

```
return pattern.map((cell) => { // array of cells
    return cell.map((sound) => { // array of sounds
      let newNotes = sound.notes.map((note) => { // each sound's notes object
        return { ...note };
      });
      return { on: sound.noteOn, notes: newNotes }; // each sound
    });
  });
```

- Added saw icon and animation for sliced cells.

< 12:00pm:

- Trying to adjust `scheduleCell` to decide between `Tone.ToneEvent` and `Tone.Sequence` was not working... causing missing notes and hiccups. I decided to leave it as a simple `scheduleAttackRelease` and use the `slice` property to manually insert more triggers.
- Each note of the pattern is now: `{pitch, velocity, release, slice}` and in general I think this will leave me way more options as I expand the features of playback/editing. It's already cleaned up some of the code.

### 2/28/2021

- Ran into same issue with stale value from state inside a function. Need to remember this pattern: `state update => useEffect => ref.current = state` then pass the ref to the function definition. Should make a custom hook for this?
- Basic slice works but need to adjust the duration and timing.
- Need to adjust vol/pitch/duration mod in the kit object instead of calculating during `scheduleCell()`. 'Per cell' mods will need to go there instead of 'per sound' mods.

### 2/26/2021

- Added a panel to edit each sound:
  - volume knob
  - pitch knob
  - length knob
  - The knob values are 0-100 and I did calculations to scale that to required adjustment values. Not sure if I should do it the other way around.
- Added an info overlay to assist with instructions.
- Kit now stored in a ref. It gets the duration of each buffer after the audio is ready. It uses `volumeMod`, `pitchMod`, and `durationMod` to adjust the knobs mentioned above. (The calculation happens during `scheduleCell () => triggerAttackRelease()` ).

#### Next

- I'd like to figure out the 'slicer' option... I remember there was something in tone.js where if you schedule an array it will fit the notes within the current subdivision, effectively 'slicing' it up.
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
