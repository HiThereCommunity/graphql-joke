// @flow
import { isNumeric } from '../';

describe('utils isNumeric', () => {

  [
    [ '123', true ],
    [ 'foo', false ]
  ].forEach(([input, expected]) => {
    it(`isNumeric returns ${String(expected)} for string ${input}`, () => {
      expect(isNumeric(input)).toEqual(expected);
    })
  })
})
