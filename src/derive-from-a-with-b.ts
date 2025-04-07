import { Observable, combineLatest } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

/**
 * Derives a new observable from an observable A and an observable B.
 * @param {Observable<A>} a$
 * @param {Observable<B>} b$
 * @param {(a: A, b: B) => R} combine
 * @returns {Observable<R>}
 */
export function deriveFromAWithB<A, B, R>(
  a$: Observable<A>,
  b$: Observable<B>,
  combine: (a: A, b: B) => R
): Observable<R>;

/**
 * Derives a new observable from an observable A and an array of observables B.
 * @param {Observable<A>} a$
 * @param {ReadonlyArray<Observable<unknown>>} bList
 * @param {(a: A, ...b: B) => R} combine
 * @returns {Observable<R>}
 */
export function deriveFromAWithB<A, B extends readonly unknown[], R>(
  a$: Observable<A>,
  bList: { [K in keyof B]: Observable<B[K]> },
  combine: (a: A, ...b: B) => R
): Observable<R>;

/**
 * Derives a new observable from an observable A and a function that returns an observable B.
 * @param args
 * @returns {Observable<any>}
 */
export function deriveFromAWithB(...args: any[]): Observable<any> {
  const a$ = args[0];
  const b = args[1];
  const combine = args[2];

  if (Array.isArray(b)) {
    return a$.pipe(
      withLatestFrom(...b),
      map(([a, ...bs]) => combine(a, ...bs))
    );
  } else {
    return a$.pipe(
      withLatestFrom(b),
      map(([a, bVal]) => combine(a, bVal))
    );
  }
}
