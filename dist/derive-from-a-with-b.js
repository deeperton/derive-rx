"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveFromAWithB = deriveFromAWithB;
const operators_1 = require("rxjs/operators");
/**
 * Derives a new observable from an observable A and a function that returns an observable B.
 * @param args
 * @returns {Observable<any>}
 */
function deriveFromAWithB(...args) {
    const a$ = args[0];
    const b = args[1];
    const combine = args[2];
    if (Array.isArray(b)) {
        return a$.pipe((0, operators_1.withLatestFrom)(...b), (0, operators_1.map)(([a, ...bs]) => combine(a, ...bs)));
    }
    else {
        return a$.pipe((0, operators_1.withLatestFrom)(b), (0, operators_1.map)(([a, bVal]) => combine(a, bVal)));
    }
}
