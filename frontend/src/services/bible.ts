import { getEdenInsight } from './gemini';

// Bible verse interface
export interface BibleVerse {
  verseId: number;
  bookName: string;
  bookNumber: number;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleDayReading {
  passage: string;
  text: string;
  context: string;
}

let bibleData: BibleVerse[] = [];
let isLoaded = false;
let readingPlan: Record<number, string> | null = null;
let planLoaded = false;
const PLAN_CACHE_KEY = 'edenify-bible-plan-v2'; // Cache bust on version change

async function loadBibleDataFromJson(): Promise<BibleVerse[]> {
  const response = await fetch('/bible-data.json');
  if (!response.ok) throw new Error('bible-data.json not found');

  const data = await response.json();

  const parsed = Array.isArray(data)
    ? data
        .filter((item: any) => item['__EMPTY_1'] && typeof item['__EMPTY_1'] === 'string' && !isNaN(Number(item['__EMPTY_1'])))
        .map((item: any, index: number) => ({
          verseId: index,
          bookName: item['__EMPTY'] || '',
          bookNumber: Number(item['__EMPTY_1']) || 0,
          chapter: Number(item['__EMPTY_2']) || 0,
          verse: Number(item['__EMPTY_3']) || 0,
          text: item['__EMPTY_4'] || '',
        }))
    : [];

  if (parsed.length > 0) return parsed;
  throw new Error('Unable to parse bible-data.json');
}

async function loadBibleData(): Promise<BibleVerse[]> {
  if (isLoaded && bibleData.length > 0) return bibleData;

  try {
    bibleData = await loadBibleDataFromJson();
    isLoaded = true;
    return bibleData;
  } catch (error) {
    console.error('Error loading Bible data:', error);
    return [];
  }
}

export async function getRandomVerse(): Promise<BibleVerse | null> {
  const verses = await loadBibleData();
  if (verses.length === 0) return null;
  return verses[Math.floor(Math.random() * verses.length)];
}

export async function getVerse(book: string, chapter: number, verse: number): Promise<BibleVerse | null> {
  const verses = await loadBibleData();
  if (verses.length === 0) return null;

  return verses.find(
    v => v.bookName.toLowerCase() === book.toLowerCase() &&
         v.chapter === chapter &&
         v.verse === verse
  ) || null;
}

export async function getBook(bookName: string): Promise<BibleVerse[]> {
  const verses = await loadBibleData();
  return verses.filter(v => v.bookName.toLowerCase() === bookName.toLowerCase());
}

export async function getChapter(bookName: string, chapter: number): Promise<BibleVerse[]> {
  const verses = await loadBibleData();
  return verses.filter(
    v => v.bookName.toLowerCase() === bookName.toLowerCase() && v.chapter === chapter
  );
}

export async function getSuggestedVerse(): Promise<{ verse: BibleVerse; suggestion: string } | null> {
  const randomVerse = await getRandomVerse();
  if (!randomVerse) return null;

  const prompt = `The Bible verse "${randomVerse.text.substring(0, 100)}..." (${randomVerse.bookName} ${randomVerse.chapter}:${randomVerse.verse}) provides spiritual guidance. Give a 1-2 sentence interpretation of how this applies to daily spiritual discipline.`;

  const suggestion = await getEdenInsight(prompt);

  return {
    verse: randomVerse,
    suggestion: suggestion || 'Meditate on this scripture for your reflection.'
  };
}

export async function searchVerses(keyword: string, limit: number = 10): Promise<BibleVerse[]> {
  const verses = await loadBibleData();
  const results = verses.filter(v => v.text.toLowerCase().includes(keyword.toLowerCase()));
  return results.slice(0, limit);
}

function formatPassage(start: BibleVerse, end: BibleVerse) {
  if (start.bookName === end.bookName && start.chapter === end.chapter) {
    return `${start.bookName} ${start.chapter}:${start.verse}-${end.verse}`;
  }

  if (start.bookName === end.bookName) {
    return `${start.bookName} ${start.chapter}:${start.verse}-${end.chapter}:${end.verse}`;
  }

  return `${start.bookName} ${start.chapter}:${start.verse} - ${end.bookName} ${end.chapter}:${end.verse}`;
}

export async function getBibleReadingForDay(day: number): Promise<BibleDayReading> {
  const verses = await loadBibleData();
  if (verses.length === 0) {
    return {
      passage: 'Reading unavailable',
      text: 'Bible data is unavailable. Please ensure bible-data.json is present.',
      context: 'Could not load /bible-data.json.',
    };
  }

  const totalDays = 365;
  const safeDay = Math.min(totalDays, Math.max(1, day));
  const totalVerses = verses.length;
  const baseChunk = Math.floor(totalVerses / totalDays);
  const remainder = totalVerses % totalDays;

  const startIndex = ((safeDay - 1) * baseChunk) + Math.min(safeDay - 1, remainder);
  const chunkSize = baseChunk + (safeDay <= remainder ? 1 : 0);
  const endIndex = Math.min(totalVerses - 1, startIndex + chunkSize - 1);

  const start = verses[startIndex];
  const end = verses[endIndex];

  return {
    passage: formatPassage(start, end),
    text: start.text,
    context: `Day ${safeDay} covers verse ${startIndex + 1} to ${endIndex + 1} of ${totalVerses}.`,
  };
}

function parsePlanTextToMap(text: string): Record<number, string> {
  const lines = text
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const parsed: Record<number, string> = {};

  lines.forEach((line) => {
    const match = line.match(/^(?:day\s*)?(\d{1,3})\s*[:\-.)]?\s*(.+)$/i);
    if (!match) return;
    const day = Number(match[1]);
    if (!Number.isFinite(day) || day < 1 || day > 366) return;

    const passage = match[2].trim();
    if (!passage || /^day\b/i.test(passage)) return;
    parsed[day] = passage;
  });

