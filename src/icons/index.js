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
import { ReactComponent as Square } from './square.svg';
import { ReactComponent as PointRight } from './point-right.svg';
import { ReactComponent as PointUp } from './point-up.svg';
import { ReactComponent as Paint } from './paint.svg';
import { ReactComponent as Close } from './close.svg';

export const StopIcon = ({ addClass = '' }) => <Stop className={addClass} />;
export const StartIcon = ({ addClass = '' }) => <Start className={addClass} />;

export const UndoIcon = ({ addClass = '' }) => <Undo className={addClass} />;
export const RedoIcon = ({ addClass = '' }) => <Redo className={addClass} />;
export const ClearOneIcon = ({ addClass = '' }) => (
  <ClearOne className={addClass} />
);
export const ClearAllIcon = ({ addClass = '' }) => (
  <ClearAll className={addClass} />
);

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

export const PaintIcon = ({ addClass = '' }) => (
  <Paint className={addClass + ' icon'} />
);
export const CloseIcon = ({ addClass = '' }) => <Close className={addClass} />;

export const PitchSwipe = () => {
  return (
    <div className='swipe-icon'>
      <PointUp className='pvl-swipe' />
      <Square className='square icon' />
      <p className='swipe-pitch-up'>+12</p>
      <p className='swipe-pitch-down'>-5</p>
    </div>
  );
};

export const VelocitySwipe = () => {
  return (
    <div className='swipe-icon'>
      <PointUp className='pvl-swipe' />
      <Square className='square icon velocity-swipe' />
    </div>
  );
};

export const LengthSwipe = () => {
  return (
    <div className='swipe-icon'>
      <PointUp className='pvl-swipe-h' />
      <Square className='square icon length-swipe' />
    </div>
  );
};
