import { Observable } from 'rxjs';
/**
 * Derives a new observable from two observables A and B.
 * @param {Observable<A>} a$
 * @param {Observable<B>} b$
 * @param {(a: A, b: B) => R} combine
 * @returns {Observable<R>}
 */
export declare function deriveFromBoth<A, B, R>(a$: Observable<A>, b$: Observable<B>, combine: (a: A, b: B) => R): Observable<R>;
/**
 * Derives a new observable from an observable A and an array of observables B.
 * @param {ReadonlyArray<Observable<unknown>>} sources
 * @param {(values: T) => R} combine
 * @returns {Observable<R>}
 */
export declare function deriveFromBoth<T extends readonly unknown[], R>(sources: {
    [K in keyof T]: Observable<T[K]>;
}, combine: (values: T) => R): Observable<R>;
