import { BehaviorSubject, skip } from 'rxjs';
import { take, tap, toArray } from 'rxjs/operators';
import {
  deriveFromBoth,
} from './getiter';
import {  describe, it, expect, beforeEach } from 'vitest';

describe('deriveFromBoth Base', () => {
  let A: BehaviorSubject<number>;
  let B: BehaviorSubject<number>;

  beforeEach(() => {
    A = new BehaviorSubject<number>(0); // <-- Initial values matter here
    B = new BehaviorSubject<number>(0);
  });

  describe('deriveFromBoth', () => {
    it('should emit immediately with initial values', () => new Promise<void>((done) => {
      const derived$ = deriveFromBoth(A, B, (a, b) => a + b);

      derived$.pipe(take(1)).subscribe(val => {
        expect(val).toBe(0); // 0 + 0
        done();
      });
    }));

    it('should emit updated values when A or B change', () => new Promise<void>((done) => {
      const derived$ = deriveFromBoth(A, B, (a, b) => a * b);

      derived$.pipe(skip(1), take(3), toArray()).subscribe(vals => {
        expect(vals).toEqual([0, 10, 30]);
        done();
      });
      A.next(2);  // 2 * 0 = 0
      B.next(5);  // 2 * 5 = 10
      A.next(6);  // 6 * 5 = 30
    }));
  });
});
