import 'jasmine-expect';
import { MarkdownEscapePipe } from './markdown-escape.pipe';
import { BulletPoints } from './markdown-preprocess.pipe';

/**
 * This pipe transforms certain non-markdown tokens (like the bullet point for a list)
 * to known markdown tokens (like the dash for a list).
 * Currently transformed:
 * - Bullet points (all 4 sizes) -> dashes
 */
describe('MarkdownEscapePipe', () => {

  let pipe: MarkdownEscapePipe;

  beforeEach(() => {
    pipe = new MarkdownEscapePipe();
  });

  it('should replace small bullets with dashes', function () {
    const testString = BulletPoints.SMALL_BULLET + 'Developers are the best.';
    const expected = '- Developers are the best.';
    expect(pipe.transform(testString)).toEqual(expected);
  });

  it('should replace medium bullets with dashes', function () {
    const testString = BulletPoints.MEDIUM_BULLET + 'Developers are the best.';
    const expected = '- Developers are the best.';
    expect(pipe.transform(testString)).toEqual(expected);
  });

  it('should replace operator bullets with dashes', function () {
    const testString = BulletPoints.OPERATOR_BULLET + 'Developers are the best.';
    const expected = '- Developers are the best.';
    expect(pipe.transform(testString)).toEqual(expected);
  });

  it('should replace large bullets with dashes', function () {
    const testString = BulletPoints.LARGE_BULLET + 'Developers are the best.';
    const expected = '- Developers are the best.';
    expect(pipe.transform(testString)).toEqual(expected);
  });

  it('should replace all bullets with dashes', function () {
    const testString = BulletPoints.SMALL_BULLET + 'Yesterday is history.\n' +
      BulletPoints.MEDIUM_BULLET + 'Tomorrow is a mystery.' +
      BulletPoints.OPERATOR_BULLET + 'But today is a gift.' +
      BulletPoints.LARGE_BULLET + 'That\'s why it\'s called present.';
    const expected = '- Yesterday is history.\n' +
      '- Tomorrow is a mystery.\n' +
      '- But today is a gift.\n' +
      '- That\'s why it\'s called present.';
    expect(pipe.transform(testString)).toEqual(expected);
  });
});


