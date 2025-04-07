import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Derives a new observable from two observables A and B.
 * @param {Observable<A>} a$
 * @param {Observable<B>} b$
 * @param {(a: A, b: B) => R} combine
 * @returns {Observable<R>}
 */
export function deriveFromBoth<A, B, R>(
  a$: Observable<A>,
  b$: Observable<B>,
  combine: (a: A, b: B) => R
): Observable<R>;

/**
 * Derives a new observable from an observable A and an array of observables B.
 * @param {ReadonlyArray<Observable<unknown>>} sources
 * @param {(values: T) => R} combine
 * @returns {Observable<R>}
 */
export function deriveFromBoth<T extends readonly unknown[], R>(
  sources: { [K in keyof T]: Observable<T[K]> },
  combine: (values: T) => R
): Observable<R>;

/**
 * Derives a new observable from an observable A and a function that returns an observable B.
 * @param args
 * @returns {Observable<any>}
 */
export function deriveFromBoth(...args: any[]): Observable<any> {
  if (Array.isArray(args[0])) {
    const sources = args[0];
    const combine = args[1];
    return combineLatest(sources).pipe(map(combine));
  } else {
    const sources = args.slice(0, -1);
    const combine = args[args.length - 1];
    return combineLatest(sources).pipe(map((vals: any[]) => combine(...vals)));
  }
}