  return parsed;
}

/**
 * Load the preset day reading plan, preferring bible-plan.json.
 */
async function loadReadingPlan(): Promise<Record<number, string>> {
  if (planLoaded && readingPlan) {
    console.log('[Bible Plan] Using cached plan with', Object.keys(readingPlan).length, 'days');
    return readingPlan;
  }

  try {
    console.log('[Bible Plan] Fetching /data/bible-plan.json...');
    const response = await fetch('/data/bible-plan.json');
    if (!response.ok) throw new Error(`bible-plan.json not found (status: ${response.status})`);
    const data = await response.json() as { readings: Record<string, { passages: string }> };

    readingPlan = {};

    Object.entries(data.readings).forEach(([day, reading]) => {
      readingPlan![Number(day)] = reading.passages;
    });

    const dayCount = Object.keys(readingPlan).length;
    console.log('[Bible Plan] Loaded successfully with', dayCount, 'days');
    console.log('[Bible Plan] Sample days:', Object.keys(readingPlan).slice(0, 3).map(d => `Day ${d}: ${readingPlan![Number(d)]}`).join(', '));

    planLoaded = true;
    return readingPlan || {};
  } catch (error) {
    console.warn('[Bible Plan] Could not load reading plan from /data/bible-plan.json:', error);
    planLoaded = true;
    return {};
  }
}

/**
export async function getFullTextForPassage(passage: string): Promise<string> {
  const verses = await loadBibleData();
  const parts = passage.split(' ');
  if (parts.length < 2) return '';
  const bookName = parts.slice(0, -1).join(' ').toLowerCase();
  let bookVerses = verses.filter(v => v.bookName.toLowerCase() === bookName);
  
  if (bookVerses.length === 0) {
    bookVerses = verses.filter(v => v.bookName.toLowerCase().startsWith(parts[0].toLowerCase()));
  }

  const range = parts[parts.length - 1];
  
  try {
     if (range.includes('-') && !range.includes(':')) {
       const [startC, endC] = range.split('-');
       const filtered = bookVerses.filter(v => v.chapter >= Number(startC) && v.chapter <= Number(endC));
       return filtered.map(v => v.text).join(' ');
     } else if (!range.includes(':') && !range.includes('-')) {
       const filtered = bookVerses.filter(v => v.chapter === Number(range));
       return filtered.map(v => v.text).join(' ');
     } else {
       return bookVerses.slice(0, 100).map(v => v.text).join(' ');
     }
  } catch (e) {
     return bookVerses.slice(0, 100).map(v => v.text).join(' ');
  }
}

/**
 * Get reading for a specific day, preferring the preset plan if available.
 */
export async function getDayReading(day: number): Promise<BibleDayReading> {
  const plan = await loadReadingPlan();
  const totalDays = Math.max(1, Object.keys(plan).length || 365);
  const safeDay = Math.min(totalDays, Math.max(1, day));

  console.log('[getDayReading] day:', day, 'safeDay:', safeDay, 'planLoaded:', Object.keys(plan).length > 0);

  if (plan[safeDay]) {
    const fullText = await getFullTextForPassage(plan[safeDay]);
    const result = {
      passage: plan[safeDay],
      text: fullText || `Today's reading: ${plan[safeDay]}`,
      context: `Day ${safeDay} of the reading plan.`
    };
    console.log('[getDayReading] Found in plan:', result.passage);
    return result;
  }

  console.warn('[getDayReading] Not found in plan for day', safeDay);
  return {
    passage: `Day ${safeDay} unavailable`,
    text: 'Reading plan entry is missing for this day.',
    context: `No reading found in /data/bible-plan.json for day ${safeDay}.`,
  };
}

/**
 * Get the total number of days in the reading plan.
 */
export async function getTotalReadingDays(): Promise<number> {
  const plan = await loadReadingPlan();
  const dayCount = Object.keys(plan).length;
  return dayCount > 0 ? dayCount : 365;
}
