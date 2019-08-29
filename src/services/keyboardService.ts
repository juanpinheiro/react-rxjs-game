import Store from 'services/store';
import { IKeyboardState } from 'shared/interfaces/keyboardInterface';
import { EKeyboard } from 'shared/enums';

const INITIAL_STATE: IKeyboardState = {
    keypress: EKeyboard.NONE,
    previousKey: EKeyboard.NONE,
    isPressed: 0
}

class KeyboardService extends Store<IKeyboardState> {

    constructor() {
        super(INITIAL_STATE);
    }

    setKeypress = (keypress: EKeyboard, isPressed: number) => {
        this.setState({ keypress, isPressed, previousKey: this.currentState().keypress });
    }

}

const keyboardService = new KeyboardService();
export default keyboardService;