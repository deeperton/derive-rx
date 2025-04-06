import { Observable, combineLatest, switchMap } from 'rxjs';
import { map, shareReplay, withLatestFrom } from 'rxjs/operators';

// combineLatest version
export function deriveFromBoth<T, U, R>(
  A$: Observable<T>,
  B$: Observable<U>,
  compute: (a: T, b: U) => R
): Observable<R> {
  return combineLatest([A$, B$]).pipe(
    map(([a, b]) => {
      return compute(a, b)
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );
}

// A triggers, pulls latest B
export function deriveFromAWithB<T, U, R>(
  A$: Observable<T>,
  B$: Observable<U>,
  compute: (a: T, b: U) => R
): Observable<R> {
  return A$.pipe(
    withLatestFrom(B$),
    map(([a, b]) => compute(a, b)),
    shareReplay({ bufferSize: 1, refCount: true })
  );
}

export function deriveFromDynamicB<A, B, R>(
  A$: Observable<A>,
  BFn: (a: A) => Observable<B>,
  combineFn: (a: A, b: B) => R
): Observable<R> {
  return A$.pipe(
    switchMap(a =>
      BFn(a).pipe(
        map(b => combineFn(a, b))
      )
    )
  );
}
