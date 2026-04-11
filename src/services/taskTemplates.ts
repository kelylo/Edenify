// ----------------------------------------------------------------------
// eden-templates.ts - Intelligent Task Template Engine
// ----------------------------------------------------------------------

import { LayerId, Task } from '../types';

// ----------------------------------------------------------------------
// Core Types
// ----------------------------------------------------------------------
export interface EdenTemplate {
  id: string;                 // Unique identifier for tracking
  name: string;
  layerId: LayerId;
  priority: 'A' | 'B' | 'C' | 'D' | 'E';
  repeat: 'once' | 'daily' | 'weekly';
  time: string;               // HH:mm format
  category: TemplateCategory;
  estimatedDuration?: number; // minutes
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  energyLevel: 'low' | 'medium' | 'high';
  createdFrom?: string;       // origin (e.g., 'system', 'user-derived')
}

export type TemplateCategory =
  | 'core-habit'
  | 'deep-work'
  | 'quick-win'
  | 'reflection'
  | 'learning'
  | 'health'
  | 'wealth'
  | 'connection'
  | 'planning'
  | 'maintenance';

export interface Slot {
  label: string;
  time: string;
  hourRange: [number, number]; // [startHour, endHour] for context matching
  typicalEnergy: 'low' | 'medium' | 'high';
}

export interface UserTemplateProfile {
  preferredSlots: string[];           // Slot labels user often picks
  favoriteCategories: TemplateCategory[];
  averageCompletionTime: number;      // minutes
  streakLayers: Record<LayerId, number>;
  ignoredTemplates: Set<string>;      // template IDs user never uses
  boostedTemplates: Set<string>;      // template IDs user loves
  recentCompletions: Array<{ templateId: string; timestamp: number }>;
}

export interface TemplateRecommendationContext {
  currentHour: number;
  currentDay: number;                 // 0-6 (Sun-Sat)
  userEnergyEstimate?: 'low' | 'medium' | 'high';
  recentTaskCount: number;            // tasks completed in last 2 hours
  layerBalanceTarget?: LayerId;       // layer that needs attention
  userProfile?: UserTemplateProfile;
  avoidOverwhelm: boolean;
}

// ----------------------------------------------------------------------
// Expanded Slot System (24 slots covering the day)
// ----------------------------------------------------------------------
const SLOTS: Slot[] = [
  { label: 'Dawn', time: '05:00', hourRange: [4, 6], typicalEnergy: 'low' },
  { label: 'Early Morning', time: '06:30', hourRange: [6, 8], typicalEnergy: 'medium' },
  { label: 'Morning Focus', time: '08:00', hourRange: [8, 10], typicalEnergy: 'high' },
  { label: 'Late Morning', time: '10:30', hourRange: [10, 12], typicalEnergy: 'high' },
  { label: 'Midday', time: '12:30', hourRange: [12, 14], typicalEnergy: 'medium' },
  { label: 'Early Afternoon', time: '14:00', hourRange: [14, 15], typicalEnergy: 'low' },
  { label: 'Afternoon Boost', time: '15:30', hourRange: [15, 17], typicalEnergy: 'medium' },
  { label: 'Late Afternoon', time: '17:00', hourRange: [17, 18], typicalEnergy: 'medium' },
  { label: 'Evening Wind-Down', time: '18:30', hourRange: [18, 20], typicalEnergy: 'low' },
  { label: 'Night Prep', time: '20:00', hourRange: [20, 22], typicalEnergy: 'low' },
  { label: 'Late Night', time: '22:00', hourRange: [22, 24], typicalEnergy: 'low' },
  { label: 'Overnight', time: '00:00', hourRange: [0, 4], typicalEnergy: 'low' },
];

// ----------------------------------------------------------------------
// Massive Task Name Banks (100+ per layer)
// ----------------------------------------------------------------------

