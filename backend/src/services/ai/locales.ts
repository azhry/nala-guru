export const LOCALE_HEADER = 'accept-language';

const en = {
  calibrator: {
    correct: (name: string) => `Great job! You solved it correctly at ${name} level!`,
    L1: 'Count each item slowly. Point to each one as you count.',
    L2: 'Try using your fingers to add the numbers together.',
    L3: 'Break the bigger number into tens and ones.',
    L4: 'Start with the bigger number, then count backward.',
    L5: 'Look at the shape edges and corners to count them.',
    fallback: 'Try again! Think carefully about the question.',
  },
  local: {
    L1_0: 'How many apples are there? 🍎🍎🍎',
    L1_1: 'Count the stars: ⭐⭐⭐',
    L1_2: 'How many fingers are on one hand?',
    L1_3: 'Count the balloons: 🎈🎈🎈🎈',
    L1_4: 'How many legs does a cat have?',
    L2_0: 'What is 1 + 1?',
    L2_1: 'What is 2 + 3?',
    L2_2: 'What is 4 + 1?',
    L2_3: 'What is 3 + 3?',
    L2_4: 'What is 2 + 2?',
    L3_0: 'What is 10 + 5?',
    L3_1: 'What is 7 + 8?',
    L3_2: 'What is 9 + 6?',
    L3_3: 'What is 12 + 7?',
    L3_4: 'What is 8 + 9?',
    L4_0: 'What is 5 - 2?',
    L4_1: 'What is 3 - 1?',
    L4_2: 'What is 7 - 3?',
    L4_3: 'What is 9 - 4?',
    L4_4: 'What is 6 - 0?',
    L5_0: 'Which shape has 3 sides?',
    L5_1: 'Which shape is round?',
    L5_2: 'Which shape has 4 equal sides?',
    L5_3: 'Which shape has 5 points?',
    L5_4: 'Which shape looks like an egg?',
  },
};

const id: typeof en = {
  calibrator: {
    correct: (name: string) => `Kerja bagus! Kamu berhasil menjawab dengan benar di level ${name}!`,
    L1: 'Hitung setiap benda perlahan. Tunjuk satu per satu sambil berhitung.',
    L2: 'Coba gunakan jari-jarimu untuk menjumlahkan angka.',
    L3: 'Pisahkan angka yang lebih besar menjadi puluhan dan satuan.',
    L4: 'Mulai dari angka yang lebih besar, lalu hitung mundur.',
    L5: 'Lihat tepi dan sudut bentuk untuk menghitungnya.',
    fallback: 'Coba lagi! Pikirkan pertanyaannya dengan saksama.',
  },
  local: {
    L1_0: 'Ada berapa apel? 🍎🍎🍎',
    L1_1: 'Hitung bintangnya: ⭐⭐⭐',
    L1_2: 'Ada berapa jari di satu tangan?',
    L1_3: 'Hitung balonnya: 🎈🎈🎈🎈',
    L1_4: 'Ada berapa kaki kucing?',
    L2_0: 'Berapa 1 + 1?',
    L2_1: 'Berapa 2 + 3?',
    L2_2: 'Berapa 4 + 1?',
    L2_3: 'Berapa 3 + 3?',
    L2_4: 'Berapa 2 + 2?',
    L3_0: 'Berapa 10 + 5?',
    L3_1: 'Berapa 7 + 8?',
    L3_2: 'Berapa 9 + 6?',
    L3_3: 'Berapa 12 + 7?',
    L3_4: 'Berapa 8 + 9?',
    L4_0: 'Berapa 5 - 2?',
    L4_1: 'Berapa 3 - 1?',
    L4_2: 'Berapa 7 - 3?',
    L4_3: 'Berapa 9 - 4?',
    L4_4: 'Berapa 6 - 0?',
    L5_0: 'Bentuk mana yang memiliki 3 sisi?',
    L5_1: 'Bentuk mana yang bundar?',
    L5_2: 'Bentuk mana yang memiliki 4 sisi sama panjang?',
    L5_3: 'Bentuk mana yang memiliki 5 sudut?',
    L5_4: 'Bentuk mana yang seperti telur?',
  },
};

const locales: Record<string, typeof en> = { en, id };

export function t(locale: string): typeof en {
  const lang = locale.split(',')[0].split('-')[0].toLowerCase();
  return locales[lang] || en;
}

export function detectLocale(req: {
  headers: Record<string, string | undefined>;
  query?: Record<string, string | string[] | undefined>;
}): string {
  const queryLocale = req.query?.lang || req.query?.locale;
  const locale = Array.isArray(queryLocale) ? queryLocale[0] : queryLocale;
  if (locale && typeof locale === 'string' && locale.trim()) {
    return locale;
  }
  return req.headers[LOCALE_HEADER] || 'en';
}
