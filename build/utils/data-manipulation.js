"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepCopy = void 0;
function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
}
exports.deepCopy = deepCopy;
