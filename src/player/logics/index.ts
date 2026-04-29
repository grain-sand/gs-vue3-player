import {IGsLogic} from '../../type';
import {keyboardLogic} from './KeyboardLogic';
import {styleVariableLogic} from './StyleVariableLogic';
import {fullscreenLogic} from './FullscreenLogic';
import {mouseEventLogic} from './MouseEventLogic';

export const defaultLogics: IGsLogic[] = [
  styleVariableLogic(),
  keyboardLogic(),
  fullscreenLogic(),
  mouseEventLogic()
];

export {keyboardLogic} from './KeyboardLogic';
export {styleVariableLogic} from './StyleVariableLogic';
export {fullscreenLogic} from './FullscreenLogic';
export {mouseEventLogic} from './MouseEventLogic';
