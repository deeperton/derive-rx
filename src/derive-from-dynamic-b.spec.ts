import { vi, describe, it, expect } from 'vitest';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import {
  deriveFromDynamicB
} from './getiter';

describe('getDerivedDynamicB Base', () => {
  describe('getDerivedDynamicB', () => {
    it('should emit when B emits using initial A', () => new Promise<void>((done) => {
      const A = new BehaviorSubject<number>(1);
      const B1 = new BehaviorSubject<number>(10);

      const derived$ = deriveFromDynamicB(
        A,
        (a) => B1,
        (a, b) => a + b
      );

      derived$.subscribe(val => {
        expect(val).toBe(11); // 1 + 10
        done();
      });

      B1.next(10); // triggers emission
    }));

    it('should switch to a new B when A changes', () => new Promise<void>((done) => {
      const A = new BehaviorSubject<number>(1);
      const B1 = new BehaviorSubject<number>(10);
      const B2 = new BehaviorSubject<number>(100);

      const BFn = vi.fn((a: number): Observable<number> => {
        return a === 1 ? B1 : B2;
      });

      const result: number[] = [];

      const derived$ = deriveFromDynamicB(
        A,
        BFn,
        (a, b) => a + b
      );

      derived$.subscribe(val => {
        result.push(val);
        if (result.length === 4) {
          expect(result).toEqual([11, 12, 102, 202]); // 1+10, then 2+200
          done();
        }
      });

      B1.next(11);     // emits 12
      A.next(2);       // switches to B2
      B2.next(200);    // emits 2 + 200 = 202
    }));

    it('should emit multiple times for same A if B emits multiple times', () => new Promise<void>((done) => {
      const A = new BehaviorSubject<number>(5);
      const B = new BehaviorSubject<number>(1);

      const result: number[] = [];

      const derived$ = deriveFromDynamicB(
        A,
        () => B,
        (a, b) => a * b
      );

      derived$.subscribe(val => {
        result.push(val);
        if (result.length === 4) {
          expect(result).toEqual([5, 5, 10, 15]);
          done();
        }
      });

      B.next(1);  // 5 * 1 = 5
      B.next(2);  // 5 * 2 = 10
      B.next(3);  // 5 * 3 = 15
    }));

    it('should not emit when A changes if B doesn’t emit', () => new Promise<void>((done) => {
      const A = new BehaviorSubject<number>(1);
      const silentB = new Subject<number>(); // doesn't emit

      const derived$ = deriveFromDynamicB(
        A,
        () => silentB,
        (a, b) => a + b
      );

      let emitted = false;

      derived$.subscribe(() => {
        emitted = true;
      });

      A.next(2); // switches to new B, but B doesn't emit

      setTimeout(() => {
        expect(emitted).toBe(false);
        done();
      }, 50); // wait to ensure no emissions
    }));
  });

});
