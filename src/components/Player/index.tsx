import React from 'react';

import { Animator } from 'models/Animator';
import { withKeyboard } from 'shared/withKeyboard';
import { EKeyboard } from 'shared/enums';
import playerService from 'services/playerService';
import { bindComponent } from 'shared/operators/bindComponent';
import { IVector2 } from 'shared/interfaces';
import { distinctUntilChanged } from 'rxjs/operators';
import characterIdleDown from 'assets/Character/Char_two/Idle/Char2_idle_down.png';

interface IProps { }

interface IState {
    position: IVector2;
    animator: Animator;
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
    }

    componentDidMount() {
        this.animate();

        playerService.getState
            .pipe(
                bindComponent(this),
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
            )
            .subscribe((player) => {
                this.setState({
                    position: {
                        x: player.position.x,
                        y: player.position.y,
                    }
                });

                this.setState({
                    animator: player.animator
                })
            });
    }

    animate = () => {
        setTimeout(() => {
            this.state.animator.nextFrame();
            this.setState({ animator: this.state.animator });
            requestAnimationFrame(() => this.animate());
        }, 600/this.state.animator.spritesLength);
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