// --- SPIRITUAL (150+ tasks) ---
const SPIRITUAL_TASKS: string[] = [
  // Core practices
  'Pray with focus', 'Read one chapter of scripture', 'Write gratitude journal entry',
  'Memorize one verse', 'Worship and reflect quietly', 'Intercede for family and friends',
  'Read devotional notes', 'Listen to faith teaching', 'Practice silence before prayer',
  'Write answered prayers list', 'Study one biblical topic', 'Plan weekly spiritual goals',
  'Review faith commitments', 'Confession and repentance prayer', 'Meditate on a psalm',
  'Pray through the Lord\'s Prayer', 'Read a Christian biography excerpt',
  'Journal spiritual insights', 'Fast from social media for spiritual focus',
  'Practice listening prayer', 'Write a letter to God', 'Memorize a creed or catechism',
  'Study the attributes of God', 'Pray for global church', 'Read missionary update',
  'Reflect on sermon notes', 'Practice Sabbath rest', 'Create a prayer list',
  'Pray for enemies', 'Give thanks for specific blessings', 'Contemplate creation',
  'Read a chapter from Proverbs', 'Study a parable', 'Memorize Beatitudes',
  'Pray for government leaders', 'Intercede for persecuted Christians',
  'Write a psalm of your own', 'Practice breath prayer', 'Examine conscience',
  'Read early church fathers quote', 'Study biblical prophecy', 'Memorize Romans 8',
  'Pray through ACTS model', 'Listen to sacred music', 'Contemplate the cross',
  'Write a spiritual autobiography snippet', 'Practice examen prayer',
  'Read about a saint or hero of faith', 'Pray for your city',
  'Study the fruit of the Spirit', 'Memorize John 3:16',
  'Pray for wisdom in decision', 'Reflect on God\'s faithfulness',
  'Journal a "God sighting"', 'Pray over your calendar',
  'Read a chapter from Psalms', 'Study a minor prophet',
  'Pray for those in authority', 'Memorize Ephesians 2:8-10',
  'Practice centering prayer', 'Contemplate heaven',
  'Write a prayer of surrender', 'Read a chapter from Isaiah',
  'Study the armor of God', 'Pray for unity in the church',
  'Memorize Philippians 4:6-7', 'Reflect on baptism meaning',
  'Pray for the lost', 'Read a chapter from the Gospels',
  'Study the names of God', 'Memorize 1 Corinthians 13',
  'Practice gratitude walk', 'Pray through a psalm',
  'Read a chapter from Acts', 'Study the resurrection',
  'Pray for your pastor', 'Memorize Psalm 23',
  'Write a thank-you note to God', 'Contemplate the incarnation',
  'Pray for healing', 'Read a chapter from Revelation',
  'Study spiritual disciplines', 'Pray for peace in the world',
  'Memorize the Great Commission', 'Reflect on communion',
  'Pray for your enemies by name', 'Read a chapter from James',
  'Study the Holy Spirit', 'Pray for your future spouse or marriage',
  'Memorize Galatians 5:22-23', 'Practice fasting prayer',
  'Read a chapter from Hebrews', 'Study end times',
  'Pray for missionaries you know', 'Write a creed statement',
  'Contemplate God\'s love', 'Pray for your children or future children',
  'Read a chapter from 1 John', 'Study grace vs works',
  'Pray for revival', 'Memorize Romans 12:1-2',
  'Reflect on your testimony', 'Pray through the tabernacle',
  'Read a chapter from Daniel', 'Study covenant theology',
  'Pray for the unreached', 'Write a lament',
  'Contemplate God\'s sovereignty', 'Pray for courage',
  'Read a chapter from Ecclesiastes', 'Study the kingdom of God',
  'Pray for humility', 'Memorize Colossians 3:1-4',
  'Reflect on spiritual warfare', 'Pray for joy',
  'Read a chapter from Job', 'Study justification by faith',
  'Pray for contentment', 'Write a blessing for someone',
  'Contemplate eternity', 'Pray for patience',
  'Read a chapter from Song of Solomon', 'Study sanctification',
  'Pray for self-control', 'Memorize 2 Timothy 3:16-17',
  'Reflect on the fear of the Lord', 'Pray for gentleness',
  'Read a chapter from Lamentations', 'Study adoption as sons',
  'Pray for kindness', 'Write a prayer of confession',
  'Contemplate the Trinity', 'Pray for goodness',
  'Read a chapter from Ezra', 'Study the priesthood of believers',
  'Pray for faithfulness', 'Memorize Titus 2:11-14',
  'Reflect on the Beatitudes', 'Pray for peacemakers',
  'Read a chapter from Nehemiah', 'Study spiritual gifts',
  'Pray for the persecuted', 'Write a prayer of intercession',
  'Contemplate the second coming', 'Pray for those who mourn',
  'Read a chapter from Esther', 'Study the church as body',
  'Pray for the meek', 'Memorize Hebrews 11:1',
  'Reflect on hungering for righteousness', 'Pray for the merciful',
  'Read a chapter from Ruth', 'Study the new covenant',
  'Pray for the pure in heart', 'Write a prayer of adoration',
  'Contemplate the Beatific Vision', 'Pray for those who are reviled',
  'Read a chapter from Jonah', 'Study the resurrection body',
  'Pray for those who are persecuted', 'Memorize 1 Peter 1:3-5',
  'Reflect on being salt and light', 'Pray for the world',
];

