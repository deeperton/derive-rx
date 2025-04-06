import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BehaviorSubject, combineLatest, Observable, skip, Subject } from 'rxjs';
import { take, tap, toArray } from 'rxjs/operators';
import {
  deriveFromDynamicB,
  deriveFromBoth,
  deriveFromAWithB
} from './getiter';

describe('getDerivedValue (library variants)', () => {
  let A: BehaviorSubject<number>;
  let B: BehaviorSubject<number>;

  beforeEach(() => {
    A = new BehaviorSubject<number>(0); // <-- Initial values matter here
    B = new BehaviorSubject<number>(0);
  });

  describe('getDerivedValueCombine', () => {
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
