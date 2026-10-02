import { describe, it, expect } from 'vitest';
import { splitSentences } from './splitSentences';

describe('splitSentences', () => {
  it('splits the Korean hero subtitle at the sentence end', () => {
    expect(
      splitSentences(
        '10,000개가 넘는 아이콘에서 하나를 골라 색상과 크기를 바꾸고 PNG나 SVG로 바로 다운로드하세요. 디자이너와 개발자가 쓰기 좋게 만든 도구입니다.',
      ),
    ).toEqual([
      '10,000개가 넘는 아이콘에서 하나를 골라 색상과 크기를 바꾸고 PNG나 SVG로 바로 다운로드하세요.',
      '디자이너와 개발자가 쓰기 좋게 만든 도구입니다.',
    ]);
  });

  it('splits English sentences ending in . ? and !', () => {
    expect(splitSentences('Pick an icon. Want a color? Done! Export it.')).toEqual([
      'Pick an icon.',
      'Want a color?',
      'Done!',
      'Export it.',
    ]);
  });

  it('splits Korean questions and exclamations', () => {
    expect(splitSentences('무료인가요? 네, 완전히 무료입니다! 가입도 필요 없어요.')).toEqual([
      '무료인가요?',
      '네, 완전히 무료입니다!',
      '가입도 필요 없어요.',
    ]);
  });

  it('splits at the ideographic full stop followed by a space', () => {
    expect(splitSentences('一つ目。 二つ目。')).toEqual(['一つ目。', '二つ目。']);
  });

  it('keeps periods that are not followed by whitespace', () => {
    expect(
      splitSentences('Works with Next.js and React. Over 10,000 icons in v1.0, down to 0.5px strokes.'),
    ).toEqual(['Works with Next.js and React.', 'Over 10,000 icons in v1.0, down to 0.5px strokes.']);
  });

  it('keeps URLs and email addresses intact', () => {
    expect(splitSentences('Visit https://iconyapp.com/faq.html for more. Or mail hi@iconyapp.com today.')).toEqual([
      'Visit https://iconyapp.com/faq.html for more.',
      'Or mail hi@iconyapp.com today.',
    ]);
  });

  it('does not split after e.g., i.e. or vs.', () => {
    expect(
      splitSentences('Pick a format, e.g. SVG or PNG. Lucide vs. Tabler is a common choice. Same size, i.e. 24px.'),
    ).toEqual(['Pick a format, e.g. SVG or PNG.', 'Lucide vs. Tabler is a common choice.', 'Same size, i.e. 24px.']);
  });

  it('handles abbreviations after an opening parenthesis', () => {
    expect(splitSentences('Use any format (e.g. SVG) you like. Done.')).toEqual([
      'Use any format (e.g. SVG) you like.',
      'Done.',
    ]);
  });

  it('does not split inside parentheses', () => {
    expect(splitSentences('Icons are free (no sign-up. no watermark.) for everyone. Enjoy.')).toEqual([
      'Icons are free (no sign-up. no watermark.) for everyone.',
      'Enjoy.',
    ]);
  });

  it('does not split inside quotes', () => {
    expect(splitSentences('Click "Download. Then save." to finish. 그리고 「저장. 완료.」 를 누르세요.')).toEqual([
      'Click "Download. Then save." to finish.',
      '그리고 「저장. 완료.」 를 누르세요.',
    ]);
  });

  it('ignores apostrophes when tracking quotes', () => {
    expect(splitSentences("It's free. Don't worry.")).toEqual(["It's free.", "Don't worry."]);
  });

  it('falls back to plain splitting when brackets are unbalanced', () => {
    expect(splitSentences('A stray ( here. Next one.')).toEqual(['A stray ( here.', 'Next one.']);
  });

  it('treats runs of terminators and ellipses as one end', () => {
    expect(splitSentences('Really?! Yes... Okay.')).toEqual(['Really?!', 'Yes...', 'Okay.']);
  });

  it('splits on newlines as whitespace and trims', () => {
    expect(splitSentences('  First line.\nSecond line.  ')).toEqual(['First line.', 'Second line.']);
  });

  it('returns a single sentence unchanged and nothing for empty input', () => {
    expect(splitSentences('No terminator here')).toEqual(['No terminator here']);
    expect(splitSentences('')).toEqual([]);
  });
});
