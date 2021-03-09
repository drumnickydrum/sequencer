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
import { ReactComponent as ChevronDown } from './chevron-down.svg';
import { ReactComponent as ChevronRight } from './chevron-right.svg';
import { ReactComponent as ChevronLeft } from './chevron-left.svg';
import { ReactComponent as ChevronDoubleLeft } from './chevron-double-left.svg';
import { ReactComponent as ChevronDoubleRight } from './chevron-double-right.svg';
import { ReactComponent as ChevronTripleLeft } from './chevron-triple-left.svg';
import { ReactComponent as ChevronTripleRight } from './chevron-triple-right.svg';

export const ChevronDownIcon = ({ addClass = '' }) => (
  <ChevronDown className={addClass + ' chevron down'} />
);

export const ChevronLeftIcon = ({ addClass = '' }) => (
  <ChevronLeft className={addClass + ' chevron left'} />
);
export const ChevronRightIcon = ({ addClass = '' }) => (
  <ChevronRight className={addClass + ' chevron right'} />
);

export const ChevronDoubleLeftIcon = ({ addClass = '' }) => (
  <ChevronDoubleLeft className={addClass + ' chevron left'} />
);
export const ChevronDoubleRightIcon = ({ addClass = '' }) => (
  <ChevronDoubleRight className={addClass + ' chevron right'} />
);

export const ChevronTripleLeftIcon = ({ addClass = '' }) => (
  <ChevronTripleLeft className={addClass + ' chevron left'} />
);
export const ChevronTripleRightIcon = ({ addClass = '' }) => (
  <ChevronTripleRight className={addClass + ' chevron right'} />
);

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

export const SawIcon = ({ addClass = '' }) => (
  <Saw className={addClass + ' icon'} />
);
export const CopyIcon = ({ addClass = '' }) => (
  <Copy className={addClass + ' icon'} />
);

export const SoloIcon = ({ addClass = '' }) => (
  <Solo className={addClass + ' icon'} />
);
export const MuteIcon = ({ addClass = '' }) => (
  <Mute className={addClass + ' icon'} />
);

export const PitchIcon = ({ addClass = '' }) => (
  <Pitch className={addClass + ' icon'} />
);
export const VelocityIcon = ({ addClass = '' }) => (
  <Velocity className={addClass + ' icon'} />
);
export const LengthIcon = ({ addClass = '' }) => (
  <Length className={addClass + ' icon'} />
);

export const PaintIcon = ({ addClass = '' }) => (
  <Paint className={addClass + ' icon'} />
);
export const CloseIcon = ({ addClass = '' }) => (
  <Close className={addClass + ' icon'} />
);

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
