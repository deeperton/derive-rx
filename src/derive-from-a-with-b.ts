import { Observable, combineLatest } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

// Overload 1: Single B observable
export function deriveFromAWithB<A, B, R>(
  a$: Observable<A>,
  b$: Observable<B>,
  combine: (a: A, b: B) => R
): Observable<R>;

// Overload 2: Multiple B observables
export function deriveFromAWithB<A, B extends readonly unknown[], R>(
  a$: Observable<A>,
  bList: { [K in keyof B]: Observable<B[K]> },
  combine: (a: A, ...b: B) => R
): Observable<R>;

// Implementation
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