// --- ACADEMIC (150+ tasks) ---
const ACADEMIC_TASKS: string[] = [
  'Deep study block', 'Review class notes', 'Solve practice questions',
  'Read textbook section', 'Write assignment draft', 'Summarize chapter key points',
  'Revise previous mistakes', 'Active recall session', 'Prepare exam flashcards',
  'Watch lecture and annotate', 'Build concept map', 'Practice timed test',
  'Plan tomorrow study sprint', 'Outline essay structure', 'Research paper sources',
  'Create mind map for topic', 'Teach concept to imaginary student',
  'Do problem set', 'Review syllabus and plan semester', 'Attend office hours',
  'Form study group', 'Watch supplementary video', 'Read academic paper',
  'Write abstract', 'Cite sources in bibliography', 'Proofread paper',
  'Practice presentation', 'Create study schedule', 'Review feedback on past work',
  'Summarize lecture in own words', 'Memorize formulas', 'Practice language vocabulary',
  'Do grammar exercises', 'Read primary source document', 'Analyze case study',
  'Write reflection on reading', 'Prepare for lab', 'Review lab results',
  'Create flashcards for terminology', 'Practice pronunciation', 'Do listening comprehension',
  'Write dialogue in target language', 'Translate passage', 'Study historical timeline',
  'Memorize dates', 'Create timeline visual', 'Analyze literary theme',
  'Write character analysis', 'Compare two theories', 'Evaluate argument',
  'Identify logical fallacies', 'Practice coding problem', 'Debug program',
  'Write unit tests', 'Refactor code', 'Learn new algorithm',
  'Study data structure', 'Design database schema', 'Write SQL queries',
  'Practice regex', 'Learn keyboard shortcut', 'Watch tutorial on tool',
  'Read documentation', 'Write project proposal', 'Create project timeline',
  'Break down project into milestones', 'Research competitor analysis',
  'Conduct SWOT analysis', 'Write business plan section', 'Practice elevator pitch',
  'Study for certification exam', 'Take practice exam', 'Review incorrect answers',
  'Create study playlist', 'Organize digital notes', 'Clean up desktop files',
  'Backup important documents', 'Update CV/resume', 'Write cover letter draft',
  'Practice interview questions', 'Research company for interview',
  'Network on LinkedIn', 'Read industry news', 'Subscribe to journal alerts',
  'Set up RSS feeds for research', 'Learn new software feature',
  'Watch webinar recording', 'Attend virtual conference session',
  'Take MOOC lesson', 'Complete online assignment', 'Participate in forum discussion',
  'Write course review', 'Plan next course enrollment', 'Read book summary',
  'Listen to educational podcast', 'Watch documentary on topic',
  'Visit museum virtually', 'Explore interactive simulation',
  'Conduct thought experiment', 'Write in academic journal',
  'Peer review classmate\'s work', 'Create rubric for self-assessment',
  'Set SMART goals for semester', 'Track study hours', 'Analyze time usage',
  'Identify knowledge gaps', 'Create personalized curriculum',
  'Learn memory technique', 'Practice speed reading', 'Do brain training exercise',
  'Study cognitive biases', 'Read about learning science',
  'Apply Feynman technique', 'Use Pomodoro timer', 'Do focused reading',
  'Annotate text with questions', 'Write summary from memory',
  'Teach someone else', 'Create quiz for self', 'Use spaced repetition software',
  'Review material from last week', 'Review material from last month',
  'Preview next week\'s topics', 'Skim chapter before lecture',
  'Do pre-reading questions', 'Write down predictions',
  'After lecture, fill in gaps', 'Create one-page cheat sheet',
  'Do interleaved practice', 'Vary study location', 'Study with background music',
  'Study in silence', 'Use whiteboard to explain', 'Record voice notes',
  'Listen to own voice notes', 'Transcribe key points', 'Use color coding',
  'Highlight strategically', 'Write marginalia', 'Create analogies',
  'Draw diagram', 'Use mnemonic devices', 'Create acronyms',
  'Tell a story with facts', 'Link new to known', 'Chunk information',
  'Practice retrieval in different order', 'Self-test without notes',
  'Grade own test', 'Analyze error patterns', 'Create error log',
  'Set improvement goal', 'Celebrate small win', 'Reflect on learning process',
];

// --- FINANCIAL (150+ tasks) ---
const FINANCIAL_TASKS: string[] = [
  'Track daily spending', 'Update weekly budget', 'Review account balances',
  'Plan savings transfer', 'Record all cash expenses', 'Review subscriptions and cancel one',
  'Analyze debt payment plan', 'Check business income entries', 'Create side-income task',
  'Read one finance lesson', 'Prepare monthly expense report', 'Review investment notes',
  'Set financial priority for tomorrow', 'Check credit score', 'Dispute credit report error',
  'Freeze credit', 'Set up fraud alerts', 'Review insurance policies',
  'Shop for better insurance rates', 'Update beneficiaries', 'Create will or trust',
  'Review estate plan', 'Calculate net worth', 'Update net worth spreadsheet',
  'Set savings goal', 'Automate savings transfer', 'Open high-yield savings account',
  'Research CD rates', 'Buy I-bonds', 'Contribute to IRA',
  'Max out 401(k) match', 'Review asset allocation', 'Rebalance portfolio',
  'Tax-loss harvest', 'Review tax withholding', 'Estimate quarterly taxes',
  'Organize tax documents', 'Meet with tax professional', 'File tax extension',
  'Pay estimated taxes', 'Review charitable giving', 'Set up donor-advised fund',
  'Plan giving strategy', 'Review recurring donations', 'Cancel unused memberships',
  'Negotiate bills (cable, phone, internet)', 'Call to lower interest rate',
  'Transfer balance to 0% card', 'Pay off smallest debt (snowball)',
  'Pay extra on highest interest debt (avalanche)', 'Set debt payoff date',
  'Celebrate debt milestone', 'Review paycheck deductions', 'Adjust W-4',
  'Check unclaimed property', 'Rollover old 401(k)', 'Consolidate accounts',
  'Close unused bank accounts', 'Switch to better bank', 'Set up direct deposit',
  'Create emergency fund goal', 'Fund emergency fund', 'Replenish emergency fund',
  'Save for specific goal (vacation, car, house)', 'Open separate savings account for goal',
  'Research investment options', 'Read annual report', 'Listen to earnings call',
  'Study a company before investing', 'Set stop-loss orders', 'Review dividend income',
  'DRIP enrollment', 'Analyze expense ratios', 'Switch to lower-cost funds',
  'Learn about options trading', 'Paper trade first', 'Read investing book',
  'Follow financial news', 'Listen to finance podcast', 'Attend webinar',
  'Join investment club', 'Find mentor', 'Teach someone about finances',
  'Create budget with partner', 'Have money date night', 'Discuss financial goals',
  'Plan for large purchase', 'Save for kids\' college (529)', 'Research scholarships',
  'Apply for scholarships', 'Review student loan repayment options',
  'Apply for income-driven repayment', 'Certify employment for PSLF',
  'Make extra student loan payment', 'Refinance student loans',
  'Check mortgage rates', 'Refinance mortgage', 'Make extra principal payment',
  'Calculate mortgage payoff date', 'Save for down payment', 'Get pre-approved',
  'Research first-time homebuyer programs', 'Attend homebuyer seminar',
  'Review property tax assessment', 'Appeal property taxes', 'Check home insurance',
  'Bundle insurance policies', 'Increase liability coverage', 'Get umbrella policy',
  'Review life insurance needs', 'Compare term life quotes', 'Buy term life',
  'Review disability insurance', 'Get long-term care quote', 'Plan for aging parents',
  'Discuss finances with parents', 'Organize important documents', 'Store documents safely',
  'Create digital estate plan', 'Share passwords with trusted person',
  'Review monthly cash flow', 'Identify spending leaks', 'Set spending limit for category',
  'Use cash envelope system', 'Track no-spend days', 'Do a no-spend week',
  'Sell unused items', 'Donate items for tax deduction', 'Track side hustle income',
  'Invoice clients', 'Follow up on unpaid invoices', 'Set freelance rates',
  'Negotiate raise', 'Update resume with accomplishments', 'Take course to increase income',
  'Read salary negotiation tips', 'Practice negotiation', 'Ask for promotion',
  'Explore new job opportunities', 'Update LinkedIn profile', 'Network with colleagues',
  'Attend industry event', 'Get certification', 'Learn high-income skill',
  'Start small business', 'Write business plan', 'Research business licenses',
  'Open business bank account', 'Get business credit card', 'Track business expenses',
  'Separate personal and business finances', 'Hire bookkeeper', 'Use accounting software',
  'Review profit and loss', 'Set business budget', 'Plan for business taxes',
  'Save for retirement as business owner', 'Explore SEP IRA or Solo 401(k)',
  'Review business insurance', 'Protect intellectual property',
  'Trademark business name', 'Copyright creative work', 'Draft contracts',
  'Review legal agreements', 'Consult with lawyer', 'Plan business succession',
  'Value business', 'Prepare business for sale', 'Read biography of successful entrepreneur',
];

