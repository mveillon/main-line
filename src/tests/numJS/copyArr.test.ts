import { copyArr, numArray } from "../../utils/numJS";

test('copy', () => {
  const as = [
    0,
    [1, 2, 3],
    [
      [4, 5, 6],
      [7, 8, 9]
    ],
    [
      [
        [10, 11, 12, 13],
        [14, 15, 16, 17]
      ],
      [
        [18, 19, 20, 21],
        [22, 23, 24, 25]
      ]
    ]
  ];
  for (const a of as) {
    const cop = copyArr(a);
    expect(cop).toEqual(a);
    let current = a;
    let last: numArray = a;
    while (Array.isArray(current)) {
      last = current;
      current = current[0];
    }
    if (Array.isArray(last)) {
      (last as number[])[0] += 1;
      expect(cop).not.toEqual(a);
    }
  }
});
