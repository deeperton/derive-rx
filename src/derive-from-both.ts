import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Overload 1: Spread-style observables + combine function
export function deriveFromBoth<A, B, R>(
  a$: Observable<A>,
  b$: Observable<B>,
  combine: (a: A, b: B) => R
): Observable<R>;

// Overload 2: Array-style observables + combine function
export function deriveFromBoth<T extends readonly unknown[], R>(
  sources: { [K in keyof T]: Observable<T[K]> },
  combine: (values: T) => R
): Observable<R>;

// Implementation
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
