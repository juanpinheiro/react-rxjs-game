import characterIdleDown from 'assets/Character/Char_two/Idle/Char2_idle_down.png';
import characterIdleUp from 'assets/Character/Char_two/Idle/Char2_idle_up.png';
import characterIdleLeft from 'assets/Character/Char_two/Idle/Char2_idle_left.png';
import characterIdleRight from 'assets/Character/Char_two/Idle/Char2_idle_right.png';
import characterWalkDown from 'assets/Character/Char_two/Walk/Char2_walk_down.png';
import characterWalkUp from 'assets/Character/Char_two/Walk/Char2_walk_up.png';
import characterWalkLeft from 'assets/Character/Char_two/Walk/Char2_walk_left.png';
import characterWalkRight from 'assets/Character/Char_two/Walk/Char2_walk_right.png';

import Store from 'services/store';
import { EKeyboard } from 'shared/enums';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import keyboardService from 'services/keyboardService';
import { Animator } from 'models/Animator';


interface IAnimatorState {
    current: Animator;
}

const INITIAL_STATE: IAnimatorState = {
    current: new Animator(characterIdleDown, 6, { x: 16, y: 16 }, 'row')
}

class AnimatorService extends Store<IAnimatorState> {
    
    private animatorIdleDown = new Animator(characterIdleDown, 6, { x: 16, y: 16 }, 'row');
    private animatorIdleUp = new Animator(characterIdleUp, 6, { x: 16, y: 16 }, 'row');
    private animatorIdleLeft = new Animator(characterIdleLeft, 6, { x: 16, y: 16 }, 'row');
    private animatorIdleRight = new Animator(characterIdleRight, 6, { x: 16, y: 16 }, 'row');

    private animatorWalkDown = new Animator(characterWalkDown, 6, { x: 16, y: 16 }, 'row');
    private animatorWalkUp = new Animator(characterWalkUp, 6, { x: 16, y: 16 }, 'row');
    private animatorWalkLeft = new Animator(characterWalkLeft, 6, { x: 16, y: 16 }, 'row');
    private animatorWalkRight = new Animator(characterWalkRight, 6, { x: 16, y: 16 }, 'row');

    constructor() {
        super(INITIAL_STATE);
        
        combineLatest(
            keyboardService.getState.pipe(
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
                filter((keypress) => keypress.keypress !== keypress.previousKey)
            )
        )
        .subscribe(([keyboard]) => {
            switch(keyboard.keypress) {
                case EKeyboard.UP:
                case EKeyboard.DOWN:
                case EKeyboard.LEFT:
                case EKeyboard.RIGHT:
                    this.switchAnimatorWalk(keyboard.keypress);
                    break;
                case EKeyboard.NONE:
                    this.switchAnimatorIdle(keyboard.previousKey);
                    break;
            }
        });
    }

    
    switchAnimatorIdle = (previousKey: EKeyboard) => {
        switch(previousKey) {
            case EKeyboard.UP:
                this.setState({ current: this.animatorIdleUp });
                break;
            case EKeyboard.DOWN:
                this.setState({ current: this.animatorIdleDown });
                break;
            case EKeyboard.LEFT:
                this.setState({ current: this.animatorIdleLeft });
                break;
            case EKeyboard.RIGHT:
                this.setState({ current: this.animatorIdleRight });
                break;
        }
    }

    switchAnimatorWalk = (keypress: EKeyboard) => {
        switch(keypress) {
            case EKeyboard.UP:
                this.setState({ current: this.animatorWalkUp });
                break;
            case EKeyboard.DOWN:
                this.setState({ current: this.animatorWalkDown });
                break;
            case EKeyboard.LEFT:
                this.setState({ current: this.animatorWalkLeft });
                break;
            case EKeyboard.RIGHT:
                this.setState({ current: this.animatorWalkRight });
                break;
        }
    }

}

const animatorService = new AnimatorService();
export default animatorService;