import React from 'react';
import { EKeyboard } from 'shared/enums';
import keyboardService from 'services/keyboardService';

interface IKeyboardState {
    keypress: string;
    isKeypressed: number;
}

export const withKeyboard = <T extends object>(WrappedComponent: React.ComponentClass<T>) => class Keyboard extends React.Component<T, IKeyboardState> {
    state = {
        keypress: '',
        isKeypressed: 0
    }
    
    componentDidMount() {
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('keydown', this.onKeyDown);
    }

    onKeyDown = (event: any) => {
        this.setState({ isKeypressed: this.state.isKeypressed + 1 });
        
        switch(event.key) {
            case EKeyboard.UP:
                keyboardService.setKeypress(event.key as EKeyboard.UP, this.state.isKeypressed);
                return;
            case EKeyboard.DOWN:
                keyboardService.setKeypress(event.key as EKeyboard.DOWN, this.state.isKeypressed);
                return;
            case EKeyboard.LEFT:
                keyboardService.setKeypress(event.key as EKeyboard.LEFT, this.state.isKeypressed);
                return;
            case EKeyboard.RIGHT:
                keyboardService.setKeypress(event.key as EKeyboard.RIGHT, this.state.isKeypressed);
                return;
        }
    }

    onKeyUp = (event: any) => {
        switch(event.key) {
            case EKeyboard.UP:
            case EKeyboard.DOWN:
            case EKeyboard.LEFT:
            case EKeyboard.RIGHT:
                keyboardService.setKeypress(EKeyboard.NONE, 0);
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