// --- PHYSICAL (150+ tasks) ---
const PHYSICAL_TASKS: string[] = [
  'Morning mobility routine', 'Strength training set', 'Cardio session',
  'Stretch and recover', 'Walk 8000 steps', 'Prepare healthy meal',
  'Hydration tracking check', 'Core workout routine', 'Breathing and posture reset',
  'Sleep prep routine', 'Track body progress metrics', 'Short home workout',
  'Plan tomorrow training session', 'Foam roll', 'Yoga flow',
  'Pilates session', 'HIIT workout', 'Long slow run',
  'Interval sprints', 'Swim laps', 'Bike ride',
  'Hike in nature', 'Rock climbing', 'Martial arts practice',
  'Dance workout', 'Jump rope', 'Bodyweight circuit',
  'Resistance band workout', 'Kettlebell swing practice', 'Deadlift session',
  'Squat technique work', 'Bench press progression', 'Pull-up practice',
  'Push-up challenge', 'Plank hold', 'Glute activation',
  'Shoulder mobility', 'Hip opener sequence', 'Ankle mobility',
  'Wrist prep', 'Neck release', 'Full body stretch',
  'Pre-workout warm-up', 'Post-workout cool-down', 'Active recovery walk',
  'Rest day complete rest', 'Massage gun session', 'Ice bath or cold shower',
  'Sauna session', 'Contrast therapy', 'Meditation for recovery',
  'Visualize performance', 'Set workout PR goal', 'Track workout in app',
  'Review training log', 'Adjust training plan', 'Deload week planning',
  'Calculate macros', 'Meal prep for week', 'Grocery shop with list',
  'Cook new healthy recipe', 'Batch cook protein', 'Chop vegetables for snacks',
  'Make smoothie packs', 'Prep overnight oats', 'Hard boil eggs',
  'Grill chicken breasts', 'Roast vegetables', 'Make salad jars',
  'Portion out nuts', 'Infuse water with fruit', 'Track water intake',
  'Drink glass of water upon waking', 'Herbal tea before bed', 'Limit caffeine after 2pm',
  'No alcohol day', 'Limit sugar', 'Eat mindfully without screens',
  'Chew food thoroughly', 'Stop eating at 80% full', 'Intermittent fasting window',
  'Take vitamins', 'Get sunlight in morning', 'Dim lights after sunset',
  'Wear blue light blockers', 'No screens 1 hour before bed', 'Read physical book before sleep',
  'Set consistent wake time', 'Set consistent bedtime', 'Use white noise',
  'Blackout curtains', 'Cool bedroom temperature', 'Weighted blanket',
  'Lavender essential oil', 'Sleep meditation', 'Progressive muscle relaxation',
  'Journal before bed to clear mind', 'Avoid late heavy meals', 'Limit fluids before bed',
  'Stretch before bed', 'Practice good sleep hygiene', 'Track sleep with wearable',
  'Analyze sleep data', 'Adjust bedtime based on sleep quality', 'Nap if needed (20 min)',
  'Get standing desk time', 'Take movement breaks every hour', 'Eye exercises (20-20-20)',
  'Posture check reminder', 'Ergonomic assessment', 'Adjust chair/desk height',
  'Use lumbar support', 'Wrist rest for keyboard', 'Monitor at eye level',
  'Footrest if needed', 'Alternate sitting and standing', 'Walk during phone calls',
  'Take stairs instead of elevator', 'Park farther away', 'Walk to errands',
  'Bike commute', 'Active date (hike, walk, climb)', 'Play sport with friends',
  'Join recreational league', 'Try new fitness class', 'Work with personal trainer',
  'Get fitness assessment', 'Set body composition goal', 'Take progress photos',
  'Measure waist circumference', 'Celebrate non-scale victory', 'Reward consistency',
  'Find workout buddy', 'Join online fitness community', 'Share workout on social for accountability',
];

