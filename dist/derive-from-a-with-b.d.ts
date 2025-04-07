import { Observable } from 'rxjs';
/**
 * Derives a new observable from an observable A and an observable B.
 * @param {Observable<A>} a$
 * @param {Observable<B>} b$
 * @param {(a: A, b: B) => R} combine
 * @returns {Observable<R>}
 */
export declare function deriveFromAWithB<A, B, R>(a$: Observable<A>, b$: Observable<B>, combine: (a: A, b: B) => R): Observable<R>;
/**
 * Derives a new observable from an observable A and an array of observables B.
 * @param {Observable<A>} a$
 * @param {ReadonlyArray<Observable<unknown>>} bList
 * @param {(a: A, ...b: B) => R} combine
 * @returns {Observable<R>}
 */
export declare function deriveFromAWithB<A, B extends readonly unknown[], R>(a$: Observable<A>, bList: {
    [K in keyof B]: Observable<B[K]>;
}, combine: (a: A, ...b: B) => R): Observable<R>;
