import { ReactComponent as Stop } from './stop.svg';
import { ReactComponent as Start } from './start.svg';
import { ReactComponent as Undo } from './undo.svg';
import { ReactComponent as Redo } from './redo.svg';
import { ReactComponent as ClearOne } from './clear-one.svg';
import { ReactComponent as ClearAll } from './clear-all.svg';
import { ReactComponent as Swipe } from './swipe.svg';
import { ReactComponent as Saw } from './saw.svg';
import { ReactComponent as Copy } from './copy.svg';
import { ReactComponent as Solo } from './solo.svg';
import { ReactComponent as Mute } from './mute.svg';
import { ReactComponent as Pitch } from './pitch.svg';
import { ReactComponent as Velocity } from './velocity.svg';
import { ReactComponent as Length } from './length.svg';

export const StopIcon = () => <Stop />;
export const StartIcon = () => <Start />;

export const UndoIcon = () => <Undo />;
export const RedoIcon = () => <Redo />;
export const ClearOneIcon = () => <ClearOne />;
export const ClearAllIcon = () => <ClearAll />;

export const SwipeHorizontalIcon = () => <Swipe />;
export const SwipeVerticalIcon = () => <Swipe className='deg90' />;

export const SawIcon = ({ addClass = '' }) => <Saw className={addClass} />;
export const CopyIcon = ({ addClass = '' }) => <Copy className={addClass} />;

export const SoloIcon = ({ addClass = '' }) => <Solo className={addClass} />;
export const MuteIcon = ({ addClass = '' }) => <Mute className={addClass} />;

export const PitchIcon = ({ addClass = '' }) => <Pitch className={addClass} />;
export const VelocityIcon = ({ addClass = '' }) => (
  <Velocity className={addClass} />
);
export const LengthIcon = ({ addClass = '' }) => (
  <Length className={addClass} />
);
