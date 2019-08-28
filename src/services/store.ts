import { BehaviorSubject, Observable } from "rxjs";

class Store<T> {
  getState: Observable<T>;
  state$: BehaviorSubject<T>;

  constructor(initialState: T) {
    this.state$ = new BehaviorSubject<T>({ ...initialState });
    this.getState = this.state$.asObservable();
  }

  currentState = (): T => this.state$.getValue();

  setState = (newState: Partial<T>) => {    
    const currentState = this.currentState();

    this.state$.next({
      ...currentState,
      ...newState
    });
  };
};

export default Store;
