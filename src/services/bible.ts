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

// Cache for Bible data
let bibleData: BibleVerse[] = [];
let isLoaded = false;

// Parse the Bible JSON file
async function loadBibleData(): Promise<BibleVerse[]> {
  if (isLoaded && bibleData.length > 0) return bibleData;

  try {
    const response = await fetch('/bible-data.json');
    const data = await response.json();

    // Filter out header rows and parse verses
    bibleData = data
      .filter((item: any) => item['__EMPTY_1'] && typeof item['__EMPTY_1'] === 'string' && !isNaN(Number(item['__EMPTY_1'])))
      .map((item: any, index: number) => ({
        verseId: index,
        bookName: item['__EMPTY'] || '',
        bookNumber: Number(item['__EMPTY_1']) || 0,
        chapter: Number(item['__EMPTY_2']) || 0,
        verse: Number(item['__EMPTY_3']) || 0,
        text: item['__EMPTY_4'] || ''
      }));

    isLoaded = true;
    return bibleData;
  } catch (error) {
    console.error('Error loading Bible data:', error);
    return [];
  }
}

// Get a random verse
export async function getRandomVerse(): Promise<BibleVerse | null> {
  const verses = await loadBibleData();
  if (verses.length === 0) return null;
  return verses[Math.floor(Math.random() * verses.length)];
}

// Get verse by book, chapter, verse
export async function getVerse(book: string, chapter: number, verse: number): Promise<BibleVerse | null> {
  const verses = await loadBibleData();
  if (verses.length === 0) return null;

  return verses.find(
    v => v.bookName.toLowerCase() === book.toLowerCase() &&
         v.chapter === chapter &&
         v.verse === verse
  ) || null;
}

// Get all chapters for a book
export async function getBook(bookName: string): Promise<BibleVerse[]> {
  const verses = await loadBibleData();
  return verses.filter(v => v.bookName.toLowerCase() === bookName.toLowerCase());
}

// Get all verses for a chapter
export async function getChapter(bookName: string, chapter: number): Promise<BibleVerse[]> {
  const verses = await loadBibleData();
  return verses.filter(
    v => v.bookName.toLowerCase() === bookName.toLowerCase() && v.chapter === chapter
  );
}

// Get suggested verse using Gemini API
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

// Search verses by keyword
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
      passage: 'Genesis 1:1-5',
      text: 'In the beginning God created the heavens and the earth.',
      context: 'Fallback reading because local Bible dataset is unavailable.',
    };
  }

  const totalDays = 400;
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

// Cache for reading plan
let readingPlan: Record<number, string> | null = null;
let planLoaded = false;

/**
 * Load the preset 365-day reading plan from bible_plan.html
 */
async function loadReadingPlan(): Promise<Record<number, string>> {
  if (planLoaded && readingPlan) return readingPlan;

  try {
    const response = await fetch('/bible_plan.html');
    const html = await response.text();

    readingPlan = {};

    // Parse lines like "Day 1: John 1; Psalm 1"
    const lines = html.split('\n');
    lines.forEach(line => {
      const match = line.match(/Day\s+(\d+):\s*(.+)/i);
      if (match) {
        const day = parseInt(match[1]);
        const passages = match[2].trim();
        readingPlan![day] = passages;
      }
    });

    planLoaded = true;
    return readingPlan || {};
  } catch (error) {
    console.warn('Could not load preset reading plan, using default distribution:', error);
    planLoaded = true;
    return {};
  }
}

/**
 * Get reading for a specific day, preferring the preset plan if available
 */
export async function getDayReading(day: number): Promise<BibleDayReading> {
  const plan = await loadReadingPlan();

  if (plan[day]) {
    // Use preset plan
    return {
      passage: plan[day],
      text: `Today's reading: ${plan[day]}`,
      context: `Day ${day} of the 365-day reading plan.`
    };
  }

  // Fallback to default distribution
  return getBibleReadingForDay(day);
}

/**
 * Get the total number of days in the reading plan
 */
export async function getTotalReadingDays(): Promise<number> {
  const plan = await loadReadingPlan();
  const dayCount = Object.keys(plan).length;
  return dayCount > 0 ? dayCount : 365; // Default to 365 if plan not loaded
}
