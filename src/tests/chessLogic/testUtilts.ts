export const compareSetToArray = <T>(s: Set<T>, arr: T[]) => {
    expect(s.size).toBe(arr.length)
    for (const el of arr) {
        expect(s.has(el)).toBeTruthy()
    }
}