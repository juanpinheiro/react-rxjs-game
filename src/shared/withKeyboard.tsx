import React from 'react';
import { EKeyboard } from 'shared/enums';
import keyboardService from 'services/keyboardService';

interface IKeyboardState {
    keypress: string;
    isKeypressed: boolean;
}

export const withKeyboard = <T extends object>(WrappedComponent: React.ComponentClass<T>) => class Keyboard extends React.Component<T, IKeyboardState> {
    state = {
        keypress: '',
        isKeypressed: false
    }
    
    componentDidMount() {
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('keydown', this.onKeyDown);
    }

    onKeyDown = (event: any) => {
        switch(event.key) {
            case EKeyboard.UP:
                keyboardService.setKeypress(event.key as EKeyboard.UP);
                return;
            case EKeyboard.DOWN:
                keyboardService.setKeypress(event.key as EKeyboard.DOWN);
                return;
            case EKeyboard.LEFT:
                keyboardService.setKeypress(event.key as EKeyboard.LEFT);
                return;
            case EKeyboard.RIGHT:
                keyboardService.setKeypress(event.key as EKeyboard.RIGHT);
                return;
        }
    }

    onKeyUp = (event: any) => {
        switch(event.key) {
            case EKeyboard.UP:
            case EKeyboard.DOWN:
            case EKeyboard.LEFT:
            case EKeyboard.RIGHT:
                keyboardService.setKeypress(EKeyboard.NONE);
                return;
        }
    }
    
    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    render() {
        return <WrappedComponent {...this.props} />
    }
}
