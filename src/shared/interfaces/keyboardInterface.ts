import { EKeyboard } from "shared/enums";

export interface IKeyboardState {
    keypress: EKeyboard;
    previousKey: EKeyboard;
    isPressed: boolean;
}