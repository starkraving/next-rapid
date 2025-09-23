import match from '../../libs/match';
describe('match', () => {
  it('returns the value of the first true case', () => {
    const result = match([
      [false, () => 'a'],
      [true, () => 'b'],
      [true, () => 'c'],
    ]);
    expect(result).toBe('b');
  });
  it('returns null if no cases are true', () => {
    const result = match([
      [false, () => 'a'],
      [false, () => 'b'],
    ]);
    expect(result).toBeNull();
  });
});
