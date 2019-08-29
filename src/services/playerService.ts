import Store from 'services/store';
import Vector2 from 'models/Vector2';
import { EKeyboard } from 'shared/enums';
import mapService from './mapService';
import { combineLatest, Observable, interval, range, asyncScheduler, queueScheduler } from 'rxjs';
import keyboardService from './keyboardService';
import { distinctUntilChanged, map, switchMap, zip, skip, throttleTime, filter, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';


interface IPlayerState {
    animationInProgress: boolean;
    coordinates: Vector2;
    position: Vector2;
}

const INITIAL_STATE: IPlayerState = {
    animationInProgress: false,
    coordinates: new Vector2(),
    position: new Vector2()
}

class PlayerService extends Store<IPlayerState> {
    private PLAYER_SPEED = 18;
    private PLAYER_POSITION_FRAMES = 16;

    private coordinates$ = new BehaviorSubject<Vector2>(new Vector2());
    private position$ = new BehaviorSubject<Vector2>(new Vector2());

    constructor() {
        super(INITIAL_STATE);

        combineLatest(
            keyboardService.getState.pipe(
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
            ),
            this.getState.pipe(
                distinctUntilChanged((a, b) => JSON.stringify(a.coordinates) === JSON.stringify(b.coordinates)),
                map((state) => {
                    return new Vector2(state.coordinates.x, state.coordinates.y)
                })
            ),
        )
        .pipe(throttleTime((this.PLAYER_SPEED * this.PLAYER_POSITION_FRAMES)))
        .subscribe(([keyboard, coordinates]) => {
            const newCoordinates = new Vector2(coordinates.x, coordinates.y);
            if (this.validateCoordinates(newCoordinates)) {
                switch(keyboard.keypress) {
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
                
                if (keyboard.isPressed > 0) {
                    this.coordinates$.next(newCoordinates);
                }
            }
        });


        this.defineCoordinates()
            .subscribe(([coordinates]) => {
                this.setState({ coordinates });
            });

        this.definePosition()
            .subscribe((position) => {
                this.setState({ position });
                this.position$.next(position);
            });
    }

    private defineCoordinates = () => {
        return combineLatest(
            this.coordinates$.pipe(
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
            ),
            this.position$.pipe(
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
            )
        ).pipe(
            filter(([coordinates, position]) => {
                const nextPosition = new Vector2(coordinates.x, coordinates.y).scale(16);
                return nextPosition.x === position.x && nextPosition.y === position.y
            })
        ).pipe(
            tap(() => this.setState({ animationInProgress: false }))
        );
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

    private definePosition = (): Observable<Vector2> => {
        return this.coordinates$.asObservable()
            .pipe(
                skip(1),
                throttleTime(this.PLAYER_SPEED * this.PLAYER_POSITION_FRAMES),
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
                switchMap(
                    (coordinates) => range(1, this.PLAYER_POSITION_FRAMES)
                    .pipe(
                        zip(interval(this.PLAYER_SPEED), (frame) => this.verifyNextPosition(frame, coordinates))
                ))
            );
    }

    private verifyNextPosition = (scale, nextCoordenates: Vector2) => {
        const prevCoordenates = new Vector2(this.currentState().coordinates.x, this.currentState().coordinates.y);
        const prevPosition = new Vector2(prevCoordenates.x, prevCoordenates.y).scale(16);

        if (prevCoordenates.x < nextCoordenates.x) {
            return new Vector2(
                (prevPosition.x + scale) * (mapService.tileWidth / this.PLAYER_POSITION_FRAMES),
                prevPosition.y
            );
        }

        if (prevCoordenates.x > nextCoordenates.x) {
            return new Vector2(
                (prevPosition.x - scale)  * (mapService.tileWidth / this.PLAYER_POSITION_FRAMES),
                prevPosition.y
            );
        }

        if (prevCoordenates.y > nextCoordenates.y) {
            return new Vector2(
                prevPosition.x,
                (prevPosition.y - scale) * (mapService.tileWidth / this.PLAYER_POSITION_FRAMES),
            );        
        }

        if (prevCoordenates.y < nextCoordenates.y) {
            return new Vector2(
                prevPosition.x,
                (prevPosition.y + scale) * (mapService.tileWidth / this.PLAYER_POSITION_FRAMES),
            );        
        }

        return new Vector2();        
    }
}

const playerService = new PlayerService();
export default playerService;