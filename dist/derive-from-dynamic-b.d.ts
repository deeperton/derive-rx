import { Observable } from 'rxjs';
export declare function deriveFromDynamicB<A, B, R>(a$: Observable<A>, bFn: (a: A) => Observable<B>, combine: (a: A, b: B) => R): Observable<R>;
export declare function deriveFromDynamicB<A, B extends readonly unknown[], R>(a$: Observable<A>, bFn: (a: A) => {
    [K in keyof B]: Observable<B[K]>;
}, combine: (a: A, ...b: B) => R): Observable<R>;
