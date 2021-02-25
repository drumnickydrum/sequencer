import { ReactComponent as Stop } from './stop.svg';
import { ReactComponent as Start } from './start.svg';
import { ReactComponent as Square } from './square.svg';

import { ReactComponent as Undo } from './undo.svg';
import { ReactComponent as Redo } from './redo.svg';
import { ReactComponent as ClearOne } from './clear-one.svg';
import { ReactComponent as ClearAll } from './clear-all.svg';

export const StopIcon = () => <Stop className='icon' />;
export const StartIcon = () => <Start className='icon' />;
export const CellIcon = ({ style }) => (
  <Square className='icon' style={style} />
);
export const UndoIcon = () => <Undo />;
export const RedoIcon = () => <Redo />;
export const ClearOneIcon = () => <ClearOne />;
export const ClearAllIcon = () => <ClearAll />;
