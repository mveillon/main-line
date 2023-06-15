import { boolArray } from "./types";

/**
 * Helper function for any and all. Goes through each subarray of bools and
 * checks if any satisfy the criterion. If they do, this will return ifTrue.
 * Otherwise, it returns !ifTrue
 * @param bools the ndArray of booleans to look at
 * @param criterion a function that determines when to early return
 * @param ifTrue what to return when criterion returns tre
 * @returns ifTrue if at least one subarray satisfies criterion, else !ifTrue
 */
const nestedSatisfies = (
  bools: boolArray, 
  criterion: (b: boolArray) => boolean, 
  ifTrue: boolean
): boolean => {

  if (Array.isArray(bools)) {
    if (bools.length === 0) return false;
    
    for (const nested of bools) {
      if (criterion(nested)) {
        return ifTrue;
      }
    }

    return !ifTrue;
  }
  return bools;
}

/**
 * Returns whether every element of bools is true. 
 * Returns false if bools is empty.
 * ```
 * all([]) // output: false
 * all(true) // output: true
 * all([true, false, true]) // output: true
 * all([true, true, true]) // output: true
 * ```
 * @param bools an n-dimensional array of booleans
 * @returns whether all elements of bools are true
 */
export const all = (bools: boolArray): boolean => {
  return nestedSatisfies(bools, b => !all(b), false);
}

/**
 * Returns whether any element of bools is true.
 * Returns false if bools is empty.
 * ```
 * any([]) // output: false
 * any(true) // output: true
 * any([true, false, false]) // output: true
 * any([false, false, false]) // output: false
 * ```
 * @param bools an n-dimensional array of booleans
 * @returns whether any elements of bools are true
 */
export const any = (bools: boolArray): boolean => {
  return nestedSatisfies(bools, b => any(b), true);
}