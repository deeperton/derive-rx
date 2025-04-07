import { Observable } from 'rxjs';
/**
 * Derives a new observable from an observable A and a function that returns an observable B.
 * @param {Observable<A>} a$
 * @param {(a: A) => Observable<B>} bFn
 * @param {(a: A, b: B) => R} combine
 * @returns {Observable<R>}
 */
export declare function deriveFromDynamicB<A, B, R>(a$: Observable<A>, bFn: (a: A) => Observable<B>, combine: (a: A, b: B) => R): Observable<R>;
/**
 * Derives a new observable from an observable A and a function that returns an array of observables B.
 * @param {Observable<A>} a$
 * @param {(a: A) => ReadonlyArray<Observable<unknown>>} bFn
 * @param {(a: A, ...b: B) => R} combine
 * @returns {Observable<R>}
 */
export declare function deriveFromDynamicB<A, B extends readonly unknown[], R>(a$: Observable<A>, bFn: (a: A) => {
    [K in keyof B]: Observable<B[K]>;
}, combine: (a: A, ...b: B) => R): Observable<R>;
