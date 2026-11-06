'use strict';

// Nhận diện ý định của bình luận theo TỪ NGUYÊN VẸN, không phân biệt có dấu/không dấu.
// Trước đây dùng includes() nên "que" bắt cả "quen", "quẹt"; "chuong" bắt "chương";
// "nguyen" bắt họ "Nguyễn" → bình luận thường bị biến thành xin xăm / thỉnh chuông.

function foldVietnamese(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Mỗi cụm có hai dạng: có dấu (khớp chính xác) và gấp dấu (khớp khi người xem gõ không dấu).
// Cụm một âm tiết dễ trùng nghĩa khác nên chỉ khớp bản có dấu.
const INTENTS = [
  {
    intent: 'fortune',
    exact: ['xin xăm', 'gieo quẻ', 'rút quẻ', 'xin quẻ', 'quẻ'],
    folded: ['xin xam', 'gieo que', 'rut que', 'xin que']
  },
  {
    intent: 'bell',
    exact: ['thỉnh chuông', 'đánh chuông', 'chuông'],
    folded: ['thinh chuong', 'danh chuong']
  },
  {
    intent: 'woodenFish',
    exact: ['gõ mõ', 'tụng kinh'],
    folded: ['go mo', 'tung kinh']
  },
  {
    intent: 'incense',
    exact: ['thắp hương', 'dâng hương', 'thắp nhang', 'bái phật', 'lạy phật'],
    folded: ['thap huong', 'dang huong', 'thap nhang', 'bai phat', 'lay phat']
  },
  {
    intent: 'prayer',
    exact: ['cầu', 'nguyện', 'nam mô', 'mô phật', 'a di đà', 'bình an', 'tài lộc', 'chúc'],
    folded: ['cau nguyen', 'cau binh an', 'cau mong', 'nam mo', 'mo phat', 'a di da', 'binh an', 'tai loc', 'chuc mung']
  }
];

function toWordPattern(phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, 'u');
}

const COMPILED = INTENTS.map(({ intent, exact, folded }) => ({
  intent,
  exact: exact.map(toWordPattern),
  folded: folded.map(toWordPattern)
}));

/**
 * @param {string} text bình luận đã làm sạch
 * @returns {'fortune'|'bell'|'woodenFish'|'incense'|'prayer'|'default'}
 */
function detectCommentIntent(text) {
  const lower = String(text || '').normalize('NFC').toLowerCase();
  const folded = foldVietnamese(text);
  for (const { intent, exact, folded: foldedPatterns } of COMPILED) {
    if (exact.some((re) => re.test(lower))) return intent;
    if (foldedPatterns.some((re) => re.test(folded))) return intent;
  }
  return 'default';
}

module.exports = { detectCommentIntent, foldVietnamese };