// --- GENERAL (150+ tasks) ---
const GENERAL_TASKS: string[] = [
  'Plan top 3 priorities', 'Inbox zero sprint', 'Clean workspace',
  'Review daily schedule', 'Declutter one small area', 'Reply to pending important messages',
  'Plan tomorrow tasks', 'Weekly reflection check', 'Organize files and notes',
  'Family check-in call', 'Update personal goals', 'Read 15 minutes',
  'Mind reset and breathing break', 'Set intentions for the day', 'Review calendar for week',
  'Batch similar tasks', 'Time block schedule', 'Use Pomodoro for focus',
  'Turn off notifications', 'Deep work session', 'Shallow work batch',
  'Process physical mail', 'Pay bills', 'File important papers',
  'Shred old documents', 'Backup computer', 'Update software',
  'Change passwords', 'Enable two-factor authentication', 'Review privacy settings',
  'Clean email subscriptions', 'Unsubscribe from newsletters', 'Create email filters',
  'Archive old emails', 'Respond to all flagged emails', 'Clear browser tabs',
  'Bookmark important sites', 'Organize bookmarks', 'Clean desktop',
  'Empty downloads folder', 'Run disk cleanup', 'Defrag hard drive (if HDD)',
  'Check for updates', 'Restart computer', 'Clean keyboard and screen',
  'Organize charging cables', 'Label cords', 'Create donation box',
  'Take donation box to charity', 'Sell items online', 'List item on marketplace',
  'Take photos for listing', 'Respond to buyer inquiries', 'Ship sold item',
  'Update budget after sale', 'Declutter closet', 'Try on clothes and decide',
  'Create capsule wardrobe', 'Donate unused clothes', 'Mend or tailor clothing',
  'Polish shoes', 'Organize accessories', 'Clean out purse/wallet',
  'Wipe down frequently touched surfaces', 'Vacuum high-traffic areas',
  'Mop floors', 'Clean bathroom', 'Scrub toilet',
  'Wipe mirrors', 'Change sheets', 'Make bed',
  'Fluff pillows', 'Open windows for fresh air', 'Water plants',
  'Prune dead leaves', 'Repot plant', 'Research plant care',
  'Care for pet (groom, walk, play)', 'Schedule vet appointment', 'Order pet supplies',
  'Plan meals for week', 'Check pantry inventory', 'Make grocery list',
  'Go grocery shopping', 'Put away groceries immediately', 'Clean out fridge',
  'Wipe fridge shelves', 'Take out trash and recycling', 'Clean trash can',
  'Run dishwasher', 'Unload dishwasher', 'Hand wash delicate items',
  'Wipe kitchen counters', 'Clean stovetop', 'Clean microwave',
  'Descale coffee maker', 'Sharpen knives', 'Organize spice rack',
  'Check expiration dates', 'Rotate pantry items', 'Plan a fun activity',
  'Schedule date night', 'Make reservation', 'Buy tickets for event',
  'Plan weekend trip', 'Book accommodation', 'Research local attractions',
  'Pack for trip', 'Create packing list', 'Charge devices before travel',
  'Download offline maps', 'Inform bank of travel', 'Hold mail',
  'Set up out-of-office reply', 'Water plants before leaving', 'Arrange pet care',
  'Check weather for destination', 'Confirm reservations', 'Print boarding passes',
  'Arrive early for flight', 'Stay hydrated while traveling', 'Stretch during long flight',
  'Journal about trip', 'Take photos', 'Share experience with loved ones',
  'Unpack immediately upon return', 'Do laundry from trip', 'Rest after travel',
  'Reflect on trip highlights', 'Plan next adventure', 'Learn something new daily',
  'Listen to podcast', 'Watch educational YouTube', 'Read article outside your field',
  'Have deep conversation', 'Practice active listening', 'Give genuine compliment',
  'Express gratitude to someone', 'Write thank-you note', 'Perform random act of kindness',
  'Smile at stranger', 'Hold door open', 'Let someone go ahead in line',
  'Donate to cause', 'Volunteer time', 'Mentor someone',
  'Ask for help when needed', 'Delegate task', 'Say no to protect time',
  'Set boundary', 'Communicate need clearly', 'Apologize sincerely',
  'Forgive someone (including yourself)', 'Let go of grudge', 'Practice empathy',
  'Assume positive intent', 'Celebrate someone else\'s success', 'Encourage a friend',
  'Check on loved one', 'Send thoughtful message', 'Schedule call with distant friend',
  'Plan reunion', 'Organize group activity', 'Host gathering',
  'Prepare food for guests', 'Create welcoming atmosphere', 'Be present with people',
  'Put phone away during conversations', 'Make eye contact', 'Listen without interrupting',
  'Ask follow-up questions', 'Remember details about people', 'Use person\'s name',
  'Follow up on previous conversation', 'Be reliable', 'Do what you say you will',
  'Show up on time', 'Be prepared', 'Take responsibility',
  'Admit mistakes', 'Learn from feedback', 'Ask for feedback',
  'Give constructive feedback kindly', 'Praise in public, correct in private',
  'Lead by example', 'Inspire others through action', 'Stay calm under pressure',
  'Breathe before reacting', 'Count to ten', 'Take a walk to clear head',
  'Write down worries', 'Identify what you can control', 'Release what you cannot',
  'Practice acceptance', 'Find silver lining', 'Reframe negative thought',
  'Use positive affirmation', 'Visualize success', 'Set micro-goal',
  'Achieve micro-goal', 'Celebrate progress', 'Track streak',
  'Don\'t break the chain', 'Build momentum', 'Start before you\'re ready',
  'Embrace imperfection', 'Done is better than perfect', 'Iterate and improve',
  'Learn from failure', 'Fail forward', 'Take calculated risk',
  'Step out of comfort zone', 'Do one thing that scares you', 'Grow a little every day',
];

