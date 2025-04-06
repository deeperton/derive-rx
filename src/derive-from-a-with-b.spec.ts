import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BehaviorSubject, combineLatest, Observable, skip, Subject } from 'rxjs';
import { take, tap, toArray } from 'rxjs/operators';

import { deriveFromAWithB } from './derive-from-a-with-b';

describe('getDerivedValueFromA Base', () => {
  let A: BehaviorSubject<number>;
  let B: BehaviorSubject<number>;

  beforeEach(() => {
    A = new BehaviorSubject<number>(0); // <-- Initial values matter here
    B = new BehaviorSubject<number>(0);
  });

  describe('getDerivedValueFromA', () => {
    it('should emit only when A emits', () => new Promise<void>((done) => {
      const derived$ = deriveFromAWithB(A, B, (a, b) => a - b);

      const result: number[] = [];

      derived$.pipe(skip(1), take(2), toArray()).subscribe(vals => {
        expect(vals).toEqual([0, 1]); // (0 - 0), then (1 - 0)
        done();
      });

      A.next(0);
      A.next(1);
    }));

    it('should replay last emitted value after emissions', () => new Promise<void>((done) => {
      const derived$ = deriveFromAWithB(A, B, (a, b) => a + b);

      A.next(3); // emits 3 + 0 = 3

      derived$.pipe(take(1)).subscribe(val => {
        expect(val).toBe(3);
        done();
      });
    }));

    it('should emit updated values when A changes', () => new Promise<void>((done) => {
      const derived$ = deriveFromAWithB(A, B, (a, b) => a + b);

      A.next(3); // emits 3 + 0 = 3

      let counter = 0;

      combineLatest([derived$]).pipe(
        tap(([val]) => {
          if (counter === 0) {
            expect(val).toBe(3);
            counter++;
          } else if (counter === 1) {
            expect(val).toBe(8);
            done();
          }
        })
      ).subscribe(() => {});

      A.next(8); // emits 8 + 0 = 8
    }));
  });
});
