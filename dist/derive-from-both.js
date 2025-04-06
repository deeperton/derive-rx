"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveFromBoth = deriveFromBoth;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
// Implementation
function deriveFromBoth(...args) {
    if (Array.isArray(args[0])) {
        const sources = args[0];
        const combine = args[1];
        return (0, rxjs_1.combineLatest)(sources).pipe((0, operators_1.map)(combine));
    }
    else {
        const sources = args.slice(0, -1);
        const combine = args[args.length - 1];
        return (0, rxjs_1.combineLatest)(sources).pipe((0, operators_1.map)((vals) => combine(...vals)));
    }
}