// ----------------------------------------------------------------------
// Category & Metadata Assignment
// ----------------------------------------------------------------------
const CATEGORY_MAP: Record<string, TemplateCategory> = {
  // Spiritual
  'pray': 'core-habit', 'read': 'learning', 'meditate': 'reflection',
  'worship': 'core-habit', 'journal': 'reflection', 'memorize': 'learning',
  'study': 'deep-work', 'fast': 'core-habit', 'confess': 'reflection',
  // Academic
  'study block': 'deep-work', 'review': 'learning', 'practice': 'deep-work',
  'read textbook': 'learning', 'write': 'deep-work', 'summarize': 'learning',
  'flashcard': 'learning', 'lecture': 'learning', 'exam': 'deep-work',
  'essay': 'deep-work', 'research': 'deep-work', 'problem set': 'deep-work',
  // Financial
  'track': 'maintenance', 'budget': 'planning', 'review account': 'maintenance',
  'save': 'wealth', 'invest': 'wealth', 'debt': 'wealth',
  'expense': 'maintenance', 'subscription': 'maintenance', 'tax': 'maintenance',
  'net worth': 'wealth', 'portfolio': 'wealth', 'insurance': 'maintenance',
  // Physical
  'workout': 'health', 'exercise': 'health', 'run': 'health',
  'stretch': 'health', 'walk': 'health', 'meal': 'health',
  'hydration': 'health', 'sleep': 'health', 'recovery': 'health',
  'mobility': 'health', 'strength': 'health', 'cardio': 'health',
  // General
  'plan': 'planning', 'priority': 'planning', 'inbox': 'maintenance',
  'clean': 'maintenance', 'declutter': 'maintenance', 'review': 'reflection',
  'organize': 'maintenance', 'call': 'connection', 'message': 'connection',
  'reflect': 'reflection', 'gratitude': 'reflection', 'goal': 'planning',
};

const DIFFICULTY_MAP: Record<string, 1|2|3|4|5> = {
  'pray': 2, 'read': 2, 'meditate': 3, 'workout': 4, 'study': 4,
  'write': 3, 'plan': 2, 'clean': 2, 'declutter': 2, 'deep work': 5,
  'review': 2, 'track': 1, 'budget': 3, 'invest': 4, 'reflect': 2,
  'memorize': 3, 'practice': 3, 'essay': 5, 'project': 5,
};

const ENERGY_MAP: Record<string, 'low'|'medium'|'high'> = {
  'pray': 'low', 'meditate': 'low', 'stretch': 'low', 'walk': 'low',
  'workout': 'high', 'run': 'high', 'deep work': 'high', 'study': 'high',
  'plan': 'medium', 'clean': 'medium', 'review': 'medium', 'budget': 'medium',
};

// ----------------------------------------------------------------------
// Template Factory: Build all combinations
// ----------------------------------------------------------------------
const buildAllTemplates = (): EdenTemplate[] => {
  const templates: EdenTemplate[] = [];
  let idCounter = 0;

  const processLayer = (
    layerId: LayerId,
    taskNames: string[],
    basePriority: EdenTemplate['priority'],
    baseRepeat: EdenTemplate['repeat']
  ) => {
    for (const baseName of taskNames) {
      for (const slot of SLOTS) {
        // Determine category based on keywords
        let category: TemplateCategory = 'core-habit';
        for (const [keyword, cat] of Object.entries(CATEGORY_MAP)) {
          if (baseName.toLowerCase().includes(keyword)) {
            category = cat;
            break;
          }
        }

        // Determine difficulty
        let difficulty: 1|2|3|4|5 = 3;
        for (const [keyword, diff] of Object.entries(DIFFICULTY_MAP)) {
          if (baseName.toLowerCase().includes(keyword)) {
            difficulty = diff;
            break;
          }
        }

        // Determine energy level
        let energyLevel: 'low'|'medium'|'high' = 'medium';
        for (const [keyword, energy] of Object.entries(ENERGY_MAP)) {
          if (baseName.toLowerCase().includes(keyword)) {
            energyLevel = energy;
            break;
          }
        }

        // Override energy based on slot typical energy for consistency
        if (slot.typicalEnergy === 'low' && energyLevel === 'high') energyLevel = 'medium';
        if (slot.typicalEnergy === 'high' && energyLevel === 'low') energyLevel = 'medium';

        templates.push({
          id: `tpl-${layerId}-${idCounter++}`,
          name: `${baseName} (${slot.label})`,
          layerId,
          priority: basePriority,
          repeat: baseRepeat,
          time: slot.time,
          category,
          estimatedDuration: difficulty === 1 ? 5 : difficulty === 2 ? 15 : difficulty === 3 ? 30 : difficulty === 4 ? 45 : 60,
          tags: [slot.label.toLowerCase().replace(' ', '-'), layerId, category],
          difficulty,
          energyLevel,
          createdFrom: 'system',
        });
      }
    }
  };

  processLayer('spiritual', SPIRITUAL_TASKS, 'B', 'daily');
  processLayer('academic', ACADEMIC_TASKS, 'A', 'daily');
  processLayer('financial', FINANCIAL_TASKS, 'B', 'daily');
  processLayer('physical', PHYSICAL_TASKS, 'A', 'daily');
  processLayer('general', GENERAL_TASKS, 'C', 'once');

  return templates;
};

