import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

type LoadingServiceState = {
  blocked: boolean;
};

const initialState: LoadingServiceState = {
  blocked: false,
};

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _state = new BehaviorSubject<LoadingServiceState>(initialState);
  readonly isBlock$ = this._state
    .asObservable()
    .pipe(map((state) => state.blocked));

  block(): void {
    this._state.next({ blocked: true });
  }

  unblock(): void {
    this._state.next({ blocked: false });
  }
}
