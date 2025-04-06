import { Observable } from 'rxjs';
export declare function deriveFromBoth<A, B, R>(a$: Observable<A>, b$: Observable<B>, combine: (a: A, b: B) => R): Observable<R>;
export declare function deriveFromBoth<T extends readonly unknown[], R>(sources: {
    [K in keyof T]: Observable<T[K]>;
}, combine: (values: T) => R): Observable<R>;