const ALL_TEMPLATES: EdenTemplate[] = buildAllTemplates();

// ----------------------------------------------------------------------
// Public Exports
// ----------------------------------------------------------------------
export const EDEN_TEMPLATE_COUNT = ALL_TEMPLATES.length;

export const getAllEdenTemplates = (): EdenTemplate[] => [...ALL_TEMPLATES];

export const getEdenTemplatesByLayer = (layerId: LayerId): EdenTemplate[] =>
  ALL_TEMPLATES.filter(t => t.layerId === layerId);

export const getEdenTemplatesByCategory = (category: TemplateCategory): EdenTemplate[] =>
  ALL_TEMPLATES.filter(t => t.category === category);

export const getEdenTemplateById = (id: string): EdenTemplate | undefined =>
  ALL_TEMPLATES.find(t => t.id === id);

// ----------------------------------------------------------------------
// Advanced Scoring Algorithm
// ----------------------------------------------------------------------
const scoreTemplate = (
  template: EdenTemplate,
  context: TemplateRecommendationContext,
  userTasks: Task[],
  recentPatterns: Array<{ name: string; layerId: LayerId; count: number }>,
  userProfile?: UserTemplateProfile
): number => {
  let score = 0;
  const now = new Date();
  const currentHour = context.currentHour;
  const slot = SLOTS.find(s => s.time === template.time)!;

  // 1. Time relevance (max 30)
  const hourDiff = Math.abs(currentHour - slot.hourRange[0]);
  if (hourDiff <= 1) score += 30;
  else if (hourDiff <= 2) score += 20;
  else if (hourDiff <= 4) score += 10;

  // 2. Energy alignment (max 20)
  const userEnergy = context.userEnergyEstimate || 'medium';
  if (template.energyLevel === userEnergy) score += 20;
  else if (template.energyLevel === 'medium' || userEnergy === 'medium') score += 10;

  // 3. Category preference (max 15)
  if (userProfile?.favoriteCategories?.includes(template.category)) {
    score += 15;
  }

  // 4. Avoid ignored templates (penalty)
  if (userProfile?.ignoredTemplates?.has(template.id)) {
    score -= 50;
  }

  // 5. Boost loved templates
  if (userProfile?.boostedTemplates?.has(template.id)) {
    score += 25;
  }

  // 6. Layer balance (if a specific layer is needed) (max 15)
  if (context.layerBalanceTarget && template.layerId === context.layerBalanceTarget) {
    score += 15;
  }

  // 7. Difficulty appropriate for time of day (morning = higher difficulty ok)
  if (currentHour >= 8 && currentHour <= 12 && template.difficulty >= 4) score += 10;
  if (currentHour >= 18 && template.difficulty <= 2) score += 8;

  // 8. Recent repetition avoidance (don't suggest same task too often)
  const recentSameName = userTasks.filter(t => 
    t.name.toLowerCase().includes(template.name.split('(')[0].trim().toLowerCase())
  ).length;
  score -= recentSameName * 5;

  // 9. Slot preference from user history (max 10)
  if (userProfile?.preferredSlots?.includes(slot.label)) {
    score += 10;
  }

  // 10. Pattern matching from intent text (if any)
  // (in a real implementation, intent would be passed; here we assume context has it)
  // For now, skip to keep function signature clean.

  // 11. Streak bonus: if user has a streak on this layer, boost templates that maintain it
  const streak = userProfile?.streakLayers?.[template.layerId] || 0;
  score += Math.min(streak, 10);

  // 12. Avoid overwhelm: if recentTaskCount > 5, penalize high-difficulty tasks
  if (context.avoidOverwhelm && context.recentTaskCount > 5 && template.difficulty >= 4) {
    score -= 15;
  }

  return score;
};

// ----------------------------------------------------------------------
// Recommendation Engine
// ----------------------------------------------------------------------
export const getRecommendedEdenTemplates = (params: {
  tasks: Task[];
  layerId?: LayerId;
  intent?: string;
  mostRepeated?: Array<{ name: string; layerId: LayerId; count: number }>;
  limit?: number;
  context?: Partial<TemplateRecommendationContext>;
  userProfile?: UserTemplateProfile;
}): EdenTemplate[] => {
  const {
    tasks,
    layerId,
    mostRepeated = [],
    limit = 20,
    context = {},
    userProfile,
  } = params;

  // Build full context
  const now = new Date();
  const fullContext: TemplateRecommendationContext = {
    currentHour: now.getHours(),
    currentDay: now.getDay(),
    userEnergyEstimate: context.userEnergyEstimate,
    recentTaskCount: tasks.filter(t => {
      const due = t.date ? new Date(t.date) : new Date();
      const hoursSince = (now.getTime() - due.getTime()) / (1000 * 60 * 60);
      return !t.completed && hoursSince < 2;
    }).length,
    layerBalanceTarget: context.layerBalanceTarget,
    userProfile,
    avoidOverwhelm: context.avoidOverwhelm ?? true,
  };

  const base = layerId ? getEdenTemplatesByLayer(layerId) : getAllEdenTemplates();

  const scored = base.map(template => ({
    template,
    score: scoreTemplate(template, fullContext, tasks, mostRepeated, userProfile),
  }));

  // Filter out negative scores (ignored templates)
  const valid = scored.filter(item => item.score > 0);

  // Sort by score descending
  valid.sort((a, b) => b.score - a.score);

  // Add some diversity: ensure not all from same category if possible
  const diverse: EdenTemplate[] = [];
  const seenCategories = new Set<TemplateCategory>();
  for (const item of valid) {
    if (diverse.length >= limit) break;
    if (diverse.length < limit / 2 || !seenCategories.has(item.template.category)) {
      diverse.push(item.template);
      seenCategories.add(item.template.category);
    }
  }

  // Fill remaining slots with top scored
  for (const item of valid) {
    if (diverse.length >= limit) break;
    if (!diverse.includes(item.template)) {
      diverse.push(item.template);
    }
  }

  return diverse;
};

