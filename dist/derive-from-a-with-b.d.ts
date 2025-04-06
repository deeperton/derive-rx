import { Observable } from 'rxjs';
export declare function deriveFromAWithB<A, B, R>(a$: Observable<A>, b$: Observable<B>, combine: (a: A, b: B) => R): Observable<R>;
export declare function deriveFromAWithB<A, B extends readonly unknown[], R>(a$: Observable<A>, bList: {
    [K in keyof B]: Observable<B[K]>;
}, combine: (a: A, ...b: B) => R): Observable<R>;
