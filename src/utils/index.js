// @flow

/**
 * Function that checks whether a string contains a number e.g. "123".
 */
export function isNumeric(num: string): boolean {
    return !isNaN(num)
}
