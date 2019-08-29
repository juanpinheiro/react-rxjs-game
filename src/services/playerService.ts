import Store from 'services/store';
import Vector2 from 'models/Vector2';
import movementService from './movementService';
import animatorService from './animatorService';
import { Animator } from 'models/Animator';


interface IPlayerState {
    animator: Animator;
    coordinates: Vector2;
    position: Vector2;
}

const INITIAL_STATE: IPlayerState = {
    animator: undefined,
    coordinates: new Vector2(),
    position: new Vector2()
}

class PlayerService extends Store<IPlayerState> {
    constructor() {
        super(INITIAL_STATE);

        movementService.getState
            .subscribe((movement) => {
                this.setState( {
                    coordinates: movement.coordinates,
                    position: movement.position
                })
            });

        animatorService.getState
            .subscribe((animator) => {
                this.setState({
                    animator: animator.current
                })
            });
    }
}

const playerService = new PlayerService();
export default playerService;