// ----------------------------------------------------------------------
// Smart Template Generation for Today
// ----------------------------------------------------------------------
export const getTodaySmartTemplates = (
  tasks: Task[],
  userProfile?: UserTemplateProfile
): EdenTemplate[] => {
  const now = new Date();
  const hour = now.getHours();

  // Morning (5-11): Spiritual, Physical, Planning
  // Midday (12-16): Academic, Financial, General maintenance
  // Evening (17-22): Reflection, light tasks, connection
  // Night (23-4): Wind-down, low energy

  let targetLayers: LayerId[] = [];
  if (hour >= 5 && hour < 12) targetLayers = ['spiritual', 'physical', 'general'];
  else if (hour >= 12 && hour < 17) targetLayers = ['academic', 'financial', 'general'];
  else targetLayers = ['spiritual', 'general'];

  const recommendations: EdenTemplate[] = [];
  for (const layer of targetLayers) {
    const layerRecs = getRecommendedEdenTemplates({
      tasks,
      layerId: layer,
      limit: 3,
      context: {
        currentHour: hour,
        avoidOverwhelm: true,
      },
      userProfile,
    });
    recommendations.push(...layerRecs);
  }

  // Remove duplicates by ID
  const unique = Array.from(new Map(recommendations.map(t => [t.id, t])).values());
  return unique.slice(0, 12);
};

// ----------------------------------------------------------------------
// Convert Template to Actual Task
// ----------------------------------------------------------------------
export const templateToTask = (template: EdenTemplate, customDate?: Date): Omit<Task, 'id'> => {
  const now = customDate || new Date();
  // Adjust date if time is in the past for today
  const [hours, minutes] = template.time.split(':').map(Number);
  const taskDate = new Date(now);
  taskDate.setHours(hours, minutes, 0, 0);
  if (taskDate.getTime() < now.getTime()) {
    taskDate.setDate(taskDate.getDate() + 1);
  }

  return {
    name: template.name,
    layerId: template.layerId,
    priority: template.priority,
    repeat: template.repeat,
    time: template.time,
    completed: false,
    date: taskDate.toISOString(),
    alarmEnabled: true,
    alarmSound: 'Aggressive Bell',
    preferredMusic: 'Instrumental Warmth',
    // Optional: store templateId in metadata for tracking
    // metadata: { templateId: template.id }
  };
};

// ----------------------------------------------------------------------
// User Profile Management (in-memory, could be persisted)
// ----------------------------------------------------------------------
let userTemplateProfile: UserTemplateProfile = {
  preferredSlots: [],
  favoriteCategories: [],
  averageCompletionTime: 30,
  streakLayers: { spiritual: 0, academic: 0, financial: 0, physical: 0, general: 0 },
  ignoredTemplates: new Set(),
  boostedTemplates: new Set(),
  recentCompletions: [],
};

export const getUserTemplateProfile = (): UserTemplateProfile => userTemplateProfile;

export const updateUserTemplateProfile = (updates: Partial<UserTemplateProfile>) => {
  userTemplateProfile = { ...userTemplateProfile, ...updates };
};

export const recordTemplateCompletion = (templateId: string, completed: boolean) => {
  const profile = getUserTemplateProfile();
  profile.recentCompletions.push({ templateId, timestamp: Date.now() });
  // Keep last 100
  if (profile.recentCompletions.length > 100) profile.recentCompletions.shift();

  const template = getEdenTemplateById(templateId);
  if (template) {
    // Increment streak if daily and completed
    if (template.repeat === 'daily' && completed) {
      profile.streakLayers[template.layerId] = (profile.streakLayers[template.layerId] || 0) + 1;
    }
    // Add category to favorites if completed frequently
    const completions = profile.recentCompletions.filter(c => {
      const tpl = getEdenTemplateById(c.templateId);
      return tpl?.category === template.category;
    }).length;
    if (completions >= 3 && !profile.favoriteCategories.includes(template.category)) {
      profile.favoriteCategories.push(template.category);
    }
  }
  updateUserTemplateProfile(profile);
};

export const ignoreTemplate = (templateId: string) => {
  const profile = getUserTemplateProfile();
  profile.ignoredTemplates.add(templateId);
  updateUserTemplateProfile(profile);
};

export const boostTemplate = (templateId: string) => {
  const profile = getUserTemplateProfile();
  profile.boostedTemplates.add(templateId);
  updateUserTemplateProfile(profile);
};

// ----------------------------------------------------------------------
// Additional Utility Exports
// ----------------------------------------------------------------------
export const getSlots = (): Slot[] => SLOTS;

export const getTemplateCategories = (): TemplateCategory[] => [
  'core-habit', 'deep-work', 'quick-win', 'reflection', 'learning',
  'health', 'wealth', 'connection', 'planning', 'maintenance',
];

export const getLayerTaskCounts = (): Record<LayerId, number> => ({
  spiritual: SPIRITUAL_TASKS.length,
  academic: ACADEMIC_TASKS.length,
  financial: FINANCIAL_TASKS.length,
  physical: PHYSICAL_TASKS.length,
  general: GENERAL_TASKS.length,
});