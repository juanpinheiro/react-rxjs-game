import Store from 'services/store';
import Vector2 from 'models/Vector2';
import { EKeyboard } from 'shared/enums';
import mapService from './mapService';
import { Subject } from 'rxjs';
import keyboardService from './keyboardService';
import { distinctUntilChanged } from 'rxjs/operators';

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
    private coordinates$ = new Subject<Vector2>();
    private position$ = new Subject<Vector2>();

    constructor() {
        super(INITIAL_STATE);

        keyboardService.getState
            .pipe(
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
            )
            .subscribe((keyboard) => {
                const nextCoordinates = this.currentState().coordinates.copy();
                
                switch(keyboard.keypress) {
                    case EKeyboard.UP:
                        nextCoordinates.up();
                        break;
                    case EKeyboard.DOWN:
                        nextCoordinates.down();
                        break;
                    case EKeyboard.LEFT:
                        nextCoordinates.left();
                        break;
                    case EKeyboard.RIGHT:
                        nextCoordinates.right();
                        break;
                }

                if (this.validateCoordinates(nextCoordinates)) {
                    if (keyboard.isPressed && keyboard.keypress !== keyboard.previousKey) {
                        this.coordinates$.next(nextCoordinates.copy());
                        this.setState({ isWalking: true });
                    }

                    if (!keyboard.isPressed) {
                        this.setState({ isWalking: false });
                    }
                }
            });

        this.coordinates$.asObservable()
            .subscribe((coordinates) => {
                this.setState({ coordinates });

                const newPosition = coordinates.copy().scale(mapService.tileWidth);

                this.position$.next(newPosition);
            });

        this.position$.asObservable()
            .subscribe((position) => {
                this.setState({ position });
            })
    
    }
    
    public walk = (keyboard: EKeyboard) => {
        this.setState({ isWalking: true });

        const currentCoordinates = this.currentState().coordinates;
        const newCoordinates = currentCoordinates.copy();
        
        if (this.validateCoordinates(newCoordinates)) {

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