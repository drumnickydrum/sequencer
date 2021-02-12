import { ReactComponent as Stop } from './stop.svg';
import { ReactComponent as Start } from './start.svg';
import { ReactComponent as Square } from './square.svg';
import { ReactComponent as Circle } from './circle.svg';

export const StopIcon = () => <Stop className='icon' />;
export const StartIcon = () => <Start className='icon' />;
export const CellIcon = ({ style }) => (
  <Square className='icon' style={style} />
);
export const SquareIcon = () => <Square className='icon' />;
export const CircleIcon = ({ style }) => <Circle style={style} />;
