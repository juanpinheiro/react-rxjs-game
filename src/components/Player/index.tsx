import React from 'react';

import characterIdleDown from 'assets/Character/Char_two/Idle/Char2_idle_down.png';
import characterIdleUp from 'assets/Character/Char_two/Idle/Char2_idle_up.png';
import characterIdleLeft from 'assets/Character/Char_two/Idle/Char2_idle_left.png';
import characterIdleRight from 'assets/Character/Char_two/Idle/Char2_idle_right.png';

import characterWalkDown from 'assets/Character/Char_two/Walk/Char2_walk_down.png';
import characterWalkUp from 'assets/Character/Char_two/Walk/Char2_walk_up.png';
import characterWalkLeft from 'assets/Character/Char_two/Walk/Char2_walk_left.png';
import characterWalkRight from 'assets/Character/Char_two/Walk/Char2_walk_right.png';

import characterAttackDown from 'assets/Character/Char_two/Attack/Char2_attack_down.png';
import { Animator } from 'models/Animator';
import { withKeyboard } from 'shared/withKeyboard';
import { EKeyboard } from 'shared/enums';
import playerService from 'services/playerService';
import { bindComponent } from 'shared/operators/bindComponent';
import { IVector2 } from 'shared/interfaces';
import keyboardService from 'services/keyboardService';
import { distinctUntilChanged } from 'rxjs/operators';

interface IProps {
    keypress?: EKeyboard;
    isKeypressed?: boolean;
}

interface IState {
    isWalking: boolean;
    currentKey: EKeyboard;
    previousKey: EKeyboard;

    position: IVector2;

    animator: Animator;

    animatorIdleDown: Animator;
    animatorIdleUp: Animator;
    animatorIdleLeft: Animator;
    animatorIdleRight: Animator;

    animatorWalkDown: Animator;
    animatorWalkUp: Animator;
    animatorWalkLeft: Animator;
    animatorWalkRight: Animator;

    animatorDownAttack: Animator;
}

class Player extends React.Component<IProps, IState> {
    state = {
        isWalking: false,
        currentKey: EKeyboard.NONE,
        previousKey: EKeyboard.NONE,
        position: {
            x: 0,
            y: 0
        },
        
        animator: new Animator(characterIdleDown, 6, { x: 16, y: 16 }, 'row'),

        animatorIdleDown: new Animator(characterIdleDown, 6, { x: 16, y: 16 }, 'row'),
        animatorIdleUp: new Animator(characterIdleUp, 6, { x: 16, y: 16 }, 'row'),
        animatorIdleLeft: new Animator(characterIdleLeft, 6, { x: 16, y: 16 }, 'row'),
        animatorIdleRight: new Animator(characterIdleRight, 6, { x: 16, y: 16 }, 'row'),

        animatorWalkDown: new Animator(characterWalkDown, 6, { x: 16, y: 16 }, 'row'),
        animatorWalkUp: new Animator(characterWalkUp, 6, { x: 16, y: 16 }, 'row'),
        animatorWalkLeft: new Animator(characterWalkLeft, 6, { x: 16, y: 16 }, 'row'),
        animatorWalkRight: new Animator(characterWalkRight, 6, { x: 16, y: 16 }, 'row'),

        animatorDownAttack: new Animator(characterAttackDown, 6, { x: 16, y: 16 }, 'row'),
    }

    componentDidMount() {
        this.animate();

        keyboardService.getState
            .pipe(
                bindComponent(this),
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
            )
            .subscribe((keyboard) => {
                this.setState({
                    currentKey: keyboard.keypress,
                    previousKey: keyboard.previousKey
                });

                if(keyboard.isPressed && !this.state.isWalking) {
                    playerService.walk(keyboard.keypress);
                }

                if(!keyboard.isPressed) {
                    playerService.stop();
                }
            });
        
        playerService.getState
            .pipe(
                bindComponent(this),
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
            )
            .subscribe((player) => {
                this.setState({ isWalking: player.isWalking });
                this.setState({
                    position: {
                        x: player.position.x,
                        y: player.position.y,
                    }
                });

                if (player.isWalking) {
                    this.switchAnimatorWalk();
                }

                if (!player.isWalking) {
                    this.switchAnimatorIdle();
                }
            });
    }

    animate = () => {
        setTimeout(() => {
            this.state.animator.nextFrame();
            this.setState({ animator: this.state.animator });
            requestAnimationFrame(() => this.animate());
        }, 600/this.state.animator.spritesLength);

    }

    switchAnimatorIdle = () => {
        switch(this.state.previousKey) {
            case EKeyboard.UP:
                this.setState({ animator: this.state.animatorIdleUp });
                return;
            case EKeyboard.DOWN:
                this.setState({ animator: this.state.animatorIdleDown });
                return;
            case EKeyboard.LEFT:
                this.setState({ animator: this.state.animatorIdleLeft });
                return;
            case EKeyboard.RIGHT:
                this.setState({ animator: this.state.animatorIdleRight });
                return;
            default:
                return;
        }
    }

    switchAnimatorWalk = () => {
        switch(this.state.currentKey) {
            case EKeyboard.UP:
                this.setState({ animator: this.state.animatorWalkUp });
                return;
            case EKeyboard.DOWN:
                this.setState({ animator: this.state.animatorWalkDown });
                return;
            case EKeyboard.LEFT:
                this.setState({ animator: this.state.animatorWalkLeft });
                return;
            case EKeyboard.RIGHT:
                this.setState({ animator: this.state.animatorWalkRight });
                return;
            default:
                return;
        }
    }

    render() {
        const { animator, position } = this.state;

        return (
            <>
                <div
                    style={{
                        display: 'inline-block',
                        position: 'absolute',
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        backgroundImage: `url(${animator.file})`,
                        backgroundPosition: `${animator.frame.x}px ${animator.frame.y}px`,
                        width: 16,
                        height: 16,
                        zIndex: 10,
                    }}
                />
            </>
        );
    }
}

export default withKeyboard(Player);