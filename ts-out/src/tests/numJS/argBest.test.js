"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numJS_1 = require("../../utils/numJS");
const random_1 = require("../../utils/random");
test('argMin/Max', () => {
    expect(() => (0, numJS_1.argMin)([])).toThrow(Error);
    expect(() => (0, numJS_1.argMin)([])).toThrow(Error);
    const a = [1, 2, 3, 4];
    expect((0, numJS_1.argMax)(a)).toBe(a.length - 1);
    expect((0, numJS_1.argMin)(a)).toBe(0);
    (0, random_1.shuffle)(a);
    expect(a[(0, numJS_1.argMax)(a)]).toBe(4);
    expect(a[(0, numJS_1.argMin)(a)]).toBe(1);
});
