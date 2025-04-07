import { Observable, switchMap, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Derives a new observable from an observable A and a function that returns an observable B.
 * @param {Observable<A>} a$
 * @param {(a: A) => Observable<B>} bFn
 * @param {(a: A, b: B) => R} combine
 * @returns {Observable<R>}
 */
export function deriveFromDynamicB<A, B, R>(
  a$: Observable<A>,
  bFn: (a: A) => Observable<B>,
  combine: (a: A, b: B) => R
): Observable<R>;

/**
 * Derives a new observable from an observable A and a function that returns an array of observables B.
 * @param {Observable<A>} a$
 * @param {(a: A) => ReadonlyArray<Observable<unknown>>} bFn
 * @param {(a: A, ...b: B) => R} combine
 * @returns {Observable<R>}
 */
export function deriveFromDynamicB<A, B extends readonly unknown[], R>(
  a$: Observable<A>,
  bFn: (a: A) => { [K in keyof B]: Observable<B[K]> },
  combine: (a: A, ...b: B) => R
): Observable<R>;

/**
 * Derives a new observable from an observable A and a function that returns an observable B.
 * @param args
 * @returns {Observable<any>}
 */
export function deriveFromDynamicB(...args: any[]): Observable<any> {
  const a$ = args[0];
  const bFn = args[1];
  const combine = args[2];

  return a$.pipe(
    switchMap((a) => {
      const b = bFn(a);
      if (Array.isArray(b)) {
        return combineLatest(b).pipe(map((bValues) => combine(a, ...bValues)));
      } else {
        return b.pipe(map((bValue: any) => combine(a, bValue)));
      }
    })
  );
}
