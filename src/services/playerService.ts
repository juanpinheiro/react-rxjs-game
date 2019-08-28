import Store from 'services/store';
import Vector2 from 'models/Vector2';
import { EKeyboard } from 'shared/enums';
import mapService from './mapService';

interface IPlayerState {
    isWalking: boolean;
    coordinates: Vector2;
    position: Vector2;
}

const INITIAL_STATE: IPlayerState = {
    isWalking: false,
    coordinates: new Vector2(),
    position: new Vector2()
}

class PlayerService extends Store<IPlayerState> {

    constructor() {
        super(INITIAL_STATE);
    }
    public walk = (keyboard: EKeyboard) => {
        this.setState({ isWalking: true });

        const currentCoordinates = this.currentState().coordinates;
        const newCoordinates = currentCoordinates.copy();

        switch(keyboard) {
            case EKeyboard.UP:
                newCoordinates.up();
                break;
            case EKeyboard.DOWN:
                newCoordinates.down();
                break;
            case EKeyboard.LEFT:
                newCoordinates.left();
                break;
            case EKeyboard.RIGHT:
                newCoordinates.right();
                break;
        }

        if (this.validateCoordinates(newCoordinates)) {
            const TILE_SIZE = mapService.tileWidth;

            this.setState({
                coordinates: newCoordinates.copy()
            });

            const newPosition = newCoordinates.scale(TILE_SIZE);
            this.changePosition(newPosition, keyboard);
        }
    }
    
    public stop = () => {
        this.setState({ isWalking: false });
    }


    private validateCoordinates = (coordinates: Vector2) => {
        const MAP_WIDTH = mapService.width;
        const MAP_HEIGHT = mapService.height;

        if (coordinates.x < 0 || coordinates.y < 0) {
            return false;
        }

        if (coordinates.x >= MAP_WIDTH || coordinates.y >= MAP_HEIGHT) {
            return false
        }

        return true;
    }

    private changePosition = (newPosition: Vector2, keyboard: EKeyboard) => {

        const position = this.currentState().position;

        let x: number = position.x;
        let y: number = position.y;
        let next: boolean = false;

        if (newPosition.x > position.x) {
            x = x + 2;
            y = position.y;
            next = x + 2 <= newPosition.x;
        }

        if (newPosition.x < position.x) {
            x = position.x - 2;
            y = position.y;
            
            next = x - 2 >= newPosition.x;
        }

        if (newPosition.y > position.y) {
            x = position.x;
            y = position.y + 2;

            next = y + 2 <= newPosition.y;
        }

        if (newPosition.y < position.y) {
            x = position.x;
            y = position.y - 2;
            
            next = y - 2 >= newPosition.y;
        }

        if (next) {
            setTimeout(() => {
                this.setState({ position: new Vector2(x, y)});
                this.changePosition(newPosition, keyboard);
            }, 10);
        }

        if(!next) {
            console.log(newPosition);
            this.setState({ position: newPosition });

            if(this.currentState().isWalking) {
                console.log('walk');
                this.walk(keyboard);
            }
        }
    }
}

const playerService = new PlayerService();
export default playerService;