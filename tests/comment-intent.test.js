import { describe, expect, test } from 'bun:test';
import { detectCommentIntent } from '../lib/comment-intent.cjs';

describe('detectCommentIntent', () => {
  test.each([
    ['xin xăm đầu năm', 'fortune'],
    ['xin xam cau tai loc', 'fortune'],
    ['cho con một quẻ', 'fortune'],
    ['thỉnh chuông cầu an', 'bell'],
    ['thinh chuong', 'bell'],
    ['gõ mõ tụng kinh', 'woodenFish'],
    ['go mo', 'woodenFish'],
    ['thắp hương bái Phật', 'incense'],
    ['thap nhang', 'incense'],
    ['cầu cho mẹ khỏe', 'prayer'],
    ['nam mo a di da phat', 'prayer'],
    ['binh an nhe', 'prayer'],
    ['chúc mọi người vui', 'prayer']
  ])('%p → %p', (text, expected) => {
    expect(detectCommentIntent(text)).toBe(expected);
  });

  // Các ca bị bắt nhầm ở bản cũ (dùng includes)
  test.each([
    ['quen rồi', 'default'],
    ['quẹt thẻ', 'default'],
    ['chương trình hay quá', 'default'],
    ['Nguyen Van A ghé chơi', 'default'],
    ['cau thu Viet Nam', 'default'],
    ['hello mọi người', 'default']
  ])('không bắt nhầm %p', (text, expected) => {
    expect(detectCommentIntent(text)).toBe(expected);
  });
});
