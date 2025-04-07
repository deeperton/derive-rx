"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveFromDynamicB = deriveFromDynamicB;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/**
 * Derives a new observable from an observable A and a function that returns an observable B.
 * @param args
 * @returns {Observable<any>}
 */
function deriveFromDynamicB(...args) {
    const a$ = args[0];
    const bFn = args[1];
    const combine = args[2];
    return a$.pipe((0, rxjs_1.switchMap)((a) => {
        const b = bFn(a);
        if (Array.isArray(b)) {
            return (0, rxjs_1.combineLatest)(b).pipe((0, operators_1.map)((bValues) => combine(a, ...bValues)));
        }
        else {
            return b.pipe((0, operators_1.map)((bValue) => combine(a, bValue)));
        }
    }));
}
