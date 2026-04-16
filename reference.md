<!-- Home (Morning) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Edenify Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-secondary-fixed": "#271909",
                        "tertiary-fixed-dim": "#ffb3b0",
                        "surface-container-lowest": "#ffffff",
                        "on-error-container": "#93000a",
                        "surface-container-highest": "#e6e2db",
                        "on-tertiary-fixed": "#3f0308",
                        "surface-container-high": "#ece7e1",
                        "secondary-container": "#f7dbc1",
                        "on-tertiary-fixed-variant": "#792e2f",
                        "surface": "#fef9f2",
                        "surface-container-low": "#f8f3ec",
                        "on-tertiary-container": "#fffbff",
                        "on-primary-fixed-variant": "#773300",
                        "inverse-on-surface": "#f5f0e9",
                        "on-primary-container": "#fffbff",
                        "on-error": "#ffffff",
                        "surface-variant": "#e6e2db",
                        "on-secondary": "#ffffff",
                        "primary-fixed": "#ffdbca",
                        "on-secondary-fixed-variant": "#564330",
                        "inverse-primary": "#ffb68e",
                        "on-primary": "#ffffff",
                        "on-surface-variant": "#554339",
                        "tertiary": "#944242",
                        "surface-dim": "#ded9d3",
                        "error": "#ba1a1a",
                        "surface-bright": "#fef9f2",
                        "surface-container": "#f2ede6",
                        "inverse-surface": "#32302c",
                        "secondary": "#6f5b46",
                        "on-tertiary": "#ffffff",
                        "on-secondary-container": "#735f4a",
                        "secondary-fixed-dim": "#dcc2a9",
                        "on-primary-fixed": "#331200",
                        "surface-tint": "#99460a",
                        "on-background": "#1d1c18",
                        "primary": "#964407",
                        "outline-variant": "#dbc1b5",
                        "secondary-fixed": "#fadec4",
                        "primary-container": "#b65c21",
                        "outline": "#887368",
                        "background": "#fef9f2",
                        "tertiary-fixed": "#ffdad8",
                        "on-surface": "#1d1c18",
                        "error-container": "#ffdad6",
                        "tertiary-container": "#b35a59",
                        "primary-fixed-dim": "#ffb68e"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1.75rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Newsreader", "serif"],
                        "body": ["Manrope", "sans-serif"],
                        "label": ["Manrope", "sans-serif"],
                        "display": ["EB Garamond", "serif"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Manrope', sans-serif; background-color: #fef9f2; color: #1d1c18; }
        .serif-text { font-family: 'Newsreader', serif; }
        .display-text { font-family: 'EB Garamond', serif; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="min-h-screen pb-24 selection:bg-primary-fixed">
<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-[52px] bg-[#fef9f2]/80 backdrop-blur-xl transition-opacity hover:opacity-80">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[#964407]" data-icon="spa">spa</span>
<span class="text-xl font-serif text-[#964407] font-['Newsreader'] italic font-medium tracking-tight">Edenify</span>
</div>
<div class="flex items-center gap-4">
<button class="material-symbols-outlined text-[#964407] Active: scale-95 duration-150" data-icon="notifications">notifications</button>
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-container">
<img class="w-full h-full object-cover" data-alt="soft photographic portrait of a young man with a peaceful expression in natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdH7ZKdlLRl24Z9qGDSZ33Cziyvj1TmRKAK9SJePMnckX7SAQxvL_YVQtJ_o8kOje-87fyb4RIGuAyBz_KqeUvePy7z3LcIOPS-ItXcGcvSQV_6XltkNs3vpzky7VQTfLKKO7tTBiDeg3aH8I9wfaWk59avRQ68Ek6zP-q7aPkT4ZJPYwchZzElUVN7_0Dj6NrSUjI9iWZmMppuK0I3x_YAwA7iN8C6HLZkiGDmuZoZFYzAhYejCuS_LkSEh6B5ArSa7JSeT6XMQ"/>
</div>
</div>
</header>
<main class="pt-20 px-6 max-w-2xl mx-auto space-y-10">
<section class="space-y-2">
<p class="font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-bold">THURSDAY, APRIL 9</p>
<h1 class="display-text text-5xl font-medium tracking-tight text-on-surface">Good morning, Kevin.</h1>
</section>
<section class="py-4">
<p class="serif-text italic text-lg text-outline leading-relaxed">
                "Pause for a moment: What is one thing you are grateful for this morning?"
            </p>
</section>
<section class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="md:col-span-2 bg-surface-container-low rounded-2xl p-6 relative overflow-hidden group">
<div class="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
<div class="flex justify-between items-start mb-4">
<span class="font-label text-[10px] font-bold uppercase tracking-widest text-primary-container">TODAY'S PRIORITY</span>
<span class="font-label text-[11px] text-outline">8:00 AM</span>
</div>
<h3 class="display-text text-2xl text-on-surface">Complete Spiritual Layer reflection</h3>
<div class="mt-6 flex items-center gap-3">
<div class="flex-1 h-px bg-outline-variant/30"></div>
<button class="text-primary font-label text-xs font-bold uppercase tracking-wider">Start Now</button>
</div>
</div>
<div class="md:col-span-2 space-y-3 pt-2">
<div class="flex justify-between items-end">
<span class="font-label text-sm font-semibold text-on-surface">Today</span>
<span class="font-label text-sm font-bold text-primary">0 of 9 tasks</span>
</div>
<div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
<div class="w-0 h-full bg-primary transition-all duration-1000"></div>
</div>
</div>
</section>
<section class="space-y-4">
<div class="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_12px_32px_rgba(44,33,24,0.04)]">
<div class="flex justify-between items-center mb-6">
<span class="font-label text-[10px] font-bold tracking-[0.15em] text-outline uppercase">DAY 87 OF 400</span>
<span class="material-symbols-outlined text-primary text-xl" data-icon="book_5">book_5</span>
</div>
<h4 class="display-text text-xl mb-2 text-on-surface">John 15:1-5</h4>
<p class="serif-text italic text-on-surface-variant leading-relaxed text-base">
                    "I am the true vine, and my Father is the gardener. He cuts off every branch in me that bears no fruit, while every branch that does bear fruit he prunes..."
                </p>
<div class="mt-6 space-y-2">
<div class="w-full h-1 bg-surface-container rounded-full overflow-hidden">
<div class="w-1/3 h-full bg-primary"></div>
</div>
<p class="font-label text-[10px] text-outline text-right font-bold uppercase">32% Complete</p>
</div>
</div>
<div class="bg-surface-container-low p-6 rounded-2xl relative">
<div class="absolute top-0 left-0 w-full h-0.5 bg-[#7a6550]"></div>
<span class="font-label text-[10px] font-bold tracking-[0.15em] text-[#7a6550] uppercase mb-3 block">EDEN INSIGHT</span>
<p class="serif-text text-base text-on-surface-variant leading-snug">
                    Consistent spiritual habits act as the fertile soil for all other life pillars. When you anchor your morning, you anchor your day.
                </p>
</div>
</section>
<section class="flex items-center justify-between bg-surface-container-highest/30 p-4 rounded-xl">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary" data-icon="timer">timer</span>
<span class="font-label font-bold text-sm text-on-surface">Focus Session</span>
</div>
<button class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2 rounded-full font-label text-xs font-bold uppercase tracking-wider shadow-sm transition-transform active:scale-95">Start</button>
</section>
<section class="grid grid-cols-2 gap-4">
<div class="bg-surface-container-low p-5 rounded-2xl aspect-square flex flex-col justify-between">
<div class="w-8 h-8 rounded-lg bg-[#7a6550]/10 flex items-center justify-center">
<span class="material-symbols-outlined text-[#7a6550] text-lg" data-icon="church">church</span>
</div>
<div>
<p class="font-label text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Spiritual</p>
<p class="serif-text text-2xl text-on-surface">78%</p>
</div>
</div>
<div class="bg-surface-container-low p-5 rounded-2xl aspect-square flex flex-col justify-between">
<div class="w-8 h-8 rounded-lg bg-[#4d6b4a]/10 flex items-center justify-center">
<span class="material-symbols-outlined text-[#4d6b4a] text-lg" data-icon="school">school</span>
</div>
<div>
<p class="font-label text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Academic</p>
<p class="serif-text text-2xl text-on-surface">42%</p>
</div>
</div>
<div class="bg-surface-container-low p-5 rounded-2xl aspect-square flex flex-col justify-between">
<div class="w-8 h-8 rounded-lg bg-[#4a5d6b]/10 flex items-center justify-center">
<span class="material-symbols-outlined text-[#4a5d6b] text-lg" data-icon="payments">payments</span>
</div>
<div>
<p class="font-label text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Financial</p>
<p class="serif-text text-2xl text-on-surface">65%</p>
</div>
</div>
<div class="bg-surface-container-low p-5 rounded-2xl aspect-square flex flex-col justify-between">
<div class="w-8 h-8 rounded-lg bg-[#8c3c3c]/10 flex items-center justify-center">
<span class="material-symbols-outlined text-[#8c3c3c] text-lg" data-icon="fitness_center">fitness_center</span>
</div>
<div>
<p class="font-label text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Physical</p>
<p class="serif-text text-2xl text-on-surface">12%</p>
</div>
</div>
<div class="col-span-1 bg-surface-container-low p-5 rounded-2xl flex flex-col justify-between">
<div class="w-8 h-8 rounded-lg bg-[#5c4a6b]/10 flex items-center justify-center mb-8">
<span class="material-symbols-outlined text-[#5c4a6b] text-lg" data-icon="grid_view">grid_view</span>
</div>
<div>
<p class="font-label text-[10px] font-bold text-outline uppercase tracking-widest mb-1">General</p>
<p class="serif-text text-2xl text-on-surface">90%</p>
</div>
</div>
</section>
<section class="space-y-6 pb-12">
<h2 class="display-text text-2xl text-on-surface">Today's Tasks</h2>
<div class="space-y-4">
<div class="flex items-center gap-4 group">
<div class="w-6 h-6 rounded-full border-2 border-outline-variant group-hover:border-primary transition-colors"></div>
<div class="flex-1 flex justify-between items-center">
<span class="font-body text-sm font-medium text-on-surface">Morning Prayer</span>
<span class="font-label text-[11px] text-outline">7:30 AM</span>
</div>
</div>
<div class="flex items-center gap-4 group">
<div class="w-6 h-6 rounded-full border-2 border-outline-variant group-hover:border-primary transition-colors"></div>
<div class="flex-1 flex justify-between items-center">
<span class="font-body text-sm font-medium text-on-surface">Gym - Leg Day</span>
<span class="font-label text-[11px] text-outline">6:00 AM</span>
</div>
</div>
<div class="flex items-center gap-4 group">
<div class="w-6 h-6 rounded-full border-2 border-outline-variant group-hover:border-primary transition-colors"></div>
<div class="flex-1 flex justify-between items-center">
<span class="font-body text-sm font-medium text-on-surface">Review Financial Layer</span>
<span class="font-label text-[11px] text-outline">10:00 AM</span>
</div>
</div>
</div>
</section>
</main>
<button class="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#964407] to-[#b65c21] text-white shadow-[0_12px_32px_rgba(150,68,7,0.3)] flex items-center justify-center transition-transform active:scale-95 z-40">
<span class="material-symbols-outlined" data-icon="add">add</span>
</button>
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 bg-[#fef9f2]/90 backdrop-blur-lg h-[64px] shadow-[0_-4px_24px_rgba(44,33,24,0.04)]">
<a class="flex flex-col items-center justify-center text-[#964407] border-t-2 border-[#964407] pt-1 transition-colors hover:text-[#964407] active:translate-y-[-2px] duration-300" href="#">
<span class="material-symbols-outlined" data-icon="home" style="font-variation-settings: 'FILL' 1;">home</span>
<span class="font-['Manrope'] text-[10px] uppercase tracking-widest font-bold">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-[#1d1c18]/40 pt-1 transition-colors hover:text-[#964407] active:translate-y-[-2px] duration-300" href="#">
<span class="material-symbols-outlined" data-icon="layers">layers</span>
<span class="font-['Manrope'] text-[10px] uppercase tracking-widest font-bold">Layers</span>
</a>
<a class="flex flex-col items-center justify-center text-[#1d1c18]/40 pt-1 transition-colors hover:text-[#964407] active:translate-y-[-2px] duration-300" href="#">
<span class="material-symbols-outlined" data-icon="local_florist">local_florist</span>
<span class="font-['Manrope'] text-[10px] uppercase tracking-widest font-bold">Eden</span>
</a>
<a class="flex flex-col items-center justify-center text-[#1d1c18]/40 pt-1 transition-colors hover:text-[#964407] active:translate-y-[-2px] duration-300" href="#">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="font-['Manrope'] text-[10px] uppercase tracking-widest font-bold">Profile</span>
</a>
</nav>
</body></html>

<!-- Home (Midday) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Edenify Dashboard - Midday</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&amp;family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-secondary-fixed": "#271909",
                        "tertiary-fixed-dim": "#ffb3b0",
                        "surface-container-lowest": "#ffffff",
                        "on-error-container": "#93000a",
                        "surface-container-highest": "#e6e2db",
                        "on-tertiary-fixed": "#3f0308",
                        "surface-container-high": "#ece7e1",
                        "secondary-container": "#f7dbc1",
                        "on-tertiary-fixed-variant": "#792e2f",
                        "surface": "#fef9f2",
                        "surface-container-low": "#f8f3ec",
                        "on-tertiary-container": "#fffbff",
                        "on-primary-fixed-variant": "#773300",
                        "inverse-on-surface": "#f5f0e9",
                        "on-primary-container": "#fffbff",
                        "on-error": "#ffffff",
                        "surface-variant": "#e6e2db",
                        "on-secondary": "#ffffff",
                        "primary-fixed": "#ffdbca",
                        "on-secondary-fixed-variant": "#564330",
                        "inverse-primary": "#ffb68e",
                        "on-primary": "#ffffff",
                        "on-surface-variant": "#554339",
                        "tertiary": "#944242",
                        "surface-dim": "#ded9d3",
                        "error": "#ba1a1a",
                        "surface-bright": "#fef9f2",
                        "surface-container": "#f2ede6",
                        "inverse-surface": "#32302c",
                        "secondary": "#6f5b46",
                        "on-tertiary": "#ffffff",
                        "on-secondary-container": "#735f4a",
                        "secondary-fixed-dim": "#dcc2a9",
                        "on-primary-fixed": "#331200",
                        "surface-tint": "#99460a",
                        "on-background": "#1d1c18",
                        "primary": "#964407",
                        "outline-variant": "#dbc1b5",
                        "secondary-fixed": "#fadec4",
                        "primary-container": "#b65c21",
                        "outline": "#887368",
                        "background": "#fef9f2",
                        "tertiary-fixed": "#ffdad8",
                        "on-surface": "#1d1c18",
                        "error-container": "#ffdad6",
                        "tertiary-container": "#b35a59",
                        "primary-fixed-dim": "#ffb68e"
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1.75rem",
                        "full": "9999px"
                    },
                    fontFamily: {
                        "headline": ["Newsreader", "serif"],
                        "body": ["Manrope", "sans-serif"],
                        "label": ["Manrope", "sans-serif"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
        }
        .editorial-shadow {
            box-shadow: 0 12px 32px rgba(44, 33, 24, 0.06);
        }
        .primary-gradient {
            background: linear-gradient(45deg, #964407 0%, #b65c21 100%);
        }
        .glass-header {
            background: rgba(254, 249, 242, 0.8);
            backdrop-filter: blur(12px);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface font-body text-on-surface selection:bg-primary-fixed pb-24">
<!-- TopAppBar -->
<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-[52px] bg-[#fef9f2]/80 dark:bg-[#32302c]/80 backdrop-blur-xl">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[#964407] dark:text-[#b65c21]" data-icon="spa">spa</span>
<span class="text-xl font-serif text-[#964407] dark:text-[#b65c21] font-['Newsreader'] italic font-medium tracking-tight">Edenify</span>
</div>
<div class="flex items-center gap-4">
<button class="text-[#1d1c18]/60 dark:text-[#f8f3ec]/60 hover:opacity-80 transition-opacity active:scale-95 duration-150">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
</div>
</header>
<main class="pt-20 px-6 max-w-2xl mx-auto">
<!-- Hero Greeting Section -->
<section class="mb-10">
<h1 class="font-headline italic text-4xl mb-2 tracking-tight text-on-surface">Good afternoon, Kevin.</h1>
<p class="font-body text-on-surface-variant opacity-70">The sun is high, and your spirit is steady. Your intentional record for today is unfolding beautifully.</p>
</section>
<!-- Bento Grid Main Content -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<!-- Progress Card -->
<div class="col-span-full bg-surface-container-low p-6 rounded-2xl relative overflow-hidden">
<div class="flex justify-between items-end mb-6">
<div>
<span class="font-label text-xs uppercase tracking-widest font-bold opacity-50 block mb-1">Daily Discipline</span>
<h2 class="font-headline text-3xl italic">5 of 9 tasks</h2>
</div>
<div class="text-right">
<span class="font-headline text-4xl font-medium text-primary">55%</span>
</div>
</div>
<div class="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full primary-gradient transition-all duration-700 ease-out" style="width: 55%;"></div>
</div>
<div class="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-tighter opacity-40">
<span>Morning Vow</span>
<span>Midday Momentum</span>
<span>Evening Peace</span>
</div>
</div>
<!-- Priority Task Card (Spiritual Layer) -->
<div class="col-span-full md:col-span-1 bg-surface-container-lowest p-6 rounded-2xl editorial-shadow border-t-4 border-[#7a6550]">
<div class="flex items-start justify-between">
<div>
<div class="flex items-center gap-2 mb-3">
<span class="w-2 h-2 rounded-full bg-[#7a6550]"></span>
<span class="font-label text-[10px] uppercase tracking-widest font-bold text-[#7a6550]">Spiritual Layer</span>
</div>
<h3 class="font-headline text-xl italic line-through opacity-40">Complete Spiritual Layer reflection</h3>
</div>
<span class="material-symbols-outlined text-[#7a6550]" data-icon="check_circle" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
<p class="mt-4 text-sm font-body opacity-50 italic">Reflection logged at 11:42 AM.</p>
</div>
<!-- Eden Insight Card -->
<div class="col-span-full md:col-span-1 bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between">
<div class="mb-4">
<span class="material-symbols-outlined text-primary mb-3" data-icon="auto_awesome">auto_awesome</span>
<h3 class="font-headline text-lg italic leading-tight">Eden Insight</h3>
<p class="mt-2 text-sm leading-relaxed opacity-80">You're maintaining a steady rhythm. Completing one more Academic task now will clear your path for a restful evening.</p>
</div>
<div class="pt-4 border-t-0 flex items-center gap-2">
<img alt="Midday Sun" class="w-8 h-8 rounded-full object-cover" data-alt="soft sunlight filtering through leaves in a tranquil forest at noon, hazy atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgn8WbuGZsosmhcMSuGvB6OELUWS7tHTWKTJvnt4tqMX0GUxynP0EHdNdI_Zz2agh8uuzCw81jC4fGKEFOBvFU6zPwCvBWkpZKWfs4cfTKYBbVg6TFYINLqL3Z5SJdbNcD4OGKxTu3oLH5zbVAO7m_xDoHoMdQkea_oV1hpRYc8MZug_Fk25aUS-ftYhXWzfpIfHPQbzApJKKSIrFFsQAJFmFtXR-47kkyq39SwhAoBtJO1w-tR4Jlibaryd3rODy2_JpoO8x70Q"/>
<span class="text-[10px] font-bold uppercase tracking-widest opacity-60">Nature's Sync: High Sun</span>
</div>
</div>
<!-- Task List Section -->
<div class="col-span-full mt-4">
<h4 class="font-headline text-2xl italic mb-6">Remaining Disciplines</h4>
<div class="space-y-4">
<!-- Pending Tasks -->
<div class="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors group">
<div class="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors cursor-pointer"></div>
<div class="flex-1">
<span class="text-sm font-body font-semibold">Review Q3 Financial Strategy</span>
<span class="block text-[10px] font-bold uppercase tracking-widest text-[#4a5d6b] mt-1">Financial</span>
</div>
</div>
<div class="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-high transition-colors group">
<div class="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors cursor-pointer"></div>
<div class="flex-1">
<span class="text-sm font-body font-semibold">30min High-Intensity Movement</span>
<span class="block text-[10px] font-bold uppercase tracking-widest text-[#8c3c3c] mt-1">Physical</span>
</div>
</div>
<!-- Completed Tasks (Moved to Bottom) -->
<div class="opacity-40">
<div class="h-[1px] bg-outline-variant/20 mb-6"></div>
<h5 class="font-label text-[10px] uppercase tracking-widest font-bold mb-4">Restored Harmony (Completed)</h5>
<div class="space-y-2">
<div class="flex items-center gap-4 p-4">
<span class="material-symbols-outlined text-primary text-xl" data-icon="check_circle" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-sm font-body line-through">Deep Work: Thesis Chapter 4</span>
</div>
<div class="flex items-center gap-4 p-4">
<span class="material-symbols-outlined text-primary text-xl" data-icon="check_circle" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-sm font-body line-through">Water Intake (2L)</span>
</div>
<div class="flex items-center gap-4 p-4">
<span class="material-symbols-outlined text-primary text-xl" data-icon="check_circle" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-sm font-body line-through">Morning Prayer &amp; Gratitude</span>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
<!-- Floating Action Button (Contextual) -->
<button class="fixed bottom-24 right-6 w-14 h-14 primary-gradient rounded-full flex items-center justify-center text-on-primary editorial-shadow active:scale-95 duration-150 z-50">
<span class="material-symbols-outlined text-2xl" data-icon="add">add</span>
</button>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 bg-[#fef9f2]/90 dark:bg-[#32302c]/90 backdrop-blur-lg h-[64px] shadow-[0_-4px_24px_rgba(44,33,24,0.04)]">
<a class="flex flex-col items-center justify-center text-[#964407] border-t-2 border-[#964407] pt-1 transition-all duration-300 translate-y-[-2px]" href="#">
<span class="material-symbols-outlined" data-icon="home" style="font-variation-settings: 'FILL' 1;">home</span>
<span class="font-['Manrope'] text-[10px] uppercase tracking-widest font-bold">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-[#1d1c18]/40 dark:text-[#f8f3ec]/40 pt-1 hover:text-[#964407] transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="layers">layers</span>
<span class="font-['Manrope'] text-[10px] uppercase tracking-widest font-bold">Layers</span>
</a>
<a class="flex flex-col items-center justify-center text-[#1d1c18]/40 dark:text-[#f8f3ec]/40 pt-1 hover:text-[#964407] transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="local_florist">local_florist</span>
<span class="font-['Manrope'] text-[10px] uppercase tracking-widest font-bold">Eden</span>
</a>
<a class="flex flex-col items-center justify-center text-[#1d1c18]/40 dark:text-[#f8f3ec]/40 pt-1 hover:text-[#964407] transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="font-['Manrope'] text-[10px] uppercase tracking-widest font-bold">Profile</span>
</a>
</nav>
</body></html>

<!-- Splash Screen -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "secondary": "#6f5b46",
                    "surface-container": "#f2ede6",
                    "inverse-surface": "#32302c",
                    "on-tertiary": "#ffffff",
                    "on-secondary-container": "#735f4a",
                    "tertiary": "#944242",
                    "surface-bright": "#fef9f2",
                    "surface-dim": "#ded9d3",
                    "error": "#ba1a1a",
                    "primary-container": "#b65c21",
                    "outline": "#887368",
                    "background": "#fef9f2",
                    "tertiary-fixed": "#ffdad8",
                    "on-surface": "#1d1c18",
                    "primary-fixed-dim": "#ffb68e",
                    "tertiary-container": "#b35a59",
                    "error-container": "#ffdad6",
                    "secondary-fixed-dim": "#dcc2a9",
                    "on-primary-fixed": "#331200",
                    "on-background": "#1d1c18",
                    "surface-tint": "#99460a",
                    "outline-variant": "#dbc1b5",
                    "primary": "#964407",
                    "secondary-fixed": "#fadec4",
                    "secondary-container": "#f7dbc1",
                    "surface-container-high": "#ece7e1",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "surface-container-low": "#f8f3ec",
                    "surface": "#fef9f2",
                    "on-secondary-fixed": "#271909",
                    "surface-container-lowest": "#ffffff",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "surface-container-highest": "#e6e2db",
                    "on-tertiary-fixed": "#3f0308",
                    "on-error-container": "#93000a",
                    "on-secondary": "#ffffff",
                    "surface-variant": "#e6e2db",
                    "inverse-primary": "#ffb68e",
                    "on-secondary-fixed-variant": "#564330",
                    "primary-fixed": "#ffdbca",
                    "on-surface-variant": "#554339",
                    "on-primary": "#ffffff",
                    "on-primary-fixed-variant": "#773300",
                    "on-tertiary-container": "#fffbff",
                    "on-primary-container": "#fffbff",
                    "on-error": "#ffffff",
                    "inverse-on-surface": "#f5f0e9"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"]
            }
          },
        },
      }
    </script>
<style>
        body {
            margin: 0;
            padding: 0;
            background-color: #3d2b1f;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .logo-glow {
            filter: drop-shadow(0 0 20px rgba(212, 168, 106, 0.15));
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="antialiased overflow-hidden select-none">
<main class="relative h-screen w-full flex flex-col items-center justify-center bg-[#3d2b1f]">
<!-- Decorative Ambient Light -->
<div class="absolute inset-0 pointer-events-none overflow-hidden">
<div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#d4a86a]/5 blur-[120px]"></div>
<div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#964407]/10 blur-[120px]"></div>
</div>
<!-- Content Container -->
<div class="relative z-10 flex flex-col items-center text-center space-y-8">
<!-- Logo Mark: Brain-Apple-Cross Illustration -->
<div class="logo-glow relative w-[140px] h-[140px] flex items-center justify-center">
<svg fill="none" height="140" viewbox="0 0 140 140" width="140" xmlns="http://www.w3.org/2000/svg">
<circle cx="70" cy="70" r="68" stroke="#d4a86a" stroke-opacity="0.15" stroke-width="0.5"></circle>
<!-- Stylized Apple/Brain Core -->
<path d="M70 30C55 30 45 40 45 55C45 75 70 100 70 100C70 100 95 75 95 55C95 40 85 30 70 30Z" fill="#d4a86a" fill-opacity="0.1"></path>
<path d="M70 35C60 35 52 42 52 53C52 68 70 88 70 88C70 88 88 68 88 53C88 42 80 35 70 35Z" stroke="#d4a86a" stroke-linecap="round" stroke-width="1.5"></path>
<!-- The Cross Element -->
<path d="M70 45V65M60 55H80" stroke="#d4a86a" stroke-linecap="round" stroke-width="1.5"></path>
<!-- Brain Neural Nodes Pattern -->
<circle cx="58" cy="48" fill="#d4a86a" r="1.5"></circle>
<circle cx="82" cy="48" fill="#d4a86a" r="1.5"></circle>
<circle cx="55" cy="58" fill="#d4a86a" fill-opacity="0.6" r="1"></circle>
<circle cx="85" cy="58" fill="#d4a86a" fill-opacity="0.6" r="1"></circle>
<!-- Leaf Detail -->
<path d="M70 30C70 25 74 22 78 22" stroke="#d4a86a" stroke-linecap="round" stroke-width="1.5"></path>
</svg>
</div>
<!-- Wordmark Cluster -->
<div class="flex flex-col items-center space-y-2">
<h1 class="font-headline italic text-4xl sm:text-5xl tracking-tight text-[#d4a86a]">
                    EDENIFY
                </h1>
<p class="font-body text-sm sm:text-base tracking-[0.2em] text-[#a08060] uppercase font-medium">
                    Your Purpose, Restored.
                </p>
</div>
</div>
<!-- Subtle Footer Element (Abstract Texture) -->
<div class="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20">
<div class="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4a86a] to-transparent"></div>
</div>
<!-- Texture Overlay (Simulating Linen/Paper) -->
<div class="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
<svg height="100%" width="100%">
<filter id="grain">
<feturbulence basefrequency="0.6" numoctaves="3" stitchtiles="stitch" type="fractalNoise"></feturbulence>
<fecolormatrix type="saturate" values="0"></fecolormatrix>
</filter>
<rect filter="url(#grain)" height="100%" width="100%"></rect>
</svg>
</div>
</main>
<!-- Navigation Shell Suppressed per "The Destination Rule" - This is a Splash Screen (Transactional/Onboarding Flow) -->
</body></html>

<!-- Home (Scrolled) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Edenify Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400;1,500&amp;family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-secondary-fixed": "#271909",
                        "tertiary-fixed-dim": "#ffb3b0",
                        "surface-container-lowest": "#ffffff",
                        "on-error-container": "#93000a",
                        "surface-container-highest": "#e6e2db",
                        "on-tertiary-fixed": "#3f0308",
                        "surface-container-high": "#ece7e1",
                        "secondary-container": "#f7dbc1",
                        "on-tertiary-fixed-variant": "#792e2f",
                        "surface": "#fef9f2",
                        "surface-container-low": "#f8f3ec",
                        "on-tertiary-container": "#fffbff",
                        "on-primary-fixed-variant": "#773300",
                        "inverse-on-surface": "#f5f0e9",
                        "on-primary-container": "#fffbff",
                        "on-error": "#ffffff",
                        "surface-variant": "#e6e2db",
                        "on-secondary": "#ffffff",
                        "primary-fixed": "#ffdbca",
                        "on-secondary-fixed-variant": "#564330",
                        "inverse-primary": "#ffb68e",
                        "on-primary": "#ffffff",
                        "on-surface-variant": "#554339",
                        "tertiary": "#944242",
                        "surface-dim": "#ded9d3",
                        "error": "#ba1a1a",
                        "surface-bright": "#fef9f2",
                        "surface-container": "#f2ede6",
                        "inverse-surface": "#32302c",
                        "secondary": "#6f5b46",
                        "on-tertiary": "#ffffff",
                        "on-secondary-container": "#735f4a",
                        "secondary-fixed-dim": "#dcc2a9",
                        "on-primary-fixed": "#331200",
                        "surface-tint": "#99460a",
                        "on-background": "#1d1c18",
                        "primary": "#964407",
                        "outline-variant": "#dbc1b5",
                        "secondary-fixed": "#fadec4",
                        "primary-container": "#b65c21",
                        "outline": "#887368",
                        "background": "#fef9f2",
                        "tertiary-fixed": "#ffdad8",
                        "on-surface": "#1d1c18",
                        "error-container": "#ffdad6",
                        "tertiary-container": "#b35a59",
                        "primary-fixed-dim": "#ffb68e"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Newsreader"],
                        "body": ["Manrope"],
                        "label": ["Manrope"]
                    }
                },
            },
        }
    </script>
<style>.material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24
    }
body {
    font-family: "Manrope", sans-serif
    }
h1, h2, h3 {
    font-family: "Newsreader", serif
    }
.linen-texture {
    background-color: #faf5ee;
    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuBu8KM-Kg3j21WImU1t8cGYumKUwQbkhOfPmMtcjtVSWNpKnIGEJBLwC9gN37sIKrkL3QquuweqLnr_975bYa7wCxXE4Z1wYE3_uGgJFa7XSX1DBGyBQS5IO8N7D2SECbnWFLzGY1NgUKPWaVWhMtXRYq6mGDuHfr5T_l48Og84Lenkw2zeCyVBpdyMNy-JFPt6o0TiZ8_NmW0yYf51aFc2OsubJaghGOI-Zq0AEUdh9trow7u7kowg4pzp_h1e90tet0X214mUQg)
    }
.scrolled-header-shadow {
    box-shadow: 0 4px 20px -2px rgba(44, 33, 24, 0.08)
    }</style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface min-h-screen linen-texture">
<!-- TopAppBar -->
<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-[52px] bg-[#fef9f2]/80 dark:bg-[#32302c]/80 backdrop-blur-xl">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[#964407] dark:text-[#b65c21]" data-icon="spa">spa</span>
<h1 class="text-xl font-serif text-[#964407] dark:text-[#b65c21] font-['Newsreader'] italic font-medium tracking-tight">Edenify</h1>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-[#1d1c18]/60 dark:text-[#f8f3ec]/60 hover:opacity-80 transition-opacity cursor-pointer" data-icon="notifications">notifications</span>
</div>
</header>
<main class="pt-[52px] pb-24 px-6 max-w-2xl mx-auto">
<!-- Floating State: Today's Tasks Header -->
<section class="mt-8">
<div class="sticky top-[52px] z-40 bg-[#faf5ee]/95 backdrop-blur-md py-4 -mx-6 px-6 mb-4 transition-all">
<div class="flex justify-between items-baseline">
<h2 class="text-3xl font-medium tracking-tight text-on-surface">TODAY'S TASKS</h2>
<span class="font-body text-xs font-bold uppercase tracking-[0.2em] text-primary/60">May 24, 2024</span>
</div>
</div>
<!-- Task List -->
<div class="space-y-4">
<!-- Morning Prayer (Checked) -->
<div class="group flex items-center gap-4 p-5 bg-surface-container-low rounded-2xl transition-all hover:bg-surface-container-high relative overflow-hidden">
<div class="absolute left-0 top-0 h-full w-1 bg-[#7a6550]"></div> <!-- Reflection Marker: Spiritual -->
<div class="flex-shrink-0 w-6 h-6 rounded-full border-2 border-primary/20 flex items-center justify-center bg-primary">
<span class="material-symbols-outlined text-white text-sm" data-icon="check" style="font-variation-settings: 'FILL' 0, 'wght' 700;">check</span>
</div>
<div class="flex-grow">
<h3 class="text-lg leading-tight text-on-surface/40 line-through">Morning Prayer</h3>
<p class="text-xs font-body font-medium text-on-surface-variant/40">6:30 AM • SPIRITUAL</p>
</div>
</div>
<!-- Workout (Checked) -->
<div class="group flex items-center gap-4 p-5 bg-surface-container-low rounded-2xl transition-all hover:bg-surface-container-high relative overflow-hidden">
<div class="absolute left-0 top-0 h-full w-1 bg-[#8c3c3c]"></div> <!-- Reflection Marker: Physical -->
<div class="flex-shrink-0 w-6 h-6 rounded-full border-2 border-primary/20 flex items-center justify-center bg-primary">
<span class="material-symbols-outlined text-white text-sm" data-icon="check" style="font-variation-settings: 'FILL' 0, 'wght' 700;">check</span>
</div>
<div class="flex-grow">
<h3 class="text-lg leading-tight text-on-surface/40 line-through">Workout</h3>
<p class="text-xs font-body font-medium text-on-surface-variant/40">7:15 AM • PHYSICAL</p>
</div>
</div>
<!-- Team Meeting (Active) -->
<div class="group flex items-center gap-4 p-6 bg-surface-container-lowest rounded-2xl transition-all hover:translate-y-[-2px] relative overflow-hidden shadow-[0_8px_24px_rgba(44,33,24,0.03)] border-l-[3px] border-[#4d6b4a]">
<div class="flex-shrink-0 w-6 h-6 rounded-full border-2 border-primary/40 flex items-center justify-center bg-transparent">
</div>
<div class="flex-grow">
<div class="flex justify-between items-start">
<h3 class="text-xl font-semibold leading-tight text-on-surface">Team Meeting</h3>
<span class="px-2 py-1 bg-secondary-container/30 text-on-secondary-container text-[10px] font-bold rounded uppercase tracking-wider">Upcoming</span>
</div>
<p class="text-sm font-body font-semibold text-[#4d6b4a] mt-1">10:00 AM • ACADEMIC / WORK</p>
</div>
</div>
<!-- Budget Review -->
<div class="group flex items-center gap-4 p-5 bg-surface-container-low rounded-2xl transition-all hover:bg-surface-container-high relative overflow-hidden">
<div class="absolute left-0 top-0 h-full w-1 bg-[#4a5d6b]"></div> <!-- Reflection Marker: Financial -->
<div class="flex-shrink-0 w-6 h-6 rounded-full border-2 border-primary/20 flex items-center justify-center bg-transparent">
</div>
<div class="flex-grow">
<h3 class="text-lg leading-tight text-on-surface">Budget Review</h3>
<p class="text-xs font-body font-medium text-on-surface-variant/60 uppercase tracking-wide">1:00 PM • FINANCIAL</p>
</div>
</div>
<!-- Evening Reading -->
<div class="group flex items-center gap-4 p-5 bg-surface-container-low rounded-2xl transition-all hover:bg-surface-container-high relative overflow-hidden">
<div class="absolute left-0 top-0 h-full w-1 bg-[#5c4a6b]"></div> <!-- Reflection Marker: General -->
<div class="flex-shrink-0 w-6 h-6 rounded-full border-2 border-primary/20 flex items-center justify-center bg-transparent">
</div>
<div class="flex-grow">
<h3 class="text-lg leading-tight text-on-surface">Evening Reading</h3>
<p class="text-xs font-body font-medium text-on-surface-variant/60 uppercase tracking-wide">8:00 PM • GENERAL</p>
</div>
</div>
</div>
</section>
<!-- Stats Bento Grid (Partial Visibility) -->
<section class="mt-12 grid grid-cols-2 gap-4">
<div class="p-6 bg-surface-container-low rounded-[2rem] flex flex-col justify-between aspect-square">
<span class="material-symbols-outlined text-primary" data-icon="auto_awesome">auto_awesome</span>
<div>
<p class="text-4xl font-serif font-medium">84%</p>
<p class="text-xs font-bold uppercase tracking-widest text-on-surface/50 mt-1">Daily Clarity</p>
</div>
</div>
<div class="p-6 bg-primary-container rounded-[2rem] text-on-primary-container flex flex-col justify-between aspect-square bg-gradient-to-br from-primary to-primary-container">
<span class="material-symbols-outlined" data-icon="psychology" style="font-variation-settings: 'FILL' 1;">psychology</span>
<div>
<p class="text-xl leading-snug font-serif italic">"Action is the antidote to despair."</p>
<p class="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-2">Reflection</p>
</div>
</div>
</section>
</main>
<!-- FAB -->
<button class="fixed right-6 bottom-20 z-50 w-14 h-14 bg-gradient-to-br from-primary to-primary-container rounded-full shadow-[0_12px_32px_rgba(44,33,24,0.15)] flex items-center justify-center text-white active:scale-95 duration-150 group">
<span class="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90" data-icon="add">add</span>
</button>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-[64px] bg-[#fef9f2]/90 dark:bg-[#32302c]/90 backdrop-blur-lg shadow-[0_-4px_24px_rgba(44,33,24,0.04)]">
<!-- Home (Active) -->
<a class="flex flex-col items-center justify-center text-[#964407] border-t-2 border-[#964407] pt-1 Active: translate-y-[-2px] duration-300" href="#">
<span class="material-symbols-outlined" data-icon="home" style="font-variation-settings: 'FILL' 1;">home</span>
<span class="font-['Manrope'] text-[10px] uppercase tracking-widest font-bold">Home</span>
</a>
<!-- Layers -->
<a class="flex flex-col items-center justify-center text-[#1d1c18]/40 dark:text-[#f8f3ec]/40 pt-1 hover:text-[#964407] transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="layers">layers</span>
<span class="font-['Manrope'] text-[10px] uppercase tracking-widest font-bold">Layers</span>
</a>
<!-- Eden -->
<a class="flex flex-col items-center justify-center text-[#1d1c18]/40 dark:text-[#f8f3ec]/40 pt-1 hover:text-[#964407] transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="local_florist">local_florist</span>
<span class="font-['Manrope'] text-[10px] uppercase tracking-widest font-bold">Eden</span>
</a>
<!-- Profile -->
<a class="flex flex-col items-center justify-center text-[#1d1c18]/40 dark:text-[#f8f3ec]/40 pt-1 hover:text-[#964407] transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="font-['Manrope'] text-[10px] uppercase tracking-widest font-bold">Profile</span>
</a>
</nav>
</body></html>

<!-- Reset Password -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&amp;family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "secondary": "#6f5b46",
                    "surface-container": "#f2ede6",
                    "inverse-surface": "#32302c",
                    "on-tertiary": "#ffffff",
                    "on-secondary-container": "#735f4a",
                    "tertiary": "#944242",
                    "surface-bright": "#fef9f2",
                    "surface-dim": "#ded9d3",
                    "error": "#ba1a1a",
                    "primary-container": "#b65c21",
                    "outline": "#887368",
                    "background": "#fef9f2",
                    "tertiary-fixed": "#ffdad8",
                    "on-surface": "#1d1c18",
                    "primary-fixed-dim": "#ffb68e",
                    "tertiary-container": "#b35a59",
                    "error-container": "#ffdad6",
                    "secondary-fixed-dim": "#dcc2a9",
                    "on-primary-fixed": "#331200",
                    "on-background": "#1d1c18",
                    "surface-tint": "#99460a",
                    "outline-variant": "#dbc1b5",
                    "primary": "#964407",
                    "secondary-fixed": "#fadec4",
                    "secondary-container": "#f7dbc1",
                    "surface-container-high": "#ece7e1",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "surface-container-low": "#f8f3ec",
                    "surface": "#fef9f2",
                    "on-secondary-fixed": "#271909",
                    "surface-container-lowest": "#ffffff",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "surface-container-highest": "#e6e2db",
                    "on-tertiary-fixed": "#3f0308",
                    "on-error-container": "#93000a",
                    "on-secondary": "#ffffff",
                    "surface-variant": "#e6e2db",
                    "inverse-primary": "#ffb68e",
                    "on-secondary-fixed-variant": "#564330",
                    "primary-fixed": "#ffdbca",
                    "on-surface-variant": "#554339",
                    "on-primary": "#ffffff",
                    "on-primary-fixed-variant": "#773300",
                    "on-tertiary-container": "#fffbff",
                    "on-primary-container": "#fffbff",
                    "on-error": "#ffffff",
                    "inverse-on-surface": "#f5f0e9"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .bg-auth-custom {
            background-color: #3d2b1f;
        }
        .text-header-custom {
            color: #d4a86a;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-auth-custom font-body text-surface min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
<!-- Decorative Elements -->
<div class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-10 bg-gradient-to-br from-primary-container to-transparent blur-[80px]"></div>
<div class="absolute bottom-[-5%] left-[-15%] w-[400px] h-[400px] rounded-full opacity-5 bg-tertiary blur-[100px]"></div>
<!-- Top Bar Navigation (Contextual Suppression of BottomNavBar/TopAppBar JSON) -->
<div class="absolute top-8 left-6 md:left-12">
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-surface/5 text-surface-container hover:bg-surface/10 transition-all duration-300">
<span class="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
</button>
</div>
<!-- Main Content Canvas -->
<main class="w-full max-w-[420px] z-10 flex flex-col items-center">
<!-- Identity Section -->
<div class="mb-12 flex flex-col items-center">
<div class="h-[56px] mb-8">
<span class="material-symbols-outlined text-surface text-[56px] leading-none" data-icon="spa" style="font-variation-settings: 'FILL' 1;">spa</span>
</div>
<h1 class="font-headline text-header-custom text-4xl md:text-5xl font-medium tracking-tight mb-4 italic text-center">Reset Password</h1>
<p class="font-body text-surface/70 text-center leading-relaxed max-w-[320px]">
                Enter your email and we will send a reset link.
            </p>
</div>
<!-- Form Section -->
<div class="w-full space-y-8">
<div class="space-y-6">
<!-- Email Field with Dark Treatment -->
<div class="relative group">
<label class="block text-[10px] uppercase tracking-[0.2em] font-bold text-surface/40 mb-2 ml-1">Email Address</label>
<div class="relative flex items-center">
<span class="material-symbols-outlined absolute left-4 text-surface/30" data-icon="mail">mail</span>
<input class="w-full bg-white/5 border-b-2 border-surface/10 focus:border-primary-container focus:ring-0 text-surface py-4 pl-12 pr-4 transition-all duration-300 placeholder:text-surface/20" placeholder="name@edenify.com" type="email"/>
</div>
</div>
</div>
<!-- Primary Action -->
<button class="w-full h-14 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label font-bold tracking-wider text-sm uppercase shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all duration-300">
                Send Reset Link
            </button>
</div>
<!-- Footer Actions -->
<footer class="mt-12 flex flex-col items-center">
<button class="group flex items-center gap-2 text-surface/60 hover:text-surface transition-colors font-medium text-sm">
<span class="underline decoration-surface/20 underline-offset-8 group-hover:decoration-surface transition-all">Back to Sign In</span>
</button>
</footer>
</main>
<!-- Subtle Texture Overlay -->
<div class="fixed inset-0 pointer-events-none opacity-[0.03] contrast-150 mix-blend-overlay">
<div class="w-full h-full" data-alt="High-end handmade paper texture with organic grain and subtle fibrous details" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNn0u4HAJRZzFgJx0m0IlmdsncDUADJ9Zd6LtmBWoi4AHsOmO_NiE9zbeLD6xhIeGuooErSpDzBQxnOQoX_7YxLAlWHEYYzUXlTCGNpTNVfs08jIQwSw9OM_jVeDC4r6dTy5pC5L-u20j_QEr8bM7fAAYKN6F4P0t6eT8WuhfiM_nvE_11-xyfxt3ZIJdTlU1klrlAYswCp48AkTDc203mNsUfRnPytTYmNBHO2r55V9_EsZ1S-Bm2orxCNUVYBag12KOe5MOy6g');"></div>
</div>
</body></html>

<!-- Sign In -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Edenify — Sign In</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&amp;family=Manrope:wght@300;400;500;600;700;800&amp;family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;display=swap" rel="stylesheet"/>
<!-- Icons -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "secondary": "#6f5b46",
                      "surface-container": "#f2ede6",
                      "inverse-surface": "#32302c",
                      "on-tertiary": "#ffffff",
                      "on-secondary-container": "#735f4a",
                      "tertiary": "#944242",
                      "surface-bright": "#fef9f2",
                      "surface-dim": "#ded9d3",
                      "error": "#ba1a1a",
                      "primary-container": "#b65c21",
                      "outline": "#887368",
                      "background": "#fef9f2",
                      "tertiary-fixed": "#ffdad8",
                      "on-surface": "#1d1c18",
                      "primary-fixed-dim": "#ffb68e",
                      "tertiary-container": "#b35a59",
                      "error-container": "#ffdad6",
                      "secondary-fixed-dim": "#dcc2a9",
                      "on-primary-fixed": "#331200",
                      "on-background": "#1d1c18",
                      "surface-tint": "#99460a",
                      "outline-variant": "#dbc1b5",
                      "primary": "#964407",
                      "secondary-fixed": "#fadec4",
                      "secondary-container": "#f7dbc1",
                      "surface-container-high": "#ece7e1",
                      "on-tertiary-fixed-variant": "#792e2f",
                      "surface-container-low": "#f8f3ec",
                      "surface": "#fef9f2",
                      "on-secondary-fixed": "#271909",
                      "surface-container-lowest": "#ffffff",
                      "tertiary-fixed-dim": "#ffb3b0",
                      "surface-container-highest": "#e6e2db",
                      "on-tertiary-fixed": "#3f0308",
                      "on-error-container": "#93000a",
                      "on-secondary": "#ffffff",
                      "surface-variant": "#e6e2db",
                      "inverse-primary": "#ffb68e",
                      "on-secondary-fixed-variant": "#564330",
                      "primary-fixed": "#ffdbca",
                      "on-surface-variant": "#554339",
                      "on-primary": "#ffffff",
                      "on-primary-fixed-variant": "#773300",
                      "on-tertiary-container": "#fffbff",
                      "on-primary-container": "#fffbff",
                      "on-error": "#ffffff",
                      "inverse-on-surface": "#f5f0e9"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "fontFamily": {
                      "headline": ["Newsreader", "EB Garamond", "serif"],
                      "body": ["Manrope", "sans-serif"],
                      "label": ["Manrope", "sans-serif"]
              }
            },
          },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .bg-auth-gradient {
            background-color: #3d2b1f;
        }
        .gold-glow {
            background: linear-gradient(135deg, #d4a86a 0%, #964407 100%);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-auth-gradient min-h-screen flex items-center justify-center font-body relative overflow-hidden">
<!-- Intentional Asymmetry: Decorative overlapping rectangles in top-right -->
<div class="absolute -top-12 -right-12 w-64 h-80 gold-glow opacity-30 rounded-[3rem] rotate-12 blur-2xl"></div>
<div class="absolute top-20 -right-20 w-72 h-72 gold-glow opacity-20 rounded-full blur-3xl"></div>
<div class="absolute -top-10 right-10 w-48 h-96 gold-glow opacity-[0.15] rounded-[4rem] -rotate-45"></div>
<main class="relative z-10 w-full max-w-md px-8 py-12 flex flex-col items-center">
<!-- Logo: Centered and White -->
<div class="mb-12 flex items-center justify-center h-[56px]">
<span class="material-symbols-outlined text-white text-5xl" data-icon="spa">spa</span>
<span class="ml-2 text-3xl font-headline italic font-medium tracking-tight text-white">Edenify</span>
</div>
<!-- Heading & Subtext -->
<div class="text-center mb-10">
<h1 class="text-4xl md:text-5xl font-headline font-medium text-[#d4a86a] mb-3 tracking-tight">
                Welcome back.
            </h1>
<p class="text-[#a08060] font-body text-lg">
                Sign in to your Edenify account
            </p>
</div>
<!-- Form Section -->
<form class="w-full space-y-6">
<!-- Email/Telegram Input -->
<div class="space-y-2">
<div class="relative flex items-center bg-[#2a1e14] rounded-xl group transition-all duration-300">
<span class="material-symbols-outlined absolute left-4 text-[#6b5a4a] group-focus-within:text-[#d4a86a]" data-icon="alternate_email">alternate_email</span>
<input class="w-full bg-transparent border-0 border-b-2 border-[#6b5a4a] focus:border-[#d4a86a] focus:ring-0 text-[#f8f3ec] pl-12 py-4 placeholder-[#6b5a4a] transition-colors" placeholder="Email or Telegram" type="text"/>
</div>
</div>
<!-- Password Input -->
<div class="space-y-2">
<div class="relative flex items-center bg-[#2a1e14] rounded-xl group transition-all duration-300">
<span class="material-symbols-outlined absolute left-4 text-[#6b5a4a] group-focus-within:text-[#d4a86a]" data-icon="lock">lock</span>
<input class="w-full bg-transparent border-0 border-b-2 border-[#6b5a4a] focus:border-[#d4a86a] focus:ring-0 text-[#f8f3ec] pl-12 py-4 placeholder-[#6b5a4a] transition-colors" placeholder="Password" type="password"/>
<span class="material-symbols-outlined absolute right-4 text-[#6b5a4a] cursor-pointer hover:text-[#d4a86a]" data-icon="visibility">visibility</span>
</div>
</div>
<!-- Forgot Password -->
<div class="flex justify-end">
<a class="text-[#d4a86a] text-sm font-medium hover:underline tracking-wide" href="#">
                    Forgot Password?
                </a>
</div>
<!-- Primary Action -->
<button class="w-full py-4 bg-[#c2652a] hover:bg-[#d67a3d] text-white font-bold rounded-full transition-all duration-300 active:scale-95 shadow-xl shadow-[#1d1c18]/40 mt-4" type="submit">
                Log In
            </button>
</form>
<!-- Footer -->
<div class="mt-12 text-center">
<p class="text-[#a08060] font-body text-sm">
                Don't have an account? 
                <a class="text-[#d4a86a] font-bold underline ml-1 hover:text-white transition-colors" href="#">Sign Up</a>
</p>
</div>
<!-- Ambient Detail: Reflection Marker -->
<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-[#d4a86a]/20 rounded-r-full"></div>
</main>
<!-- Bottom Background texture/ambient -->
<div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#1d1c18]/20 to-transparent pointer-events-none"></div>
</body></html>

<!-- Sign Up (Updated) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "secondary": "#6f5b46",
                    "surface-container": "#f2ede6",
                    "inverse-surface": "#32302c",
                    "on-tertiary": "#ffffff",
                    "on-secondary-container": "#735f4a",
                    "tertiary": "#944242",
                    "surface-bright": "#fef9f2",
                    "surface-dim": "#ded9d3",
                    "error": "#ba1a1a",
                    "primary-container": "#b65c21",
                    "outline": "#887368",
                    "background": "#fef9f2",
                    "tertiary-fixed": "#ffdad8",
                    "on-surface": "#1d1c18",
                    "primary-fixed-dim": "#ffb68e",
                    "tertiary-container": "#b35a59",
                    "error-container": "#ffdad6",
                    "secondary-fixed-dim": "#dcc2a9",
                    "on-primary-fixed": "#331200",
                    "on-background": "#1d1c18",
                    "surface-tint": "#99460a",
                    "outline-variant": "#dbc1b5",
                    "primary": "#964407",
                    "secondary-fixed": "#fadec4",
                    "secondary-container": "#f7dbc1",
                    "surface-container-high": "#ece7e1",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "surface-container-low": "#f8f3ec",
                    "surface": "#fef9f2",
                    "on-secondary-fixed": "#271909",
                    "surface-container-lowest": "#ffffff",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "surface-container-highest": "#e6e2db",
                    "on-tertiary-fixed": "#3f0308",
                    "on-error-container": "#93000a",
                    "on-secondary": "#ffffff",
                    "surface-variant": "#e6e2db",
                    "inverse-primary": "#ffb68e",
                    "on-secondary-fixed-variant": "#564330",
                    "primary-fixed": "#ffdbca",
                    "on-surface-variant": "#554339",
                    "on-primary": "#ffffff",
                    "on-primary-fixed-variant": "#773300",
                    "on-tertiary-container": "#fffbff",
                    "on-primary-container": "#fffbff",
                    "on-error": "#ffffff",
                    "inverse-on-surface": "#f5f0e9"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader"],
                    "body": ["Manrope"],
                    "label": ["Manrope"]
            }
          },
        },
      }
    </script>
<style>
        body { font-family: 'Manrope', sans-serif; }
        .serif-text { font-family: 'Newsreader', serif; }
        .auth-bg { background-color: #3d2b1f; }
        .input-dark { background-color: #2a1e14; border: none; }
        .heading-gold { color: #d4a86a; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
<style>
    .bg-auth-gradient {
        background-color: #3d2b1f;
    }
    .gold-glow {
        background: linear-gradient(135deg, #d4a86a 0%, #964407 100%);
    }
</style></head>
<body class="bg-auth-gradient min-h-screen flex items-center justify-center font-body relative overflow-hidden"><!-- Intentional Asymmetry: Decorative overlapping rectangles in top-right -->
<div class="absolute -top-12 -right-12 w-64 h-80 gold-glow opacity-30 rounded-[3rem] rotate-12 blur-2xl"></div>
<div class="absolute top-20 -right-20 w-72 h-72 gold-glow opacity-20 rounded-full blur-3xl"></div>
<div class="absolute -top-10 right-10 w-48 h-96 gold-glow opacity-[0.15] rounded-[4rem] -rotate-45"></div>
<main class="relative z-10 w-full max-w-md px-8 py-12 flex flex-col items-center">
<!-- Logo: Centered and White -->
<div class="mb-12 flex items-center justify-center h-[56px]">
<span class="material-symbols-outlined text-white text-5xl" data-icon="spa">spa</span>
<span class="ml-2 text-3xl font-headline italic font-medium tracking-tight text-white">Edenify</span>
</div>
<!-- Heading & Subtext -->
<div class="text-center mb-10">
<h1 class="text-4xl md:text-5xl font-headline font-medium text-[#d4a86a] mb-3 tracking-tight">
            Let's Get Started.
        </h1>
<p class="text-[#a08060] font-body text-lg">
            Create an account to access all features.
        </p>
</div>
<!-- Form Section -->
<form class="w-full space-y-6">
<!-- Full Name Input -->
<div class="space-y-2">
<div class="relative flex items-center bg-[#2a1e14] rounded-xl group transition-all duration-300">
<span class="material-symbols-outlined absolute left-4 text-[#6b5a4a] group-focus-within:text-[#d4a86a]" data-icon="person">person</span>
<input class="w-full bg-transparent border-0 border-b-2 border-[#6b5a4a] focus:border-[#d4a86a] focus:ring-0 text-[#f8f3ec] pl-12 py-4 placeholder-[#6b5a4a] transition-colors" placeholder="Full Name" type="text"/>
</div>
</div>
<!-- Email Input -->
<div class="space-y-2">
<div class="relative flex items-center bg-[#2a1e14] rounded-xl group transition-all duration-300">
<span class="material-symbols-outlined absolute left-4 text-[#6b5a4a] group-focus-within:text-[#d4a86a]" data-icon="mail">mail</span>
<input class="w-full bg-transparent border-0 border-b-2 border-[#6b5a4a] focus:border-[#d4a86a] focus:ring-0 text-[#f8f3ec] pl-12 py-4 placeholder-[#6b5a4a] transition-colors" placeholder="Email Address" type="email"/>
</div>
</div>
<!-- Password Input -->
<div class="space-y-2">
<div class="relative flex items-center bg-[#2a1e14] rounded-xl group transition-all duration-300">
<span class="material-symbols-outlined absolute left-4 text-[#6b5a4a] group-focus-within:text-[#d4a86a]" data-icon="lock">lock</span>
<input class="w-full bg-transparent border-0 border-b-2 border-[#6b5a4a] focus:border-[#d4a86a] focus:ring-0 text-[#f8f3ec] pl-12 py-4 placeholder-[#6b5a4a] transition-colors" placeholder="Password" type="password"/>
<span class="material-symbols-outlined absolute right-4 text-[#6b5a4a] cursor-pointer hover:text-[#d4a86a]" data-icon="visibility">visibility</span>
</div>
</div>
<!-- Confirm Password Input -->
<div class="space-y-2">
<div class="relative flex items-center bg-[#2a1e14] rounded-xl group transition-all duration-300">
<span class="material-symbols-outlined absolute left-4 text-[#6b5a4a] group-focus-within:text-[#d4a86a]" data-icon="verified_user">verified_user</span>
<input class="w-full bg-transparent border-0 border-b-2 border-[#6b5a4a] focus:border-[#d4a86a] focus:ring-0 text-[#f8f3ec] pl-12 py-4 placeholder-[#6b5a4a] transition-colors" placeholder="Confirm Password" type="password"/>
</div>
</div>
<!-- Primary Action -->
<button class="w-full py-4 bg-[#c2652a] hover:bg-[#d67a3d] text-white font-bold rounded-full transition-all duration-300 active:scale-95 shadow-xl shadow-[#1d1c18]/40 mt-4" type="submit">
            Sign Up
        </button>
</form>
<!-- Footer -->
<div class="mt-12 text-center">
<p class="text-[#a08060] font-body text-sm">
            Already have an account? 
            <a class="text-[#d4a86a] font-bold underline ml-1 hover:text-white transition-colors" href="#">Login here.</a>
</p>
</div>
<!-- Ambient Detail: Reflection Marker -->
<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-[#d4a86a]/20 rounded-r-full"></div>
</main>
<!-- Bottom Background texture/ambient -->
<div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#1d1c18]/20 to-transparent pointer-events-none"></div></body></html>

<!-- Telegram Bot Setup -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Connect Telegram - Edenify</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-surface-variant": "#554339",
                    "primary-fixed": "#ffdbca",
                    "on-tertiary": "#ffffff",
                    "on-error": "#ffffff",
                    "primary-container": "#b65c21",
                    "surface-container-highest": "#e6e2db",
                    "surface-container-high": "#ece7e1",
                    "secondary-fixed": "#fadec4",
                    "inverse-surface": "#32302c",
                    "tertiary-fixed": "#ffdad8",
                    "tertiary-container": "#b35a59",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "surface-tint": "#99460a",
                    "inverse-primary": "#ffb68e",
                    "on-tertiary-fixed": "#3f0308",
                    "on-surface": "#1d1c18",
                    "error": "#ba1a1a",
                    "surface": "#fef9f2",
                    "on-tertiary-container": "#fffbff",
                    "error-container": "#ffdad6",
                    "primary-fixed-dim": "#ffb68e",
                    "on-primary-fixed-variant": "#773300",
                    "on-secondary-fixed": "#271909",
                    "background": "#fef9f2",
                    "outline": "#887368",
                    "on-error-container": "#93000a",
                    "primary": "#964407",
                    "on-primary": "#ffffff",
                    "on-background": "#1d1c18",
                    "surface-container-low": "#f8f3ec",
                    "surface-dim": "#ded9d3",
                    "surface-container-lowest": "#ffffff",
                    "on-primary-container": "#fffbff",
                    "inverse-on-surface": "#f5f0e9",
                    "tertiary": "#944242",
                    "secondary-fixed-dim": "#dcc2a9",
                    "secondary-container": "#f7dbc1",
                    "secondary": "#6f5b46",
                    "on-secondary": "#ffffff",
                    "on-primary-fixed": "#331200",
                    "on-secondary-container": "#735f4a",
                    "on-secondary-fixed-variant": "#564330",
                    "surface-bright": "#fef9f2",
                    "surface-variant": "#e6e2db",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "outline-variant": "#dbc1b5",
                    "surface-container": "#f2ede6"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"]
            }
          },
        },
      }
    </script>
<style>
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
      body {
        font-family: 'Manrope', sans-serif;
      }
      .serif-display {
        font-family: 'Newsreader', serif;
      }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface min-h-screen flex flex-col">
<!-- Header Navigation (Customized TopAppBar) -->
<header class="bg-[#fef9f2]/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center w-full px-6 h-16">
<button class="text-[#964407] hover:bg-[#f8f3ec] p-2 rounded-full transition-all active:scale-95 duration-150">
<span class="material-symbols-outlined">arrow_back</span>
</button>
<h1 class="serif-display italic text-2xl text-[#964407]">Connect Telegram</h1>
<div class="w-10"></div> <!-- Placeholder to balance center-aligned text -->
</header>
<main class="flex-grow max-w-2xl mx-auto px-6 py-12">
<!-- Intro Section -->
<section class="mb-12">
<h2 class="serif-display text-4xl mb-4 font-medium tracking-tight">Your AI Chaplain, <br/>on the go.</h2>
<p class="text-on-surface-variant text-lg leading-relaxed font-light">
                Bridge your digital journals with your daily life. By connecting your Telegram, you can record prayers, receive AI spiritual guidance, and update your ledger through simple messages.
            </p>
</section>
<!-- Setup Steps -->
<div class="space-y-16">
<!-- Step 01 -->
<div class="flex gap-8 group">
<div class="serif-display italic text-5xl text-primary opacity-30 select-none">01</div>
<div class="pt-2">
<h3 class="serif-display text-2xl mb-2 text-primary">Open Telegram</h3>
<p class="text-on-surface-variant mb-4">Search for <span class="font-bold">@EdenifyBot</span> in your Telegram app or use the link below to start a conversation.</p>
<button class="px-6 py-2 rounded-full bg-surface-container-low text-primary border border-outline-variant/15 font-medium hover:bg-surface-container-high transition-all active:scale-95">
                        Open Bot Link
                    </button>
</div>
</div>
<!-- Step 02 -->
<div class="flex gap-8">
<div class="serif-display italic text-5xl text-primary opacity-30 select-none">02</div>
<div class="pt-2">
<h3 class="serif-display text-2xl mb-2 text-primary">Start Conversation</h3>
<p class="text-on-surface-variant">Once the chat is open, click the <span class="font-bold">START</span> button or type <span class="bg-surface-container-high px-2 py-0.5 rounded font-mono">/start</span> to initialize your connection.</p>
</div>
</div>
<!-- Step 03 -->
<div class="flex gap-8">
<div class="serif-display italic text-5xl text-primary opacity-30 select-none">03</div>
<div class="pt-2 w-full">
<h3 class="serif-display text-2xl mb-2 text-primary">Verify Identity</h3>
<p class="text-on-surface-variant mb-6">Send this unique verification code to the bot to link your Edenify account.</p>
<!-- Link Code Display Block -->
<div class="bg-surface-container-low border border-outline-variant rounded-2xl p-8 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
<div class="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
<span class="text-xs uppercase tracking-widest text-on-surface-variant/60 font-bold mb-4">Link Code</span>
<div class="serif-display italic text-4xl md:text-5xl text-primary tracking-[0.2em] select-all font-medium">
                            EDN-942-881
                        </div>
</div>
<div class="flex flex-col sm:flex-row gap-4">
<button class="flex-1 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-bold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-xl">check_circle</span>
                            Verify Connection
                        </button>
<button class="px-8 py-4 bg-transparent border border-outline-variant/30 text-primary rounded-full font-bold hover:bg-surface-container-low active:scale-95 transition-all">
                            Copy Code
                        </button>
</div>
</div>
</div>
</div>
<!-- Available Bot Commands (Collapsed) -->
<section class="mt-20 border-t border-outline-variant/15 pt-8 mb-24">
<button class="w-full flex items-center justify-between group">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
<span class="material-symbols-outlined text-primary">terminal</span>
</div>
<span class="serif-display text-xl font-medium">Available Bot Commands</span>
</div>
<span class="material-symbols-outlined text-outline group-hover:translate-y-1 transition-transform">expand_more</span>
</button>
<!-- This would be visible on toggle, showing here in a subtle dimmed state -->
<div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="p-4 rounded-xl bg-surface-container-low/50">
<code class="text-primary font-bold">/ledger [text]</code>
<p class="text-sm text-on-surface-variant mt-1">Quick log to your daily ledger.</p>
</div>
<div class="p-4 rounded-xl bg-surface-container-low/50">
<code class="text-primary font-bold">/chaplain [query]</code>
<p class="text-sm text-on-surface-variant mt-1">Ask for spiritual guidance.</p>
</div>
</div>
</section>
</main>
<!-- Suppressed BottomNavBar/FAB as this is a transactional focus page -->
<footer class="mt-auto py-8 text-center px-6">
<p class="text-xs text-outline font-medium tracking-widest uppercase">Secured by Edenify Encryption Protocols</p>
</footer>
<!-- Image for Context (Visual Decoration) -->
<div class="fixed bottom-0 right-0 w-64 h-64 pointer-events-none opacity-10 blur-3xl bg-primary rounded-full -mr-32 -mb-32"></div>
<div class="fixed top-20 left-0 w-48 h-48 pointer-events-none opacity-5 blur-2xl bg-tertiary rounded-full -ml-24"></div>
</body></html>

<!-- Profile & Settings -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-surface-variant": "#554339",
                    "primary-fixed": "#ffdbca",
                    "on-tertiary": "#ffffff",
                    "on-error": "#ffffff",
                    "primary-container": "#b65c21",
                    "surface-container-highest": "#e6e2db",
                    "surface-container-high": "#ece7e1",
                    "secondary-fixed": "#fadec4",
                    "inverse-surface": "#32302c",
                    "tertiary-fixed": "#ffdad8",
                    "tertiary-container": "#b35a59",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "surface-tint": "#99460a",
                    "inverse-primary": "#ffb68e",
                    "on-tertiary-fixed": "#3f0308",
                    "on-surface": "#1d1c18",
                    "error": "#ba1a1a",
                    "surface": "#fef9f2",
                    "on-tertiary-container": "#fffbff",
                    "error-container": "#ffdad6",
                    "primary-fixed-dim": "#ffb68e",
                    "on-primary-fixed-variant": "#773300",
                    "on-secondary-fixed": "#271909",
                    "background": "#fef9f2",
                    "outline": "#887368",
                    "on-error-container": "#93000a",
                    "primary": "#964407",
                    "on-primary": "#ffffff",
                    "on-background": "#1d1c18",
                    "surface-container-low": "#f8f3ec",
                    "surface-dim": "#ded9d3",
                    "surface-container-lowest": "#ffffff",
                    "on-primary-container": "#fffbff",
                    "inverse-on-surface": "#f5f0e9",
                    "tertiary": "#944242",
                    "secondary-fixed-dim": "#dcc2a9",
                    "secondary-container": "#f7dbc1",
                    "secondary": "#6f5b46",
                    "on-secondary": "#ffffff",
                    "on-primary-fixed": "#331200",
                    "on-secondary-container": "#735f4a",
                    "on-secondary-fixed-variant": "#564330",
                    "surface-bright": "#fef9f2",
                    "surface-variant": "#e6e2db",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "outline-variant": "#dbc1b5",
                    "surface-container": "#f2ede6"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader"],
                    "body": ["Manrope"],
                    "label": ["Manrope"]
            }
          },
        },
      }
    </script>
<style>
        body { font-family: 'Manrope', sans-serif; }
        .font-serif { font-family: 'Newsreader', serif; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface selection:bg-primary-fixed">
<div class="min-h-screen flex flex-col bg-surface overflow-x-hidden">
<header class="sticky top-0 z-50 bg-[#fef9f2]/80 backdrop-blur-xl flex justify-between items-center w-full px-6 h-16">
<div class="flex items-center gap-4">
<button class="p-2 -ml-2 hover:bg-[#f8f3ec] rounded-full transition-colors active:scale-95 duration-150">
<span class="material-symbols-outlined text-[#964407]">arrow_back</span>
</button>
<h1 class="font-serif italic text-2xl text-[#964407]">Profile</h1>
</div>
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/20">
<img alt="User" class="w-full h-full object-cover" data-alt="Professional studio portrait of a young man with a friendly expression, soft lighting on warm background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYipcKiO1Ec06AQEyqKJJvUeNAMnZW_oGSJQM20tN1i9UUTvoYm7vRH-NJGp-j096rEtDgoaq2uFbR7SZMwZU8XTrtj4cifvmXjuUcu0lwjWTekF1-9Vb5IXWcE2zkAKP2HCtLmkUxFm_xmToD40CAE-xUhrlANZNXhoYhwBJf3PPATHwEFVIyendWgm1vJiK9iMpCgojB5twxo4Qi2Jlm71zjKSGu7DZyuutB46JBjb06k8aE_TuShCfBkuzC_SYoHlhyUnX66g"/>
</div>
</header>
<main class="flex-1 max-w-2xl mx-auto w-full px-6 pb-24">
<section class="mt-8 mb-12 relative overflow-hidden rounded-[40px] p-8 bg-gradient-to-br from-[#ffdbca] to-[#fef9f2] flex flex-col items-center text-center">
<div class="relative mb-4">
<div class="w-24 h-24 rounded-full bg-[#964407] flex items-center justify-center text-on-primary font-serif italic text-3xl shadow-xl">
                        AT
                    </div>
<div class="absolute -bottom-1 -right-1 bg-surface-container-lowest p-1 rounded-full shadow-sm">
<span class="material-symbols-outlined text-primary text-sm" style="font-variation-settings: 'FILL' 1;">verified</span>
</div>
</div>
<h2 class="font-serif italic text-3xl text-on-surface mb-1">Aiden Thorne</h2>
<p class="font-label text-on-surface-variant text-sm mb-4">aiden.thorne@edenify.app</p>
<div class="inline-flex items-center gap-2 bg-surface-container-lowest/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/40">
<span class="material-symbols-outlined text-primary text-lg" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
<span class="font-label font-bold text-xs uppercase tracking-widest text-primary">Level 4 · Champion</span>
</div>
</section>
<div class="space-y-12">
<div class="space-y-4">
<h3 class="font-serif italic text-xl px-2 text-primary">Notifications</h3>
<div class="bg-surface-container-low rounded-3xl overflow-hidden">
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">notifications_active</span>
<span class="font-label font-medium text-on-surface">Task Reminders</span>
</div>
<div class="w-12 h-6 bg-primary rounded-full relative p-1 flex items-center justify-end">
<div class="w-4 h-4 bg-white rounded-full"></div>
</div>
</div>
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">auto_stories</span>
<span class="font-label font-medium text-on-surface">Daily Scripture</span>
</div>
<div class="w-12 h-6 bg-primary rounded-full relative p-1 flex items-center justify-end">
<div class="w-4 h-4 bg-white rounded-full"></div>
</div>
</div>
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">shield_moon</span>
<span class="font-label font-medium text-on-surface">Streak Protection</span>
</div>
<div class="w-12 h-6 bg-outline-variant rounded-full relative p-1 flex items-center justify-start">
<div class="w-4 h-4 bg-white rounded-full"></div>
</div>
</div>
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">smart_toy</span>
<span class="font-label font-medium text-on-surface">Telegram Bot</span>
</div>
<span class="material-symbols-outlined text-outline-variant">chevron_right</span>
</div>
</div>
</div>
<div class="space-y-4">
<h3 class="font-serif italic text-xl px-2 text-primary">Focus</h3>
<div class="bg-surface-container-low rounded-3xl overflow-hidden">
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">timer</span>
<span class="font-label font-medium text-on-surface">Default Focus Duration</span>
</div>
<span class="font-label text-sm text-primary font-bold">25 min</span>
</div>
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">coffee</span>
<span class="font-label font-medium text-on-surface">Default Break Duration</span>
</div>
<span class="font-label text-sm text-primary font-bold">5 min</span>
</div>
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">volume_up</span>
<span class="font-label font-medium text-on-surface">Focus Sound</span>
</div>
<span class="font-label text-sm text-outline">Rain Forest</span>
</div>
</div>
</div>
<div class="space-y-4">
<h3 class="font-serif italic text-xl px-2 text-primary">Bible Plan</h3>
<div class="bg-surface-container-low rounded-3xl overflow-hidden">
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">menu_book</span>
<span class="font-label font-medium text-on-surface">Reading Plan</span>
</div>
<span class="font-label text-sm text-outline">Gospels in 30 Days</span>
</div>
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">schedule</span>
<span class="font-label font-medium text-on-surface">Daily Reading Time</span>
</div>
<span class="font-label text-sm text-outline">07:30 AM</span>
</div>
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">lightbulb</span>
<span class="font-label font-medium text-on-surface">AI Study Notes</span>
</div>
<div class="w-12 h-6 bg-primary rounded-full relative p-1 flex items-center justify-end">
<div class="w-4 h-4 bg-white rounded-full"></div>
</div>
</div>
</div>
</div>
<div class="space-y-4">
<h3 class="font-serif italic text-xl px-2 text-primary">Integrations</h3>
<div class="bg-surface-container-low rounded-3xl overflow-hidden">
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">send</span>
<span class="font-label font-medium text-on-surface">Telegram Bot Setup</span>
</div>
<span class="material-symbols-outlined text-outline-variant">chevron_right</span>
</div>
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">neurology</span>
<span class="font-label font-medium text-on-surface">Eden AI</span>
</div>
<span class="material-symbols-outlined text-outline-variant">chevron_right</span>
</div>
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">ios_share</span>
<span class="font-label font-medium text-on-surface">Export My Data</span>
</div>
<span class="material-symbols-outlined text-outline-variant">chevron_right</span>
</div>
</div>
</div>
<div class="space-y-4">
<h3 class="font-serif italic text-xl px-2 text-primary">Account</h3>
<div class="bg-surface-container-low rounded-3xl overflow-hidden">
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">person_edit</span>
<span class="font-label font-medium text-on-surface">Edit Profile</span>
</div>
<span class="material-symbols-outlined text-outline-variant">chevron_right</span>
</div>
<div class="flex items-center justify-between p-5 hover:bg-surface-container-high/50 transition-colors">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-secondary">lock</span>
<span class="font-label font-medium text-on-surface">Change Password</span>
</div>
<span class="material-symbols-outlined text-outline-variant">chevron_right</span>
</div>
<div class="flex items-center justify-between p-5 hover:bg-error-container/20 transition-colors border-t border-outline-variant/5">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-error">logout</span>
<span class="font-label font-bold text-error">Sign Out</span>
</div>
</div>
</div>
</div>
</div>
<footer class="mt-20 mb-12 text-center opacity-40">
<p class="font-serif italic text-sm">Edenify Version 2.4.1</p>
<p class="font-label text-[10px] uppercase tracking-tighter mt-1">Made for the Disciplined Soul</p>
</footer>
</main>
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-[#fef9f2]/90 backdrop-blur-md shadow-[0_-12px_32px_rgba(44,33,24,0.06)] rounded-t-[28px]">
<a class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:opacity-80 transition-all duration-200 ease-in-out scale-90" href="#">
<span class="material-symbols-outlined mb-1">auto_stories</span>
<span class="font-sans text-[10px] uppercase tracking-widest">Reflect</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:opacity-80 transition-all duration-200 ease-in-out scale-90" href="#">
<span class="material-symbols-outlined mb-1">timer</span>
<span class="font-sans text-[10px] uppercase tracking-widest">Focus</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:opacity-80 transition-all duration-200 ease-in-out scale-90" href="#">
<span class="material-symbols-outlined mb-1">import_contacts</span>
<span class="font-sans text-[10px] uppercase tracking-widest">Growth</span>
</a>
<a class="flex flex-col items-center justify-center bg-[#f8f3ec] text-[#964407] rounded-full p-3 hover:opacity-80 transition-all duration-200 ease-in-out scale-90" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">person</span>
<span class="font-sans text-[10px] uppercase tracking-widest font-bold">Profile</span>
</a>
</nav>
</div>
</body></html>

<!-- Layers Tab -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary-container": "#fffbff",
                    "tertiary-fixed": "#ffdad8",
                    "secondary": "#6f5b46",
                    "on-secondary-fixed": "#271909",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "on-background": "#1d1c18",
                    "on-surface": "#1d1c18",
                    "on-primary-fixed": "#331200",
                    "on-primary-container": "#fffbff",
                    "inverse-surface": "#32302c",
                    "on-tertiary": "#ffffff",
                    "inverse-on-surface": "#f5f0e9",
                    "background": "#fef9f2",
                    "surface-variant": "#e6e2db",
                    "tertiary-container": "#b35a59",
                    "surface-container-highest": "#e6e2db",
                    "on-primary": "#ffffff",
                    "secondary-container": "#f7dbc1",
                    "tertiary": "#944242",
                    "on-tertiary-fixed": "#3f0308",
                    "surface-container-low": "#f8f3ec",
                    "surface-dim": "#ded9d3",
                    "surface-container": "#f2ede6",
                    "secondary-fixed-dim": "#dcc2a9",
                    "on-error-container": "#93000a",
                    "surface-container-high": "#ece7e1",
                    "surface": "#fef9f2",
                    "on-error": "#ffffff",
                    "error-container": "#ffdad6",
                    "on-primary-fixed-variant": "#773300",
                    "surface-container-lowest": "#ffffff",
                    "outline-variant": "#dbc1b5",
                    "on-secondary": "#ffffff",
                    "on-secondary-fixed-variant": "#564330",
                    "surface-bright": "#fef9f2",
                    "error": "#ba1a1a",
                    "secondary-fixed": "#fadec4",
                    "primary-fixed-dim": "#ffb68e",
                    "primary-fixed": "#ffdbca",
                    "surface-tint": "#99460a",
                    "inverse-primary": "#ffb68e",
                    "primary": "#964407",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "outline": "#887368",
                    "on-surface-variant": "#554339",
                    "on-secondary-container": "#735f4a",
                    "primary-container": "#b65c21"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"],
                    "serif-alt": ["EB Garamond", "serif"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            font-family: 'Manrope', sans-serif;
            background-color: #fef9f2;
            color: #1d1c18;
        }
        .serif-heading {
            font-family: 'EB Garamond', serif;
            letter-spacing: -0.02em;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background min-h-screen pb-32">
<!-- Top AppBar -->
<header class="bg-[#fef9f2]/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full overflow-hidden">
<img alt="User Profile Avatar" class="w-full h-full object-cover" data-alt="portrait of a calm man with a short beard in soft natural light against a neutral studio background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcC3JJ6pbiJ4huGdQErp1HqdYXv5QSjjUVdzI5yxMSvCafZOcDElC70vwyd1yvnWQJIkA3SA3qV0hrcU_2aR21a_vYyL4__c5Vk5BMJnULE5kBRr0MVHbedGwSryNzECh11wQ0Gi7A4JRh44ZzxgSYBaozjBW6k6SNLpmcSxQ7sgHqQD_F8t7emA54L4Bk0Efhy-NicS6SGD4bOAOYC_NXfIGeo24tsTpoM26uqQn9erV_qKz6719c8vYXXpA-hWjbbQBp-e6tPA"/>
</div>
<span class="text-2xl font-serif italic text-[#964407] tracking-tight">Edenify</span>
</div>
<button class="material-symbols-outlined text-[#c2652a] p-2 hover:bg-[#f8f3ec] transition-colors rounded-full">notifications</button>
</header>
<!-- Main Content -->
<main class="max-w-2xl mx-auto px-6 mt-8">
<header class="mb-10">
<h1 class="serif-heading text-5xl font-medium text-on-surface mb-2">Your Layers</h1>
<p class="text-on-surface-variant font-body text-sm tracking-wide opacity-80 uppercase">The Architecture of Your Life</p>
</header>
<!-- Layer Cards Stack -->
<div class="flex flex-col gap-6">
<!-- Spiritual Layer Card -->
<div class="bg-surface-container-lowest border-[1px] border-outline-variant/15 rounded-xl overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-300">
<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#7a6550]"></div>
<div class="p-5 pl-8">
<div class="flex justify-between items-start mb-4">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[#7a6550] text-3xl">auto_awesome</span>
<div>
<h3 class="font-headline text-xl font-semibold text-on-surface">Spiritual</h3>
<p class="text-xs font-label text-[#7a6550] font-bold">Level 5</p>
</div>
</div>
<div class="text-right">
<p class="text-xs font-label text-on-surface-variant mb-1">3 habits active</p>
<p class="text-xs font-label text-on-surface-variant">2 tasks today</p>
</div>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div class="bg-[#7a6550] h-full rounded-full" style="width: 65%;"></div>
</div>
<div class="flex justify-between mt-2">
<span class="text-[10px] font-label text-outline uppercase tracking-widest">XP Progress</span>
<span class="text-[10px] font-label text-outline uppercase tracking-widest">1,240 / 2,000</span>
</div>
</div>
</div>
<!-- Academic Layer Card -->
<div class="bg-surface-container-lowest border-[1px] border-outline-variant/15 rounded-xl overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-300">
<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#4d6b4a]"></div>
<div class="p-5 pl-8">
<div class="flex justify-between items-start mb-4">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[#4d6b4a] text-3xl">menu_book</span>
<div>
<h3 class="font-headline text-xl font-semibold text-on-surface">Academic</h3>
<p class="text-xs font-label text-[#4d6b4a] font-bold">Level 8</p>
</div>
</div>
<div class="text-right">
<p class="text-xs font-label text-on-surface-variant mb-1">4 habits active</p>
<p class="text-xs font-label text-on-surface-variant">5 tasks today</p>
</div>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div class="bg-[#4d6b4a] h-full rounded-full" style="width: 82%;"></div>
</div>
<div class="flex justify-between mt-2">
<span class="text-[10px] font-label text-outline uppercase tracking-widest">XP Progress</span>
<span class="text-[10px] font-label text-outline uppercase tracking-widest">4,100 / 5,000</span>
</div>
</div>
</div>
<!-- Financial Layer Card -->
<div class="bg-surface-container-lowest border-[1px] border-outline-variant/15 rounded-xl overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-300">
<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#4a5d6b]"></div>
<div class="p-5 pl-8">
<div class="flex justify-between items-start mb-4">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[#4a5d6b] text-3xl">account_balance</span>
<div>
<h3 class="font-headline text-xl font-semibold text-on-surface">Financial</h3>
<p class="text-xs font-label text-[#4a5d6b] font-bold">Level 3</p>
</div>
</div>
<div class="text-right">
<p class="text-xs font-label text-on-surface-variant mb-1">2 habits active</p>
<p class="text-xs font-label text-on-surface-variant">1 tasks today</p>
</div>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div class="bg-[#4a5d6b] h-full rounded-full" style="width: 25%;"></div>
</div>
<div class="flex justify-between mt-2">
<span class="text-[10px] font-label text-outline uppercase tracking-widest">XP Progress</span>
<span class="text-[10px] font-label text-outline uppercase tracking-widest">350 / 1,500</span>
</div>
</div>
</div>
<!-- Physical Layer Card -->
<div class="bg-surface-container-lowest border-[1px] border-outline-variant/15 rounded-xl overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-300">
<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#8c3c3c]"></div>
<div class="p-5 pl-8">
<div class="flex justify-between items-start mb-4">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[#8c3c3c] text-3xl">exercise</span>
<div>
<h3 class="font-headline text-xl font-semibold text-on-surface">Physical</h3>
<p class="text-xs font-label text-[#8c3c3c] font-bold">Level 6</p>
</div>
</div>
<div class="text-right">
<p class="text-xs font-label text-on-surface-variant mb-1">5 habits active</p>
<p class="text-xs font-label text-on-surface-variant">3 tasks today</p>
</div>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div class="bg-[#8c3c3c] h-full rounded-full" style="width: 50%;"></div>
</div>
<div class="flex justify-between mt-2">
<span class="text-[10px] font-label text-outline uppercase tracking-widest">XP Progress</span>
<span class="text-[10px] font-label text-outline uppercase tracking-widest">1,500 / 3,000</span>
</div>
</div>
</div>
<!-- General Layer Card -->
<div class="bg-surface-container-lowest border-[1px] border-outline-variant/15 rounded-xl overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-300">
<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#5c4a6b]"></div>
<div class="p-5 pl-8">
<div class="flex justify-between items-start mb-4">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[#5c4a6b] text-3xl">dashboard</span>
<div>
<h3 class="font-headline text-xl font-semibold text-on-surface">General</h3>
<p class="text-xs font-label text-[#5c4a6b] font-bold">Level 4</p>
</div>
</div>
<div class="text-right">
<p class="text-xs font-label text-on-surface-variant mb-1">1 habits active</p>
<p class="text-xs font-label text-on-surface-variant">0 tasks today</p>
</div>
</div>
<div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
<div class="bg-[#5c4a6b] h-full rounded-full" style="width: 90%;"></div>
</div>
<div class="flex justify-between mt-2">
<span class="text-[10px] font-label text-outline uppercase tracking-widest">XP Progress</span>
<span class="text-[10px] font-label text-outline uppercase tracking-widest">1,800 / 2,000</span>
</div>
</div>
</div>
</div>
</main>
<!-- Floating Action Button -->
<button class="fixed bottom-28 right-6 w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full shadow-[0_12px_32px_rgba(44,33,24,0.15)] flex items-center justify-center active:scale-95 transition-transform z-40">
<span class="material-symbols-outlined text-3xl">add</span>
</button>
<!-- Bottom Navigation Bar -->
<nav class="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#fef9f2]/90 backdrop-blur-lg rounded-t-[28px] shadow-[0_-12px_32px_rgba(44,33,24,0.06)]">
<a class="flex flex-col items-center justify-center text-[#7a6550] px-4 py-1.5 hover:text-[#964407] transition-all" href="#">
<span class="material-symbols-outlined mb-0.5">home</span>
<span class="text-[11px] font-sans font-medium Manrope tracking-wide">Home</span>
</a>
<a class="flex flex-col items-center justify-center bg-[#f8f3ec] text-[#964407] rounded-2xl px-4 py-1.5 tactile scale-95 duration-200 transition-all" href="#">
<span class="material-symbols-outlined mb-0.5" data-weight="fill" style="font-variation-settings: 'FILL' 1;">layers</span>
<span class="text-[11px] font-sans font-medium Manrope tracking-wide">Layers</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] px-4 py-1.5 hover:text-[#964407] transition-all" href="#">
<span class="material-symbols-outlined mb-0.5">park</span>
<span class="text-[11px] font-sans font-medium Manrope tracking-wide">Eden</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] px-4 py-1.5 hover:text-[#964407] transition-all" href="#">
<span class="material-symbols-outlined mb-0.5">person</span>
<span class="text-[11px] font-sans font-medium Manrope tracking-wide">Profile</span>
</a>
</nav>
</body></html>

<!-- Spiritual Layer Detail -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,700;1,400;1,700&amp;family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-tertiary-container": "#fffbff",
                        "tertiary-fixed": "#ffdad8",
                        "secondary": "#6f5b46",
                        "on-secondary-fixed": "#271909",
                        "on-tertiary-fixed-variant": "#792e2f",
                        "on-background": "#1d1c18",
                        "on-surface": "#1d1c18",
                        "on-primary-fixed": "#331200",
                        "on-primary-container": "#fffbff",
                        "inverse-surface": "#32302c",
                        "on-tertiary": "#ffffff",
                        "inverse-on-surface": "#f5f0e9",
                        "background": "#fef9f2",
                        "surface-variant": "#e6e2db",
                        "tertiary-container": "#b35a59",
                        "surface-container-highest": "#e6e2db",
                        "on-primary": "#ffffff",
                        "secondary-container": "#f7dbc1",
                        "tertiary": "#944242",
                        "on-tertiary-fixed": "#3f0308",
                        "surface-container-low": "#f8f3ec",
                        "surface-dim": "#ded9d3",
                        "surface-container": "#f2ede6",
                        "secondary-fixed-dim": "#dcc2a9",
                        "on-error-container": "#93000a",
                        "surface-container-high": "#ece7e1",
                        "surface": "#fef9f2",
                        "on-error": "#ffffff",
                        "error-container": "#ffdad6",
                        "on-primary-fixed-variant": "#773300",
                        "surface-container-lowest": "#ffffff",
                        "outline-variant": "#dbc1b5",
                        "on-secondary": "#ffffff",
                        "on-secondary-fixed-variant": "#564330",
                        "surface-bright": "#fef9f2",
                        "error": "#ba1a1a",
                        "secondary-fixed": "#fadec4",
                        "primary-fixed-dim": "#ffb68e",
                        "primary-fixed": "#ffdbca",
                        "surface-tint": "#99460a",
                        "inverse-primary": "#ffb68e",
                        "primary": "#964407",
                        "tertiary-fixed-dim": "#ffb3b0",
                        "outline": "#887368",
                        "on-surface-variant": "#554339",
                        "on-secondary-container": "#735f4a",
                        "primary-container": "#b65c21"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Newsreader", "serif"],
                        "body": ["Manrope", "sans-serif"],
                        "label": ["Manrope", "sans-serif"]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .spiritual-accent { color: #7a6550; }
        .spiritual-bg { background-color: #7a6550; }
        .reflection-marker {
            width: 3px;
            height: 100%;
            background-color: #7a6550;
            border-radius: 4px;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background text-on-background font-body min-h-screen pb-32">
<!-- TopAppBar -->
<header class="sticky top-0 z-50 bg-[#fef9f2]/80 dark:bg-[#1d1c18]/80 backdrop-blur-md flex justify-between items-center w-full px-6 py-4">
<button class="hover:bg-[#f8f3ec] p-2 rounded-full transition-colors active:scale-95 duration-300">
<span class="material-symbols-outlined text-[#7a6550]">arrow_back</span>
</button>
<h1 class="text-2xl font-serif italic text-[#964407] tracking-tight">Spiritual</h1>
<div class="w-10"></div> <!-- Spacer for centering -->
</header>
<main class="px-6 max-w-2xl mx-auto space-y-10 mt-8">
<!-- Header Section -->
<section class="flex flex-col items-center text-center space-y-4">
<div class="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center border-2 border-outline-variant/15">
<span class="material-symbols-outlined text-6xl text-[#7a6550]" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
</div>
<div>
<h2 class="text-4xl font-headline font-bold italic tracking-tight text-on-background">Spiritual</h2>
<p class="text-sm font-label uppercase tracking-widest text-outline mt-1">Level 5</p>
</div>
<div class="w-full max-w-xs space-y-2">
<div class="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
<div class="h-full spiritual-bg w-3/4 rounded-full"></div>
</div>
<p class="text-xs font-medium text-outline">1,250 / 2,000 XP</p>
</div>
</section>
<!-- Eden Insight Card -->
<section>
<div class="bg-surface-container-lowest p-6 rounded-[28px] relative overflow-hidden group">
<div class="absolute top-0 left-0 reflection-marker"></div>
<div class="flex items-start gap-4">
<div class="bg-[#f8f3ec] p-3 rounded-2xl">
<span class="material-symbols-outlined text-[#7a6550]">lightbulb</span>
</div>
<div>
<h3 class="font-headline text-xl italic font-bold text-primary mb-1">Eden Insight</h3>
<p class="text-on-surface-variant leading-relaxed">Early morning silence creates a vessel for clarity. Your spiritual growth is currently flourishing in moments of solitude.</p>
</div>
</div>
</div>
</section>
<!-- Habits Section -->
<section class="space-y-6">
<div class="flex justify-between items-end px-2">
<h3 class="font-headline text-2xl italic font-bold">HABITS</h3>
<button class="text-sm font-label font-bold text-primary hover:underline decoration-2 underline-offset-4">+ Add Habit</button>
</div>
<div class="grid grid-cols-1 gap-4">
<!-- Habit Card 1 -->
<div class="bg-surface-container-low p-5 rounded-[24px] space-y-4">
<div class="flex justify-between items-center">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[#7a6550] bg-white p-2 rounded-xl">auto_stories</span>
<div>
<p class="font-bold text-lg">Scripture Reading</p>
<p class="text-xs text-outline font-medium">Daily • 15 mins</p>
</div>
</div>
<span class="text-xs font-bold px-3 py-1 bg-white rounded-full text-[#7a6550]">85% Streak</span>
</div>
<div class="flex justify-between gap-1">
<!-- 14 day tracking dots -->
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-outline-variant/30 rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-outline-variant/30 rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
</div>
</div>
<!-- Habit Card 2 -->
<div class="bg-surface-container-low p-5 rounded-[24px] space-y-4">
<div class="flex justify-between items-center">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[#7a6550] bg-white p-2 rounded-xl">self_improvement</span>
<div>
<p class="font-bold text-lg">Morning Prayer</p>
<p class="text-xs text-outline font-medium">Daily • 10 mins</p>
</div>
</div>
<span class="text-xs font-bold px-3 py-1 bg-white rounded-full text-[#7a6550]">100% Streak</span>
</div>
<div class="flex justify-between gap-1">
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
<div class="flex-1 h-1.5 bg-[#7a6550] rounded-full"></div>
</div>
</div>
</div>
</section>
<!-- Tasks Section -->
<section class="space-y-6">
<div class="flex justify-between items-end px-2">
<h3 class="font-headline text-2xl italic font-bold">TASKS</h3>
<button class="text-sm font-label font-bold text-primary hover:underline decoration-2 underline-offset-4">+ Add Task</button>
</div>
<div class="space-y-3">
<div class="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-2xl group transition-all hover:bg-surface-container-high">
<button class="w-6 h-6 rounded-full border-2 border-[#7a6550] flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[16px] text-white">check</span>
</button>
<div class="flex-1">
<p class="font-semibold text-on-surface">Weekly Community Service</p>
<p class="text-xs text-outline font-medium">Today • 2:00 PM</p>
</div>
</div>
<div class="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-2xl group transition-all hover:bg-surface-container-high">
<button class="w-6 h-6 rounded-full border-2 border-outline-variant shrink-0 flex items-center justify-center"></button>
<div class="flex-1">
<p class="font-semibold text-on-surface">Journal Entry: Gratitude</p>
<p class="text-xs text-outline font-medium">Today • 8:00 PM</p>
</div>
</div>
</div>
</section>
</main>
<!-- FAB -->
<button class="fixed bottom-10 right-8 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center shadow-[0_12_32px_rgba(44,33,24,0.15)] active:scale-95 transition-all z-40">
<span class="material-symbols-outlined text-2xl">add</span>
</button>
</body></html>

<!-- Quick Add Task -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400;1,600&amp;family=Manrope:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-tertiary-container": "#fffbff",
                        "tertiary-fixed": "#ffdad8",
                        "secondary": "#6f5b46",
                        "on-secondary-fixed": "#271909",
                        "on-tertiary-fixed-variant": "#792e2f",
                        "on-background": "#1d1c18",
                        "on-surface": "#1d1c18",
                        "on-primary-fixed": "#331200",
                        "on-primary-container": "#fffbff",
                        "inverse-surface": "#32302c",
                        "on-tertiary": "#ffffff",
                        "inverse-on-surface": "#f5f0e9",
                        "background": "#fef9f2",
                        "surface-variant": "#e6e2db",
                        "tertiary-container": "#b35a59",
                        "surface-container-highest": "#e6e2db",
                        "on-primary": "#ffffff",
                        "secondary-container": "#f7dbc1",
                        "tertiary": "#944242",
                        "on-tertiary-fixed": "#3f0308",
                        "surface-container-low": "#f8f3ec",
                        "surface-dim": "#ded9d3",
                        "surface-container": "#f2ede6",
                        "secondary-fixed-dim": "#dcc2a9",
                        "on-error-container": "#93000a",
                        "surface-container-high": "#ece7e1",
                        "surface": "#fef9f2",
                        "on-error": "#ffffff",
                        "error-container": "#ffdad6",
                        "on-primary-fixed-variant": "#773300",
                        "surface-container-lowest": "#ffffff",
                        "outline-variant": "#dbc1b5",
                        "on-secondary": "#ffffff",
                        "on-secondary-fixed-variant": "#564330",
                        "surface-bright": "#fef9f2",
                        "error": "#ba1a1a",
                        "secondary-fixed": "#fadec4",
                        "primary-fixed-dim": "#ffb68e",
                        "primary-fixed": "#ffdbca",
                        "surface-tint": "#99460a",
                        "inverse-primary": "#ffb68e",
                        "primary": "#964407",
                        "tertiary-fixed-dim": "#ffb3b0",
                        "outline": "#887368",
                        "on-surface-variant": "#554339",
                        "on-secondary-container": "#735f4a",
                        "primary-container": "#b65c21"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "28px",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Newsreader", "serif"],
                        "body": ["Manrope", "sans-serif"],
                        "label": ["Manrope", "sans-serif"]
                    }
                },
            },
        }
    </script>
<style>.material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24
    }
.bg-primary-gradient {
    background: linear-gradient(45deg, #964407 0%, #b65c21 100%)
    }
.linen-texture {
    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuCqex8kbcqnJxuID6AiOgS1EOVMTC0X3nyzAZ9Q5F3V_j8ACCRFP4xMnkIS1QPj6TTZSBkvdrsJg7bAg7h_t9AuH7tL5x-mREoaTQ8YTFufx6BtGNEFl6XT1Ld8_o-AbkCSmguiZTQtn8Zl32G5sZ_NefNjMueuWOGHMclqtwvUDa92X-_Xl5L2n6IfSYw8JfNGKomUVLUj8IQ_gzAJLDCEJEyqJnztjYMVAvElv4pDWkLzh1Zmpk2NOMot6ieBP-qfhR4E62OSXQ)
    }</style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background text-on-background font-body antialiased overflow-hidden">
<!-- Backgroun Context: Home Screen (Dimmed) -->
<div class="relative w-full h-screen overflow-hidden flex flex-col bg-surface-dim">
<!-- TopAppBar (Shared Component) -->
<header class="bg-[#fef9f2]/80 dark:bg-[#1d1c18]/80 backdrop-blur-md sticky top-0 z-40 flex justify-between items-center w-full px-6 py-4">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Close-up portrait of a calm person with warm studio lighting and neutral background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDwwJAJxDqaDrNSiGZ0-u4gwkdBAX6BRIutUxqdZKx2i4Ouq7trc8dZsIRa7j0mnAOq06LLbxa9MkVWpSwWFVL3yXf61ReG3gWsilrEOxgpDI4MhrAhop6tW9KIK5cQ3BEmNMne1fEUBqKpt1VE0DkwDcz1E7PbIj-9mUwwyMJ7PogbDCB7pP1rkps05BVadmyCgFDY7ukoEEWQ7rNNWCPOY29DLiQ08rrFXKNKzwSpoTcRXz4aBFuhH1EoEkeptvmlSL1TucGdw"/>
</div>
<h1 class="text-2xl font-serif italic text-[#964407] dark:text-[#e4a87c] tracking-tight">Edenify</h1>
</div>
<button class="text-[#7a6550] dark:text-[#a69282] hover:bg-[#f8f3ec] dark:hover:bg-[#32302c] p-2 rounded-full transition-colors">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
</header>
<!-- Mock Home Content -->
<main class="flex-1 px-6 pt-8 space-y-8 opacity-40 grayscale-[0.2]">
<section>
<h2 class="font-headline italic text-3xl mb-2 text-primary">Good Morning, Silas.</h2>
<p class="text-on-surface-variant font-body">The ledger awaits your intentions.</p>
</section>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<!-- Bento Card 1 -->
<div class="bg-surface-container-low rounded-2xl p-6 h-48 flex flex-col justify-between">
<div class="flex justify-between items-start">
<span class="font-headline italic text-xl">Daily Verse</span>
<span class="material-symbols-outlined text-[#7a6550]" data-icon="auto_stories">auto_stories</span>
</div>
<p class="italic text-on-surface-variant line-clamp-3">"The soul of the diligent is richly supplied."</p>
</div>
<!-- Bento Card 2 -->
<div class="bg-surface-container-low rounded-2xl p-6 h-48 flex flex-col justify-between border-l-4 border-[#4d6b4a]">
<div class="flex justify-between items-start">
<span class="font-headline italic text-xl">Academic Progress</span>
<span class="material-symbols-outlined text-[#4d6b4a]" data-icon="school">school</span>
</div>
<div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-[#4d6b4a] w-3/4"></div>
</div>
</div>
</div>
</main>
<!-- BottomNavBar (Shared Component) - Hidden by overlay logic but visually present -->
<nav class="fixed bottom-0 w-full z-10 flex justify-around items-center px-4 pb-6 pt-2 bg-[#fef9f2]/90 dark:bg-[#1d1c18]/90 backdrop-blur-lg shadow-[0_-12px_32px_rgba(44,33,24,0.06)] rounded-t-[28px] opacity-20 pointer-events-none">
<div class="flex flex-col items-center justify-center bg-[#f8f3ec] dark:bg-[#32302c] text-[#964407] dark:text-[#e4a87c] rounded-2xl px-4 py-1.5">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="text-[11px] font-sans font-medium Manrope tracking-wide">Home</span>
</div>
<div class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#a69282] px-4 py-1.5">
<span class="material-symbols-outlined" data-icon="layers">layers</span>
<span class="text-[11px] font-sans font-medium Manrope tracking-wide">Layers</span>
</div>
<div class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#a69282] px-4 py-1.5">
<span class="material-symbols-outlined" data-icon="park">park</span>
<span class="text-[11px] font-sans font-medium Manrope tracking-wide">Eden</span>
</div>
<div class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#a69282] px-4 py-1.5">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="text-[11px] font-sans font-medium Manrope tracking-wide">Profile</span>
</div>
</nav>
<!-- Bottom Sheet Overlay -->
<div class="absolute inset-0 bg-inverse-surface/40 backdrop-blur-[2px] z-50 flex items-end">
<!-- The Sheet -->
<div class="w-full bg-surface-container-lowest rounded-t-2xl shadow-[0_-12px_48px_rgba(44,33,24,0.15)] relative overflow-hidden flex flex-col max-h-[795px]">
<!-- Subtle Linen Texture Overlay -->
<div class="absolute inset-0 opacity-10 pointer-events-none linen-texture"></div>
<!-- Handle -->
<div class="w-full flex justify-center py-4 relative z-10">
<div class="w-12 h-1 bg-outline-variant opacity-30 rounded-full"></div>
</div>
<!-- Content Wrapper -->
<div class="px-8 pb-10 space-y-8 relative z-10 overflow-y-auto">
<!-- Header -->
<div class="flex items-center justify-between">
<h2 class="font-headline italic text-3xl text-primary tracking-tight">New Task</h2>
<button class="text-outline hover:text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="close">close</span>
</button>
</div>
<!-- Task Input Section -->
<div class="space-y-6">
<!-- Task Name -->
<div class="relative group">
<input class="w-full bg-transparent border-0 border-b-2 border-outline-variant py-3 text-xl font-headline italic focus:ring-0 focus:border-primary transition-colors placeholder:text-outline-variant" placeholder="What is the intention?" type="text"/>
<div class="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
</div>
<!-- Time Input -->
<div class="flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-xl">
<span class="material-symbols-outlined text-outline" data-icon="schedule">schedule</span>
<input class="bg-transparent border-none p-0 text-sm font-medium focus:ring-0 text-on-surface" type="text" value="08:00 AM"/>
</div>
</div>
<!-- Priority Selector -->
<section class="space-y-3">
<label class="text-[10px] font-bold tracking-[0.2em] text-outline uppercase font-label">Priority</label>
<div class="flex justify-between items-center bg-surface-container-low p-1.5 rounded-full">
<button class="w-10 h-10 flex items-center justify-center rounded-full bg-primary-gradient text-on-primary font-bold transition-all scale-105 shadow-md">A</button>
<button class="w-10 h-10 flex items-center justify-center rounded-full text-outline font-bold hover:bg-surface-container-high transition-colors">B</button>
<button class="w-10 h-10 flex items-center justify-center rounded-full text-outline font-bold hover:bg-surface-container-high transition-colors">C</button>
<button class="w-10 h-10 flex items-center justify-center rounded-full text-outline font-bold hover:bg-surface-container-high transition-colors">D</button>
<button class="w-10 h-10 flex items-center justify-center rounded-full text-outline font-bold hover:bg-surface-container-high transition-colors">E</button>
</div>
</section>
<!-- Layer Selector -->
<section class="space-y-3">
<label class="text-[10px] font-bold tracking-[0.2em] text-outline uppercase font-label">Layer</label>
<div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
<button class="flex-shrink-0 px-4 py-2 rounded-full border border-[#7a6550]/20 bg-[#7a6550]/5 text-[#7a6550] text-xs font-medium hover:bg-[#7a6550]/10 transition-colors">Spiritual</button>
<button class="flex-shrink-0 px-4 py-2 rounded-full border border-[#4d6b4a]/20 bg-[#4d6b4a]/5 text-[#4d6b4a] text-xs font-medium hover:bg-[#4d6b4a]/10 transition-colors">Academic</button>
<button class="flex-shrink-0 px-4 py-2 rounded-full border border-[#4a5d6b]/20 bg-[#4a5d6b]/5 text-[#4a5d6b] text-xs font-medium hover:bg-[#4a5d6b]/10 transition-colors">Financial</button>
<button class="flex-shrink-0 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">Physical</button>
<button class="flex-shrink-0 px-4 py-2 rounded-full border border-[#5c4a6b]/20 bg-[#5c4a6b]/5 text-[#5c4a6b] text-xs font-medium hover:bg-[#5c4a6b]/10 transition-colors">General</button>
</div>
</section>
<!-- Type Toggle -->
<section class="space-y-3">
<label class="text-[10px] font-bold tracking-[0.2em] text-outline uppercase font-label">Type</label>
<div class="inline-flex p-1 bg-surface-container-low rounded-full">
<button class="px-6 py-1.5 rounded-full bg-surface-container-lowest shadow-sm text-xs font-bold text-primary">Once</button>
<button class="px-6 py-1.5 rounded-full text-xs font-medium text-outline hover:text-on-surface transition-colors">Daily</button>
</div>
</section>
<!-- Action Button -->
<div class="pt-4">
<button class="w-full py-4 bg-primary-gradient text-on-primary font-bold rounded-full shadow-lg hover:shadow-xl transition-all active:scale-[0.98] duration-300 flex items-center justify-center gap-2">
<span>Save Task</span>
<span class="material-symbols-outlined text-lg" data-icon="ink_pen">ink_pen</span>
</button>
</div>
</div>
</div>
</div>
</div>
<!-- Map/Background Placeholder Data -->
<div class="hidden">
<img data-alt="Stylized minimalist map showing a serene oasis with dunes in a painterly sahara warm color palette" data-location="Sahara Desert Oasis" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUKreq-hIZKi8mF7RaLKrciwcVbsaVSMqGOudZHd2cauJn_3CGgumflMUMN8XY8Vztc8ncQJxyMiYLF51eBjMWj4aq69nN39IHlZUkjmZEYCdmimxDQX0yGrZF72ejpqxq5qnuSJAqpVUS0IvH95nTcbweXpgeTwSw4l6PBjeI7LaKs73NZ-gnZ7SsnVlGNrpDEg94iH-La2xUR93OWkWPoE-CmmCOSIn85lH_fBr8BwMcGJp_cAft6R9J_NmrmjfVQqsxoNdYVw"/>
</div>
</body></html>

<!-- Focus Mode (Idle) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Edenify - Focus Mode</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface-container-lowest": "#ffffff",
                    "primary-fixed-dim": "#ffb68e",
                    "primary": "#964407",
                    "surface-container-high": "#ece7e1",
                    "on-primary-fixed-variant": "#773300",
                    "surface-tint": "#99460a",
                    "on-secondary": "#ffffff",
                    "tertiary": "#944242",
                    "on-surface-variant": "#554339",
                    "surface-variant": "#e6e2db",
                    "on-primary-fixed": "#331200",
                    "on-tertiary-fixed": "#3f0308",
                    "surface-container-low": "#f8f3ec",
                    "surface-dim": "#ded9d3",
                    "on-primary-container": "#fffbff",
                    "on-tertiary-container": "#fffbff",
                    "on-surface": "#1d1c18",
                    "inverse-primary": "#ffb68e",
                    "surface-container-highest": "#e6e2db",
                    "on-secondary-fixed": "#271909",
                    "error-container": "#ffdad6",
                    "on-secondary-container": "#735f4a",
                    "primary-fixed": "#ffdbca",
                    "error": "#ba1a1a",
                    "outline": "#887368",
                    "on-primary": "#ffffff",
                    "background": "#fef9f2",
                    "surface-container": "#f2ede6",
                    "secondary-fixed-dim": "#dcc2a9",
                    "secondary-container": "#f7dbc1",
                    "on-error-container": "#93000a",
                    "secondary": "#6f5b46",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "on-secondary-fixed-variant": "#564330",
                    "primary-container": "#b65c21",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "inverse-surface": "#32302c",
                    "inverse-on-surface": "#f5f0e9",
                    "secondary-fixed": "#fadec4",
                    "tertiary-fixed": "#ffdad8",
                    "tertiary-container": "#b35a59",
                    "surface-bright": "#fef9f2",
                    "outline-variant": "#dbc1b5",
                    "on-error": "#ffffff",
                    "on-background": "#1d1c18",
                    "surface": "#fef9f2",
                    "on-tertiary": "#ffffff"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader"],
                    "body": ["Manrope"],
                    "label": ["Manrope"]
            }
          },
        },
      }
    </script>
<style>
        body { font-family: 'Manrope', sans-serif; background-color: #fef9f2; color: #1d1c18; }
        .font-serif { font-family: 'Newsreader', serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .ring-gradient { background: conic-gradient(from 0deg, #964407 0%, transparent 0%); }
        .tap-highlight-none { -webkit-tap-highlight-color: transparent; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface min-h-screen flex flex-col items-center">
<!-- Top Navigation Bar -->
<header class="fixed top-0 w-full z-50 bg-[#fef9f2]/80 backdrop-blur-md flex justify-between items-center px-6 h-16 w-full">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-[#964407] hover:opacity-80 transition-opacity cursor-pointer">menu</span>
</div>
<h1 class="text-2xl font-serif italic text-[#964407] tracking-tight">Edenify</h1>
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30">
<img alt="User Profile" class="w-full h-full object-cover" data-alt="Close up portrait of a calm person with warm studio lighting and minimalist aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZavXIe--dBEoN7-RpjQVDWFPMQQ54eu6oVy5VoOwHnQz2ee2ZQujppQiSNKz4dHXLJCQQkYwakFSHH6ctPUfWEQLg5WDyh_g9P6VGpENNftkh82XU8iOpqhDyMOVPNV-2vzmvUZ-AAnY-hAXTnpd5iEK0qV7Kv5X2YAUP5Y3_mnAsb8ctv3fCS_Yy6y0fRNohv6H6RObGdK8KEfHSI2cTRWWThmON5Ggf2-W-3undMTmS9xVJaZkoQvUsW9lkADFbK1vwuKpnqA"/>
</div>
</header>
<!-- Main Content Canvas -->
<main class="w-full max-w-4xl px-6 pt-24 pb-32 flex flex-col items-center">
<!-- Header Section: Asymmetric & Editorial -->
<section class="w-full mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
<div class="max-w-lg">
<h2 class="text-5xl md:text-6xl font-serif font-light text-on-surface tracking-tight leading-none mb-4">Focus</h2>
<p class="text-sm font-body text-secondary max-w-xs leading-relaxed">Eliminate distraction. Build with purpose.</p>
</div>
<!-- Mode Selector -->
<div class="flex p-1 bg-surface-container-low rounded-full self-start md:self-auto border border-outline-variant/10">
<button class="px-6 py-2 rounded-full bg-gradient-to-br from-[#964407] to-[#b65c21] text-white text-xs font-label font-bold uppercase tracking-widest shadow-sm">Focus</button>
<button class="px-6 py-2 rounded-full text-secondary text-xs font-label font-bold uppercase tracking-widest hover:text-primary transition-colors">Short Break</button>
<button class="px-6 py-2 rounded-full text-secondary text-xs font-label font-bold uppercase tracking-widest hover:text-primary transition-colors">Long Break</button>
</div>
</section>
<!-- Pomodoro Ring Section -->
<section class="relative w-full flex flex-col items-center justify-center mb-16 py-12">
<div class="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] flex items-center justify-center">
<!-- Decorative Outer Tonal Shift -->
<div class="absolute inset-0 rounded-full border-[12px] border-surface-container-low"></div>
<!-- Main Progress Ring (Idle State: Sienna at 0) -->
<svg class="absolute inset-0 w-full h-full -rotate-90 transform">
<circle class="transition-all duration-1000" cx="50%" cy="50%" fill="transparent" r="48%" stroke="#964407" stroke-dasharray="0 1000" stroke-width="4"></circle>
</svg>
<!-- Center Content -->
<div class="z-10 flex flex-col items-center text-center">
<span class="text-[52px] md:text-[64px] font-serif font-light text-on-surface tabular-nums">25:00</span>
<span class="text-[11px] font-label font-bold uppercase tracking-[0.2em] text-secondary opacity-70">FOCUS TIME</span>
</div>
</div>
<!-- Controls -->
<div class="flex items-center gap-10 mt-12">
<button class="w-12 h-12 flex items-center justify-center rounded-full text-secondary hover:text-primary transition-colors hover:bg-surface-container-low active:scale-90 duration-300">
<span class="material-symbols-outlined text-3xl">skip_previous</span>
</button>
<button class="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-[#964407] to-[#b65c21] text-white shadow-[0_12px_32px_rgba(150,68,7,0.15)] active:scale-90 duration-300">
<span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
</button>
<button class="w-12 h-12 flex items-center justify-center rounded-full text-secondary hover:text-primary transition-colors hover:bg-surface-container-low active:scale-90 duration-300">
<span class="material-symbols-outlined text-3xl">skip_next</span>
</button>
</div>
</section>
<!-- Timer Settings Card -->
<section class="w-full max-w-md mx-auto">
<div class="bg-surface-container-low rounded-[28px] p-8 border border-outline-variant/10">
<div class="flex items-center gap-2 mb-8">
<span class="w-1.5 h-6 bg-primary rounded-full"></span>
<h3 class="text-[11px] font-label font-bold uppercase tracking-[0.2em] text-secondary">Timer Settings</h3>
</div>
<div class="space-y-6">
<!-- Setting Row: Focus -->
<div class="flex items-center justify-between">
<div>
<p class="text-sm font-serif italic text-on-surface">Focus Duration</p>
<p class="text-[10px] font-label text-secondary uppercase tracking-widest">Minutes</p>
</div>
<div class="flex items-center gap-4 bg-surface-container px-3 py-2 rounded-xl">
<button class="text-secondary hover:text-primary"><span class="material-symbols-outlined text-lg">remove</span></button>
<span class="text-on-surface font-label font-medium w-8 text-center">25</span>
<button class="text-secondary hover:text-primary"><span class="material-symbols-outlined text-lg">add</span></button>
</div>
</div>
<!-- Setting Row: Short Break -->
<div class="flex items-center justify-between">
<div>
<p class="text-sm font-serif italic text-on-surface">Short Break</p>
<p class="text-[10px] font-label text-secondary uppercase tracking-widest">Minutes</p>
</div>
<div class="flex items-center gap-4 bg-surface-container px-3 py-2 rounded-xl">
<button class="text-secondary hover:text-primary"><span class="material-symbols-outlined text-lg">remove</span></button>
<span class="text-on-surface font-label font-medium w-8 text-center">5</span>
<button class="text-secondary hover:text-primary"><span class="material-symbols-outlined text-lg">add</span></button>
</div>
</div>
<!-- Setting Row: Long Break -->
<div class="flex items-center justify-between">
<div>
<p class="text-sm font-serif italic text-on-surface">Long Break</p>
<p class="text-[10px] font-label text-secondary uppercase tracking-widest">Minutes</p>
</div>
<div class="flex items-center gap-4 bg-surface-container px-3 py-2 rounded-xl">
<button class="text-secondary hover:text-primary"><span class="material-symbols-outlined text-lg">remove</span></button>
<span class="text-on-surface font-label font-medium w-8 text-center">15</span>
<button class="text-secondary hover:text-primary"><span class="material-symbols-outlined text-lg">add</span></button>
</div>
</div>
</div>
<div class="mt-8 pt-8 border-t border-outline-variant/15 flex items-center justify-between">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary">notifications_active</span>
<span class="text-xs font-label text-secondary">Audio cues enabled</span>
</div>
<button class="text-primary text-xs font-label font-bold uppercase tracking-widest">Edit All</button>
</div>
</div>
</section>
</main>
<!-- Bottom Navigation Bar -->
<nav class="fixed bottom-0 left-0 w-full z-50 bg-[#fef9f2]/90 backdrop-blur-lg flex justify-around items-center px-4 pb-8 pt-4 rounded-t-[28px] shadow-[0_-12px_32px_rgba(44,33,24,0.04)]">
<a class="flex flex-col items-center justify-center text-[#7a6550] p-3 tap-highlight-none active:scale-90 duration-300 hover:text-[#964407] transition-colors" href="#">
<span class="material-symbols-outlined mb-1">chat_bubble</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium">Agent</span>
</a>
<a class="flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full p-4 tap-highlight-none active:scale-90 duration-300" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">timer</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium">Focus</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] p-3 tap-highlight-none active:scale-90 duration-300 hover:text-[#964407] transition-colors" href="#">
<span class="material-symbols-outlined mb-1">auto_stories</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium">Reflect</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] p-3 tap-highlight-none active:scale-90 duration-300 hover:text-[#964407] transition-colors" href="#">
<span class="material-symbols-outlined mb-1">settings</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium">Settings</span>
</a>
</nav>
</body></html>

<!-- Eden Agent (Chat) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Edenify — Active Conversation</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;0,700;1,400;1,600&amp;family=Manrope:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface-container-lowest": "#ffffff",
                    "primary-fixed-dim": "#ffb68e",
                    "primary": "#964407",
                    "surface-container-high": "#ece7e1",
                    "on-primary-fixed-variant": "#773300",
                    "surface-tint": "#99460a",
                    "on-secondary": "#ffffff",
                    "tertiary": "#944242",
                    "on-surface-variant": "#554339",
                    "surface-variant": "#e6e2db",
                    "on-primary-fixed": "#331200",
                    "on-tertiary-fixed": "#3f0308",
                    "surface-container-low": "#f8f3ec",
                    "surface-dim": "#ded9d3",
                    "on-primary-container": "#fffbff",
                    "on-tertiary-container": "#fffbff",
                    "on-surface": "#1d1c18",
                    "inverse-primary": "#ffb68e",
                    "surface-container-highest": "#e6e2db",
                    "on-secondary-fixed": "#271909",
                    "error-container": "#ffdad6",
                    "on-secondary-container": "#735f4a",
                    "primary-fixed": "#ffdbca",
                    "error": "#ba1a1a",
                    "outline": "#887368",
                    "on-primary": "#ffffff",
                    "background": "#fef9f2",
                    "surface": "#fef9f2",
                    "surface-container": "#f2ede6",
                    "secondary-fixed-dim": "#dcc2a9",
                    "secondary-container": "#f7dbc1",
                    "on-error-container": "#93000a",
                    "secondary": "#6f5b46",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "on-secondary-fixed-variant": "#564330",
                    "primary-container": "#b65c21",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "inverse-surface": "#32302c",
                    "inverse-on-surface": "#f5f0e9",
                    "secondary-fixed": "#fadec4",
                    "tertiary-fixed": "#ffdad8",
                    "tertiary-container": "#b35a59",
                    "surface-bright": "#fef9f2",
                    "outline-variant": "#dbc1b5",
                    "on-error": "#ffffff",
                    "on-background": "#1d1c18",
                    "on-tertiary": "#ffffff"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"]
            }
          },
        }
      }
    </script>
<style>
        body { font-family: 'Manrope', sans-serif; background-color: #faf5ee; }
        .font-serif { font-family: 'Newsreader', serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .reflection-marker { position: relative; }
        .reflection-marker::before {
            content: '';
            position: absolute;
            left: -16px;
            top: 4px;
            bottom: 4px;
            width: 3px;
            border-radius: 99px;
            background-color: #964407;
        }
        .message-shadow { box-shadow: 0 4px 20px rgba(44, 33, 24, 0.04); }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="text-on-surface min-h-screen flex flex-col">
<!-- Top Navigation -->
<header class="fixed top-0 w-full z-50 bg-[#fef9f2]/80 backdrop-blur-md flex justify-between items-center px-6 h-16 w-full">
<div class="flex items-center gap-4">
<button class="material-symbols-outlined text-[#964407] hover:opacity-80 transition-opacity active:duration-150 scale-95" data-icon="menu">menu</button>
<h1 class="text-2xl font-serif italic text-[#964407] tracking-tight">Edenify</h1>
</div>
<div class="flex items-center gap-3">
<span class="font-serif italic text-sm text-[#964407]">Presence</span>
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/15">
<img alt="User Profile" class="w-full h-full object-cover" data-alt="portrait of a focused professional woman with a calm expression in warm natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGPLZsAAAllQBV9GlKj1Jhb1g--63T16p5QhpKBjtDWo7ss5Ve9wJP8PlAIrhmrurPoXSDRMfgh6fZos9Iirwn49SMSU2E93l0eZR8fozQuFNpfPia2ESW00e1UNSe4yKFXOGMMSTEkTJ0eAACI5kXOO-t4jWKMzQzk_UljJC9zjgVNhNSjoHcuFCl-YuJpcoem0VHQB8PdXvGEEPumsnyD4XrH794ZkYiWWurUrd8v5_b1Qghmo3N8LanKdcsYHgscQwXNfxKHA"/>
</div>
</div>
</header>
<!-- Main Content Canvas -->
<main class="flex-1 mt-16 mb-24 px-4 md:px-8 max-w-4xl mx-auto w-full flex flex-col gap-8 py-8">
<!-- Conversation Start Indicator -->
<div class="flex justify-center">
<span class="font-label text-[10px] uppercase tracking-[0.2em] text-outline opacity-60">Yesterday — Evening Reflection</span>
</div>
<!-- Eden Message -->
<div class="flex flex-col gap-2 max-w-[85%] self-start">
<div class="flex items-center gap-2 mb-1">
<span class="font-serif italic text-sm text-primary">Eden</span>
<span class="w-1.5 h-1.5 rounded-full bg-primary/20"></span>
</div>
<div class="bg-surface-container-low p-5 rounded-tr-3xl rounded-br-3xl rounded-bl-lg message-shadow border-l-2 border-primary/10">
<p class="font-body text-[15px] leading-relaxed text-on-surface-variant">
                    Good evening. I've been reflecting on our earlier conversation about your quarterly goals. You mentioned feeling overwhelmed by the financial audit. How can we simplify your focus today?
                </p>
</div>
</div>
<!-- User Message -->
<div class="flex flex-col gap-2 max-w-[85%] self-end">
<div class="bg-gradient-to-br from-[#964407] to-[#b65c21] p-5 rounded-tl-3xl rounded-bl-3xl rounded-br-lg message-shadow text-white">
<p class="font-body text-[15px] leading-relaxed">
                    I need to break down the audit into three specific steps for tomorrow. Can you help me draft a focused task list for the morning session?
                </p>
</div>
<div class="flex justify-end mt-1">
<span class="font-label text-[10px] uppercase tracking-widest text-outline opacity-40">Delivered</span>
</div>
</div>
<!-- Eden Response with Task Card -->
<div class="flex flex-col gap-4 max-w-[85%] self-start">
<div class="flex items-center gap-2 mb-1">
<span class="font-serif italic text-sm text-primary">Eden</span>
<span class="w-1.5 h-1.5 rounded-full bg-primary/20"></span>
</div>
<div class="flex flex-col gap-4">
<div class="bg-surface-container-low p-5 rounded-tr-3xl rounded-br-3xl rounded-bl-lg message-shadow border-l-2 border-primary/10">
<p class="font-body text-[15px] leading-relaxed text-on-surface-variant">
                        Of course. Based on your current ledger status, I have outlined the following essential steps to clear the mental clutter.
                    </p>
</div>
<!-- Task Creation Card (Special Element) -->
<div class="bg-surface-container p-6 rounded-2xl border-l-4 border-tertiary-container message-shadow relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-6xl" data-icon="assignment">assignment</span>
</div>
<div class="flex items-center justify-between mb-6">
<span class="font-label text-[11px] font-bold uppercase tracking-[0.25em] text-tertiary-container">Tasks Created</span>
<span class="material-symbols-outlined text-tertiary-container text-sm" data-icon="auto_awesome">auto_awesome</span>
</div>
<div class="space-y-4">
<div class="flex items-start gap-4">
<div class="mt-1 w-5 h-5 rounded border-2 border-outline-variant/40 flex items-center justify-center shrink-0"></div>
<div>
<h4 class="font-body font-semibold text-sm text-on-surface">Reconcile Q3 Statement</h4>
<p class="font-body text-xs text-on-surface-variant mt-0.5">Cross-reference ledger with bank exports.</p>
</div>
</div>
<div class="flex items-start gap-4">
<div class="mt-1 w-5 h-5 rounded border-2 border-outline-variant/40 flex items-center justify-center shrink-0"></div>
<div>
<h4 class="font-body font-semibold text-sm text-on-surface">Categorize Expense Anomalies</h4>
<p class="font-body text-xs text-on-surface-variant mt-0.5">Flag items above $500 for secondary review.</p>
</div>
</div>
<div class="flex items-start gap-4">
<div class="mt-1 w-5 h-5 rounded border-2 border-outline-variant/40 flex items-center justify-center shrink-0"></div>
<div>
<h4 class="font-body font-semibold text-sm text-on-surface">Draft Final Summary</h4>
<p class="font-body text-xs text-on-surface-variant mt-0.5">Prepare the 'State of the Ledger' internal memo.</p>
</div>
</div>
</div>
<button class="mt-6 w-full py-3 px-4 rounded-full bg-surface-container-highest text-primary font-label text-xs font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
                        View in Journal
                        <span class="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
</div>
<!-- User Typing State -->
<div class="flex flex-col gap-2 max-w-[85%] self-end">
<div class="bg-gradient-to-br from-[#964407] to-[#b65c21] p-5 rounded-tl-3xl rounded-bl-3xl rounded-br-lg message-shadow text-white">
<p class="font-body text-[15px] leading-relaxed">
                    This looks perfect. Can you also set a reminder for 9 AM tom
                </p>
<span class="inline-block w-[2px] h-4 bg-white/60 ml-0.5 animate-pulse align-middle"></span>
</div>
</div>
</main>
<!-- Bottom Action Bar / Input -->
<div class="fixed bottom-24 left-0 w-full px-4 md:px-8 flex justify-center z-40 pointer-events-none">
<div class="w-full max-w-2xl bg-surface-container-lowest/90 backdrop-blur-xl p-2 rounded-[32px] message-shadow pointer-events-auto flex items-center gap-2 border border-outline-variant/10">
<button class="p-3 rounded-full text-primary hover:bg-surface-container-low transition-colors">
<span class="material-symbols-outlined" data-icon="add_circle">add_circle</span>
</button>
<div class="flex-1 relative">
<div class="absolute inset-y-0 left-0 flex items-center pl-1 text-primary opacity-40">
<span class="font-serif italic text-sm">Drafting...</span>
</div>
<input class="w-full bg-transparent border-none focus:ring-0 text-sm font-body py-3 pl-16 pr-4 text-on-surface" type="text" value="This looks perfect. Can you also set a reminder for 9 AM tom"/>
</div>
<button class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform">
<span class="material-symbols-outlined" data-icon="arrow_upward">arrow_upward</span>
</button>
</div>
</div>
<!-- Bottom Navigation Bar -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#fef9f2]/90 backdrop-blur-lg rounded-t-[28px] shadow-[0_-12px_32px_rgba(44,33,24,0.04)]">
<!-- Agent Active -->
<a class="flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full p-3 active:scale-90 duration-300" href="#">
<span class="material-symbols-outlined" data-icon="chat_bubble" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium mt-1 md:hidden">Agent</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:text-[#964407] transition-colors active:scale-90 duration-300" href="#">
<span class="material-symbols-outlined" data-icon="timer">timer</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium mt-1 md:hidden">Focus</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:text-[#964407] transition-colors active:scale-90 duration-300" href="#">
<span class="material-symbols-outlined" data-icon="auto_stories">auto_stories</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium mt-1 md:hidden">Reflect</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:text-[#964407] transition-colors active:scale-90 duration-300" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium mt-1 md:hidden">Settings</span>
</a>
</nav>
<!-- Visual Texture Layer -->
<div class="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')]"></div>
</body></html>

<!-- Eden Agent (Initial) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Edenify — Your Purpose Companion</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400;1,600&amp;family=Manrope:wght@400;500;600&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "surface-container-lowest": "#ffffff",
                      "primary-fixed-dim": "#ffb68e",
                      "primary": "#964407",
                      "surface-container-high": "#ece7e1",
                      "on-primary-fixed-variant": "#773300",
                      "surface-tint": "#99460a",
                      "on-secondary": "#ffffff",
                      "tertiary": "#944242",
                      "on-surface-variant": "#554339",
                      "surface-variant": "#e6e2db",
                      "on-primary-fixed": "#331200",
                      "on-tertiary-fixed": "#3f0308",
                      "surface-container-low": "#f8f3ec",
                      "surface-dim": "#ded9d3",
                      "on-primary-container": "#fffbff",
                      "on-tertiary-container": "#fffbff",
                      "on-surface": "#1d1c18",
                      "inverse-primary": "#ffb68e",
                      "surface-container-highest": "#e6e2db",
                      "on-secondary-fixed": "#271909",
                      "error-container": "#ffdad6",
                      "on-secondary-container": "#735f4a",
                      "primary-fixed": "#ffdbca",
                      "error": "#ba1a1a",
                      "outline": "#887368",
                      "on-primary": "#ffffff",
                      "background": "#fef9f2",
                      "surface-container": "#f2ede6",
                      "secondary-fixed-dim": "#dcc2a9",
                      "secondary-container": "#f7dbc1",
                      "on-error-container": "#93000a",
                      "secondary": "#6f5b46",
                      "on-tertiary-fixed-variant": "#792e2f",
                      "on-secondary-fixed-variant": "#564330",
                      "primary-container": "#b65c21",
                      "tertiary-fixed-dim": "#ffb3b0",
                      "inverse-surface": "#32302c",
                      "inverse-on-surface": "#f5f0e9",
                      "secondary-fixed": "#fadec4",
                      "tertiary-fixed": "#ffdad8",
                      "tertiary-container": "#b35a59",
                      "surface-bright": "#fef9f2",
                      "outline-variant": "#dbc1b5",
                      "on-error": "#ffffff",
                      "on-background": "#1d1c18",
                      "surface": "#fef9f2",
                      "on-tertiary": "#ffffff"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "fontFamily": {
                      "headline": ["Newsreader", "serif"],
                      "body": ["Manrope", "sans-serif"],
                      "label": ["Manrope", "sans-serif"]
              }
            },
          },
        }
    </script>
<style>
        body { font-family: 'Manrope', sans-serif; background-color: #faf5ee; }
        .serif { font-family: 'Newsreader', serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .glass-nav { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .tap-highlight-none { -webkit-tap-highlight-color: transparent; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="text-on-surface selection:bg-primary-fixed">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-[#fef9f2]/80 dark:bg-[#32302c]/80 backdrop-blur-md flex justify-between items-center px-6 h-16 w-full">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[#964407] dark:text-[#c2652a] hover:opacity-80 transition-opacity cursor-pointer">menu</span>
<h1 class="text-2xl font-serif italic text-[#964407] dark:text-[#c2652a] tracking-tight">Edenify</h1>
</div>
<div class="flex items-center">
<div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/15">
<img alt="User Profile" class="w-full h-full object-cover" data-alt="Close-up portrait of a woman with a serene expression in warm natural lighting, minimalist aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbgQUk-poZYD6h8YLWTE8-c9trYtJolYhuGsS9CHQsZnEqedSeGC8PapBeuQLP9jG_EDPhSfNylsyZE13zMJzjBlML23G88KUPP_hWTumRnTIVJPU_OzJUEtzxZrQrdboQhkuKwRmLFkLOTVdB11x9VIwYBKITj0FwRr3zT0XTjb7KwbHYCXKiBGqfmRpscvIZhZZh2cQVsh_qFxXw03YBTFvM9ucZ4AiqIcW9Sd7skAuHGIAPxWPC-LMhEb7Y8NBDS1uNYBuYhA"/>
</div>
</div>
</header>
<main class="pt-24 pb-32 min-h-screen flex flex-col max-w-2xl mx-auto px-6">
<!-- Agent Header Section -->
<section class="flex items-center gap-4 mb-12">
<div class="w-11 h-11 rounded-lg bg-gradient-to-br from-[#4d6b4a] to-[#7a8c78] flex items-center justify-center text-white">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">eco</span>
</div>
<div>
<h2 class="text-2xl serif font-semibold tracking-tight text-on-surface">Eden</h2>
<p class="text-[11px] font-body uppercase tracking-widest text-on-surface-variant font-medium opacity-70">Purpose Companion · Powered by Gemini</p>
</div>
</section>
<!-- Chat Area Empty State -->
<section class="flex-grow flex flex-col items-center justify-center text-center space-y-6">
<div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#4d6b4a] to-[#7a8c78] flex items-center justify-center text-white shadow-xl rotate-3">
<span class="material-symbols-outlined text-5xl" style="font-variation-settings: 'FILL' 1;">eco</span>
</div>
<div class="space-y-2">
<h3 class="text-3xl serif italic text-on-surface">Eden is ready.</h3>
<p class="text-on-surface-variant font-body max-w-xs mx-auto leading-relaxed">
                    Ask anything — habits, Scripture, focus, or your next step.
                </p>
</div>
</section>
<!-- Interaction Interface (Fixed to bottom but above Nav) -->
<section class="mt-auto space-y-6">
<!-- Quick Action Row -->
<div class="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
<button class="whitespace-nowrap px-5 py-2.5 bg-surface-container-low text-primary font-body text-sm rounded-full border border-outline-variant/15 hover:bg-surface-container-high transition-colors tap-highlight-none">
                    Create a task
                </button>
<button class="whitespace-nowrap px-5 py-2.5 bg-surface-container-low text-primary font-body text-sm rounded-full border border-outline-variant/15 hover:bg-surface-container-high transition-colors tap-highlight-none">
                    Show my progress
                </button>
<button class="whitespace-nowrap px-5 py-2.5 bg-surface-container-low text-primary font-body text-sm rounded-full border border-outline-variant/15 hover:bg-surface-container-high transition-colors tap-highlight-none">
                    Bible study help
                </button>
</div>
<!-- Input Bar -->
<div class="relative group">
<div class="bg-surface-container-low rounded-[24px] p-2 pr-3 flex items-end gap-2 border-b-2 border-outline-variant/30 focus-within:border-primary transition-all duration-300">
<textarea class="flex-grow bg-transparent border-none focus:ring-0 py-3 px-4 font-body text-on-surface placeholder:text-outline resize-none min-h-[52px]" placeholder="Ask Eden anything" rows="1"></textarea>
<button class="w-11 h-11 rounded-full bg-gradient-to-br from-[#964407] to-[#b65c21] text-white flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform shadow-lg shadow-primary/10">
<span class="material-symbols-outlined">arrow_upward</span>
</button>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#fef9f2]/90 dark:bg-[#32302c]/90 backdrop-blur-lg rounded-t-[28px] shadow-[0_-12px_32px_rgba(44,33,24,0.04)]">
<!-- Agent Tab (Active) -->
<a class="flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full p-3 tap-highlight-none active:scale-90 duration-300" href="#">
<span class="material-symbols-outlined" data-icon="chat_bubble" style="font-variation-settings: 'FILL' 1;">chat_bubble</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium mt-1 sr-only">Agent</span>
</a>
<!-- Focus Tab -->
<a class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#f8f3ec]/50 p-3 hover:text-[#964407] transition-colors tap-highlight-none active:scale-90 duration-300" href="#">
<span class="material-symbols-outlined" data-icon="timer">timer</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium mt-1 sr-only">Focus</span>
</a>
<!-- Reflect Tab -->
<a class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#f8f3ec]/50 p-3 hover:text-[#964407] transition-colors tap-highlight-none active:scale-90 duration-300" href="#">
<span class="material-symbols-outlined" data-icon="auto_stories">auto_stories</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium mt-1 sr-only">Reflect</span>
</a>
<!-- Settings Tab -->
<a class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#f8f3ec]/50 p-3 hover:text-[#964407] transition-colors tap-highlight-none active:scale-90 duration-300" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium mt-1 sr-only">Settings</span>
</a>
</nav>
<style>
        /* Custom scrollbar for action row */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
</body></html>

<!-- Focus Mode (Running) -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Edenify - Focus Mode</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400;1,600&amp;family=Manrope:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface-container-lowest": "#ffffff",
                    "primary-fixed-dim": "#ffb68e",
                    "primary": "#964407",
                    "surface-container-high": "#ece7e1",
                    "on-primary-fixed-variant": "#773300",
                    "surface-tint": "#99460a",
                    "on-secondary": "#ffffff",
                    "tertiary": "#944242",
                    "on-surface-variant": "#554339",
                    "surface-variant": "#e6e2db",
                    "on-primary-fixed": "#331200",
                    "on-tertiary-fixed": "#3f0308",
                    "surface-container-low": "#f8f3ec",
                    "surface-dim": "#ded9d3",
                    "on-primary-container": "#fffbff",
                    "on-tertiary-container": "#fffbff",
                    "on-surface": "#1d1c18",
                    "inverse-primary": "#ffb68e",
                    "surface-container-highest": "#e6e2db",
                    "on-secondary-fixed": "#271909",
                    "error-container": "#ffdad6",
                    "on-secondary-container": "#735f4a",
                    "primary-fixed": "#ffdbca",
                    "error": "#ba1a1a",
                    "outline": "#887368",
                    "on-primary": "#ffffff",
                    "background": "#fef9f2",
                    "surface": "#fef9f2",
                    "surface-container": "#f2ede6",
                    "secondary-fixed-dim": "#dcc2a9",
                    "secondary-container": "#f7dbc1",
                    "on-error-container": "#93000a",
                    "secondary": "#6f5b46",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "on-secondary-fixed-variant": "#564330",
                    "primary-container": "#b65c21",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "inverse-surface": "#32302c",
                    "inverse-on-surface": "#f5f0e9",
                    "secondary-fixed": "#fadec4",
                    "tertiary-fixed": "#ffdad8",
                    "tertiary-container": "#b35a59",
                    "surface-bright": "#fef9f2",
                    "outline-variant": "#dbc1b5",
                    "on-error": "#ffffff",
                    "on-background": "#1d1c18",
                    "on-tertiary": "#ffffff"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"]
            }
          },
        },
      }
    </script>
<style>
        body { font-family: 'Manrope', sans-serif; background-color: #faf5ee; }
        .font-serif { font-family: 'Newsreader', serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .ring-progress { transform: rotate(-90deg); transition: stroke-dashoffset 0.5s ease; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-[#faf5ee] text-on-surface min-h-screen flex flex-col">
<header class="fixed top-0 w-full z-50 bg-[#fef9f2]/80 backdrop-blur-md flex justify-between items-center px-6 h-16 w-full">
<div class="flex items-center gap-4">
<button class="text-[#964407] hover:opacity-80 transition-opacity active:scale-95 active:duration-150">
<span class="material-symbols-outlined" data-icon="menu">menu</span>
</button>
<h1 class="text-2xl font-serif italic text-[#964407] tracking-tight">Edenify</h1>
</div>
<div class="h-8 w-8 rounded-full bg-surface-container-high overflow-hidden">
<img alt="User Profile" class="w-full h-full object-cover" data-alt="Close up portrait of a calm man with a short beard in a minimalist neutral-toned studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6K4lHmxlHFTIiCb9fdOKA-YjuXvIOYYWB-KFjp8N1u4VEDcHYCvSY-w5jZWJ-WYBTqZaEkp9nGxGJgTEX5q6IjqY6FOlHXNfpE7XAclJ9f8DMZWWL4SoxYjFkTo1NbLuAMnmPm8kkoKnRoYnsUYIO3gk0CptwYV2T-w5H0SrgUkb5spUTB0fC0gCKyazeDm4Cnm5DdiLDKzIxvhMet0l90hFem6WWDkKKE6X3Oh_UY4HKQgOb0ECLLqYzQ6XsOtsEnkQpLgn_RQ"/>
</div>
</header>
<main class="flex-grow pt-24 pb-32 px-6 max-w-4xl mx-auto w-full flex flex-col items-center justify-center space-y-12">
<div class="relative flex items-center justify-center">
<svg class="w-72 h-72 md:w-80 md:h-80 ring-progress">
<circle class="text-surface-container-high" cx="50%" cy="50%" fill="transparent" r="48%" stroke="currentColor" stroke-width="6"></circle>
<circle cx="50%" cy="50%" fill="transparent" r="48%" stroke="#964407" stroke-dasharray="1000" stroke-dashoffset="400" stroke-linecap="round" stroke-width="8"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center text-center">
<span class="text-[#964407] font-body text-[11px] uppercase tracking-[0.2em] font-bold mb-1">FOCUS TIME</span>
<span class="text-[52px] font-serif leading-none text-on-surface font-semibold tracking-tighter">14:52</span>
<div class="mt-4 flex flex-col items-center">
<span class="text-on-surface-variant font-medium text-sm">Deep Work · Academic</span>
<div class="h-[2px] w-8 mt-2 bg-[#4d6b4a]"></div>
</div>
</div>
</div>
<div class="flex flex-col items-center space-y-10 w-full">
<div class="flex items-center gap-12">
<button class="text-outline hover:text-primary transition-colors opacity-40 cursor-not-allowed">
<span class="material-symbols-outlined text-3xl" data-icon="replay">replay</span>
</button>
<button class="w-20 h-20 rounded-full bg-gradient-to-br from-[#964407] to-[#b65c21] text-white flex items-center justify-center shadow-[0_12px_32px_rgba(150,68,7,0.2)] active:scale-95 transition-transform">
<span class="material-symbols-outlined text-4xl" data-icon="pause" style="font-variation-settings: 'FILL' 1;">pause</span>
</button>
<button class="text-outline hover:text-primary transition-colors">
<span class="material-symbols-outlined text-3xl" data-icon="skip_next">skip_next</span>
</button>
</div>
<div class="w-full max-w-md space-y-6 opacity-30 pointer-events-none">
<div class="bg-surface-container-low p-6 rounded-[24px] space-y-4">
<div class="flex justify-between items-center">
<span class="font-serif italic text-lg text-on-surface">Focus Mode</span>
<span class="text-xs uppercase tracking-widest text-outline">Active</span>
</div>
<div class="grid grid-cols-3 gap-2">
<div class="bg-surface-container-highest p-3 rounded-xl flex flex-col items-center border-b-2 border-primary">
<span class="material-symbols-outlined text-primary mb-1" data-icon="timer">timer</span>
<span class="text-[10px] font-bold uppercase tracking-tighter">Pomodoro</span>
</div>
<div class="bg-surface-container-high p-3 rounded-xl flex flex-col items-center">
<span class="material-symbols-outlined text-on-surface-variant mb-1" data-icon="fluid_meditation">fluid</span>
<span class="text-[10px] font-bold uppercase tracking-tighter">Flow</span>
</div>
<div class="bg-surface-container-high p-3 rounded-xl flex flex-col items-center">
<span class="material-symbols-outlined text-on-surface-variant mb-1" data-icon="custom_typography">custom_typography</span>
<span class="text-[10px] font-bold uppercase tracking-tighter">Custom</span>
</div>
</div>
</div>
<div class="bg-surface-container-low p-5 rounded-[24px] flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
<span class="material-symbols-outlined text-secondary" data-icon="settings">settings</span>
</div>
<div>
<p class="text-xs font-bold uppercase tracking-widest text-on-surface">Configurations</p>
<p class="text-sm text-on-surface-variant">Linen White noise enabled</p>
</div>
</div>
<span class="material-symbols-outlined text-outline" data-icon="chevron_right">chevron_right</span>
</div>
</div>
</div>
</main>
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#fef9f2]/90 backdrop-blur-lg rounded-t-[28px] shadow-[0_-12px_32px_rgba(44,33,24,0.04)]">
<div class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:text-[#964407] transition-colors active:scale-90 duration-300">
<span class="material-symbols-outlined mb-1" data-icon="chat_bubble">chat_bubble</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium">Agent</span>
</div>
<div class="flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full p-3 active:scale-90 duration-300">
<span class="material-symbols-outlined mb-1" data-icon="timer" style="font-variation-settings: 'FILL' 1;">timer</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium">Focus</span>
</div>
<div class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:text-[#964407] transition-colors active:scale-90 duration-300">
<span class="material-symbols-outlined mb-1" data-icon="auto_stories">auto_stories</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium">Reflect</span>
</div>
<div class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:text-[#964407] transition-colors active:scale-90 duration-300">
<span class="material-symbols-outlined mb-1" data-icon="settings">settings</span>
<span class="font-sans text-[11px] uppercase tracking-widest font-medium">Settings</span>
</div>
</nav>
<div class="fixed left-0 top-1/2 -translate-y-1/2 ml-4 flex flex-col space-y-4 opacity-50 hidden lg:flex">
<div class="h-12 w-[2px] bg-[#4d6b4a]"></div>
<span class="font-serif italic text-sm origin-left -rotate-90 whitespace-nowrap text-[#4d6b4a]">Academic Discipline</span>
</div>
</body></html>

<!-- Eden AI Settings -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Eden Settings</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,700;1,6..72,400;1,6..72,700&amp;family=Manrope:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-surface-variant": "#554339",
                    "primary-fixed": "#ffdbca",
                    "on-tertiary": "#ffffff",
                    "on-error": "#ffffff",
                    "primary-container": "#b65c21",
                    "surface-container-highest": "#e6e2db",
                    "surface-container-high": "#ece7e1",
                    "secondary-fixed": "#fadec4",
                    "inverse-surface": "#32302c",
                    "tertiary-fixed": "#ffdad8",
                    "tertiary-container": "#b35a59",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "surface-tint": "#99460a",
                    "inverse-primary": "#ffb68e",
                    "on-tertiary-fixed": "#3f0308",
                    "on-surface": "#1d1c18",
                    "error": "#ba1a1a",
                    "surface": "#fef9f2",
                    "on-tertiary-container": "#fffbff",
                    "error-container": "#ffdad6",
                    "primary-fixed-dim": "#ffb68e",
                    "on-primary-fixed-variant": "#773300",
                    "on-secondary-fixed": "#271909",
                    "background": "#fef9f2",
                    "outline": "#887368",
                    "on-error-container": "#93000a",
                    "primary": "#964407",
                    "on-primary": "#ffffff",
                    "on-background": "#1d1c18",
                    "surface-container-low": "#f8f3ec",
                    "surface-dim": "#ded9d3",
                    "surface-container-lowest": "#ffffff",
                    "on-primary-container": "#fffbff",
                    "inverse-on-surface": "#f5f0e9",
                    "tertiary": "#944242",
                    "secondary-fixed-dim": "#dcc2a9",
                    "secondary-container": "#f7dbc1",
                    "secondary": "#6f5b46",
                    "on-secondary": "#ffffff",
                    "on-primary-fixed": "#331200",
                    "on-secondary-container": "#735f4a",
                    "on-secondary-fixed-variant": "#564330",
                    "surface-bright": "#fef9f2",
                    "surface-variant": "#e6e2db",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "outline-variant": "#dbc1b5",
                    "surface-container": "#f2ede6"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"]
            }
          },
        }
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .serif-italic { font-family: 'Newsreader', serif; font-style: italic; }
        .serif-bold { font-family: 'Newsreader', serif; font-weight: 700; }
        .manrope { font-family: 'Manrope', sans-serif; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface manrope min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed">
<header class="bg-[#fef9f2]/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center w-full px-6 h-16">
<div class="flex items-center gap-4">
<button class="text-[#964407] hover:bg-[#f8f3ec] transition-colors p-2 rounded-full active:scale-95 duration-150">
<span class="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
</button>
<h1 class="serif-italic text-2xl text-[#964407]">Eden Settings</h1>
</div>
<div class="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant/30">
<img alt="User profile avatar" class="w-full h-full object-cover" data-alt="closeup portrait of a calm man with a short beard in a natural linen shirt against a soft neutral background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMeKDGEAlC51W8HpvJ59KaVadlP-Dm0AucdV_pc3a6KEJAFX-dDeMBJFRwExmt8vaweyN2fqNieq1D3fHfaRfCNREzlTKPjquMmPBeURenvaLH1Vj84sJcR9BfA2qn7gdJ80kvJpuPtQXh64p-FSJtO2E7-F-z5nMQr-lsj6CCOuNaDRgi0Qw45pgipfge2mc-fZYSGsNGcLLrIpeAIb5Wz93ZiHuVHJLg_VAOO9EZNoMoZeeni1iaPk0dJnhfVdbse6dsyFWsWg"/>
</div>
</header>
<main class="max-w-2xl mx-auto px-6 py-12 space-y-12 pb-32">
<section class="space-y-4">
<div class="flex items-baseline gap-6">
<div class="w-px h-16 bg-primary/20"></div>
<div class="space-y-2">
<h2 class="serif-bold text-4xl tracking-tight text-on-surface">Refine your digital <span class="serif-italic font-normal">companion.</span></h2>
<p class="text-on-surface-variant leading-relaxed max-w-md">
                        Adjust how Eden AI interacts with your journey. These settings govern the depth of insight and the continuity of your spiritual ledger.
                    </p>
</div>
</div>
</section>
<section class="space-y-8">
<div class="grid gap-6">
<div class="bg-surface-container-low rounded-[28px] p-8 space-y-6 transition-all duration-300 hover:bg-surface-container">
<div class="flex justify-between items-start">
<div class="space-y-1">
<label class="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Integration</label>
<h3 class="serif-bold text-xl text-on-surface">Gemini API Key</h3>
</div>
<span class="material-symbols-outlined text-primary/40" data-icon="key">key</span>
</div>
<div class="relative">
<input class="w-full bg-surface-container-lowest border-none border-b-2 border-outline-variant py-3 px-4 focus:ring-0 focus:border-primary text-on-surface-variant font-mono tracking-widest rounded-t-xl" readonly="" type="password" value="••••••••••••••••••••••••••••"/>
<button class="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary-container transition-colors">
<span class="material-symbols-outlined" data-icon="visibility">visibility</span>
</button>
</div>
<p class="text-xs text-on-surface-variant/70 italic">Your key is encrypted and never stored in plain text on our servers.</p>
</div>
<div class="bg-surface-container-low rounded-[28px] p-8 flex justify-between items-center transition-all duration-300 hover:bg-surface-container">
<div class="space-y-1">
<label class="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Cadence</label>
<h3 class="serif-bold text-xl text-on-surface">Insight Frequency</h3>
<p class="text-sm text-on-surface-variant">How often Eden provides theological reflections.</p>
</div>
<button class="flex items-center gap-2 bg-surface-container-lowest py-3 px-6 rounded-full text-on-surface font-semibold hover:bg-white transition-all shadow-sm">
                        Daily
                        <span class="material-symbols-outlined text-primary text-lg" data-icon="expand_more">expand_more</span>
</button>
</div>
<div class="bg-surface-container-low rounded-[28px] p-8 space-y-4 transition-all duration-300 hover:bg-surface-container">
<div class="flex justify-between items-center">
<div class="space-y-1">
<label class="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Cognition</label>
<h3 class="serif-bold text-xl text-on-surface">Conversation Memory</h3>
</div>
<label class="relative inline-flex items-center cursor-pointer">
<input checked="" class="sr-only peer" type="checkbox"/>
<div class="w-14 h-8 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-primary-container"></div>
</label>
</div>
<p class="text-sm text-on-surface-variant leading-relaxed">
                        Allows Eden to remember past dialogues to provide contextual wisdom tailored to your unique spiritual growth and recurring life patterns.
                    </p>
</div>
</div>
</section>
<section class="pt-8 space-y-6">
<div class="bg-error-container/20 rounded-[28px] p-8 space-y-6 border border-error/10">
<div class="flex items-center gap-3 text-error">
<span class="material-symbols-outlined" data-icon="warning">warning</span>
<h3 class="serif-bold text-xl">Sanctum Reset</h3>
</div>
<p class="text-sm text-on-surface-variant leading-relaxed">
                    Resetting Eden will permanently erase all learned context, conversation history, and your API configuration. This action cannot be undone.
                </p>
<button class="w-full py-4 rounded-full bg-white text-error font-bold tracking-wide border-2 border-error/20 hover:bg-error hover:text-white transition-all duration-300 active:scale-[0.98]">
                    Reset Eden
                </button>
</div>
</section>
</main>
<div class="fixed inset-y-0 left-0 w-80 z-[60] flex flex-col p-6 bg-[#fef9f2] shadow-2xl rounded-r-[28px] translate-x-[-100%] transition-transform duration-500 hover:translate-x-0 group">
<div class="absolute top-1/2 -right-10 bg-primary p-2 rounded-r-lg cursor-pointer group-hover:hidden">
<span class="material-symbols-outlined text-white" data-icon="chevron_right">chevron_right</span>
</div>
<div class="flex items-center gap-4 mb-10 pl-2">
<div class="w-12 h-12 rounded-full overflow-hidden">
<img alt="User avatar" class="w-full h-full object-cover" data-alt="portrait of a bearded man in a linen shirt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr37YfhxcAQHI1WHyZzqf6didUiH_JU_mt8QKuX0G-Q-QbaXWUBRmceMsdFXgQLqjGn3CFuHM5KxhIt35YMhNwQSVzsTckDZ6RKGHN-NTL0XiJN2E8OcPtYjxIE9POFJBDHj_EqIJ0qjdicsmO9mChCsvqBxnx_zGF9fRF51cMpysKdPYtVsD3Y5TBz8sSubkfqc-8AL57MXgA-u9O0XQLo2AYyVgs7oLZQzhstLX7beaqQZSs5l6h7qntmAbM_FohOFKdkWxpWw"/>
</div>
<div>
<h4 class="serif-bold text-on-surface">Aiden Thorne</h4>
<p class="text-xs text-on-surface-variant uppercase tracking-tighter">Level 14 Disciple</p>
</div>
</div>
<nav class="flex flex-col flex-1">
<a class="flex items-center gap-4 px-4 py-3 text-[#7a6550] hover:bg-[#f8f3ec] hover:pl-6 rounded-r-full my-1 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="edit_note">edit_note</span>
<span class="manrope font-medium">Daily Ledger</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 text-[#7a6550] hover:bg-[#f8f3ec] hover:pl-6 rounded-r-full my-1 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
<span class="manrope font-medium">Spiritual Depth</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 text-[#7a6550] hover:bg-[#f8f3ec] hover:pl-6 rounded-r-full my-1 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="menu_book">menu_book</span>
<span class="manrope font-medium">Bible Plans</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 text-[#7a6550] hover:bg-[#f8f3ec] hover:pl-6 rounded-r-full my-1 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="smart_toy">smart_toy</span>
<span class="manrope font-medium">AI Chaplain</span>
</a>
<div class="mt-auto">
<a class="flex items-center gap-4 px-4 py-3 bg-gradient-to-r from-[#964407] to-[#b65c21] text-white rounded-r-full my-1 transition-all" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="manrope font-semibold">Settings</span>
</a>
</div>
</nav>
</div>
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-[#fef9f2]/90 backdrop-blur-md rounded-t-[28px] shadow-[0_-12px_32px_rgba(44,33,24,0.06)] md:hidden">
<div class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:opacity-80 active:scale-90 transition-all">
<span class="material-symbols-outlined" data-icon="auto_stories">auto_stories</span>
<span class="text-[10px] uppercase tracking-widest mt-1">Reflect</span>
</div>
<div class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:opacity-80 active:scale-90 transition-all">
<span class="material-symbols-outlined" data-icon="timer">timer</span>
<span class="text-[10px] uppercase tracking-widest mt-1">Focus</span>
</div>
<div class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:opacity-80 active:scale-90 transition-all">
<span class="material-symbols-outlined" data-icon="import_contacts">import_contacts</span>
<span class="text-[10px] uppercase tracking-widest mt-1">Growth</span>
</div>
<div class="flex flex-col items-center justify-center bg-[#f8f3ec] text-[#964407] rounded-full p-3 active:scale-90 transition-all">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="text-[10px] uppercase tracking-widest mt-1">Profile</span>
</div>
</nav>
</body></html>

<!-- Daily Scripture Reading -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            font-family: 'Manrope', sans-serif;
            background-color: #faf5ee;
        }
        .serif-display {
            font-family: 'Newsreader', serif;
        }
        .scripture-text {
            font-family: 'EB Garamond', serif;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "outline": "#887368",
                      "surface-container-highest": "#e6e2db",
                      "surface-container-high": "#ece7e1",
                      "on-secondary-container": "#735f4a",
                      "primary": "#964407",
                      "surface-container-lowest": "#ffffff",
                      "on-tertiary-fixed": "#3f0308",
                      "on-secondary-fixed": "#271909",
                      "on-secondary": "#ffffff",
                      "surface-variant": "#e6e2db",
                      "on-tertiary-container": "#fffbff",
                      "surface": "#fef9f2",
                      "primary-fixed-dim": "#ffb68e",
                      "background": "#fef9f2",
                      "on-primary-fixed-variant": "#773300",
                      "surface-bright": "#fef9f2",
                      "on-primary": "#ffffff",
                      "surface-container": "#f2ede6",
                      "tertiary-container": "#b35a59",
                      "secondary-fixed-dim": "#dcc2a9",
                      "on-tertiary": "#ffffff",
                      "on-surface-variant": "#554339",
                      "surface-container-low": "#f8f3ec",
                      "tertiary-fixed": "#ffdad8",
                      "primary-container": "#b65c21",
                      "on-background": "#1d1c18",
                      "surface-dim": "#ded9d3",
                      "secondary-fixed": "#fadec4",
                      "error-container": "#ffdad6",
                      "surface-tint": "#99460a",
                      "tertiary": "#944242",
                      "on-error-container": "#93000a",
                      "error": "#ba1a1a",
                      "outline-variant": "#dbc1b5",
                      "inverse-surface": "#32302c",
                      "on-surface": "#1d1c18",
                      "on-secondary-fixed-variant": "#564330",
                      "on-error": "#ffffff",
                      "tertiary-fixed-dim": "#ffb3b0",
                      "secondary-container": "#f7dbc1",
                      "on-primary-fixed": "#331200",
                      "secondary": "#6f5b46",
                      "on-tertiary-fixed-variant": "#792e2f",
                      "primary-fixed": "#ffdbca",
                      "inverse-on-surface": "#f5f0e9",
                      "on-primary-container": "#fffbff",
                      "inverse-primary": "#ffb68e"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "fontFamily": {
                      "headline": ["Newsreader"],
                      "body": ["Manrope"],
                      "label": ["Manrope"]
              }
            },
          }
        }
      </script>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
<!-- TopAppBar -->
<header class="fixed top-0 left-0 right-0 z-50 bg-[#fef9f2]/80 backdrop-blur-md flex justify-between items-center w-full px-6 py-4">
<div class="flex items-center gap-4">
<button class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f8f3ec] transition-colors duration-300 active:scale-95 text-[#964407]">
<span class="material-symbols-outlined">arrow_back</span>
</button>
<h1 class="font-['Newsreader'] tracking-tight leading-relaxed text-lg font-medium text-[#1d1c18]">Day 87 of 400</h1>
</div>
<button class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#f8f3ec] transition-colors duration-300 active:scale-95 text-[#964407]">
<span class="material-symbols-outlined">settings</span>
</button>
</header>
<main class="pt-24 pb-32 px-6 max-w-screen-md mx-auto">
<!-- Progress Indicator -->
<div class="mb-12">
<div class="flex justify-between items-end mb-2">
<span class="text-[10px] font-bold tracking-[0.2em] uppercase text-outline">Journey Progress</span>
<span class="text-xs font-medium text-primary">21.7%</span>
</div>
<div class="h-1 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-gradient-to-r from-primary to-primary-container w-[21.7%] rounded-full"></div>
</div>
</div>
<!-- Scripture Content -->
<article class="space-y-12">
<header class="space-y-2">
<div class="flex items-center gap-2 text-primary font-medium tracking-wide text-sm">
<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">auto_stories</span>
<span>Daily Bread</span>
</div>
<h2 class="serif-display text-5xl md:text-6xl font-light italic text-on-surface tracking-tighter">John 15:1-8</h2>
</header>
<div class="scripture-text text-2xl md:text-3xl leading-[1.7] text-on-surface-variant font-light space-y-8">
<p>
<span class="serif-display text-primary font-bold mr-2 text-4xl">1</span> “I am the true vine, and my Father is the gardener. 
                    <span class="serif-display text-primary font-bold mx-2 text-4xl">2</span> He cuts off every branch in me that bears no fruit, while every branch that does bear fruit he prunes so that it will be even more fruitful. 
                    <span class="serif-display text-primary font-bold mx-2 text-4xl">3</span> You are already clean because of the word I have spoken to you. 
                    <span class="serif-display text-primary font-bold mx-2 text-4xl">4</span> Remain in me, as I also remain in you. No branch can bear fruit by itself; it must remain in the vine. Neither can you bear fruit unless you remain in me.
                </p>
<p>
<span class="serif-display text-primary font-bold mr-2 text-4xl">5</span> “I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing. 
                    <span class="serif-display text-primary font-bold mx-2 text-4xl">6</span> If you do not remain in me, you are like a branch that is thrown away and withers; such branches are picked up, thrown into the fire and burned. 
                    <span class="serif-display text-primary font-bold mx-2 text-4xl">7</span> If you remain in me and my words remain in you, ask whatever you wish, and it will be done for you. 
                    <span class="serif-display text-primary font-bold mx-2 text-4xl">8</span> This is to my Father’s glory, that you bear much fruit, showing yourselves to be my disciples.
                </p>
</div>
</article>
<!-- Reflection Card -->
<section class="mt-20">
<div class="relative overflow-hidden rounded-3xl bg-surface-container-low p-8 md:p-12">
<!-- Reflection Marker -->
<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#7a6550]"></div>
<div class="flex flex-col md:flex-row md:items-start gap-8">
<div class="flex-1 space-y-4">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[#7a6550]" style="font-variation-settings: 'FILL' 1;">self_improvement</span>
<h3 class="font-['Newsreader'] italic text-2xl text-on-surface">Eden Insight</h3>
</div>
<p class="font-['Manrope'] text-lg leading-relaxed text-on-surface-variant italic">
                            "How can you prune the areas of your life that aren't bearing fruit today?"
                        </p>
</div>
<div class="shrink-0">
<img alt="Vineyard" class="w-full md:w-32 h-32 object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700" data-alt="Close-up of a sun-drenched vineyard with gnarled wooden vines and lush green leaves in soft warm morning light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk4Ma948rbgd9ffsABRo2VYP-NxHcH3xL3FsLPVLmluBGNO2iX9G_zXT74BbhuFr_AqdOKjvCw1_-Ue4TQPYZB8vYJYozzX_zXw_Puwgwsh2rmLjo9M6tfs6nPuX7v37Cs5_TcOzPNT5gbju_7oIDmhTQvXPbdeO9g7OjcdT_9khVz6vOh8kaI23RW5LA25Z8-iYYaKKD0YucnTObt51T4mfOz3DxghShEdaMB2LB0q5J8wxxShhLdRy50MVFFmODs3ruKQl_pIQ"/>
</div>
</div>
<div class="mt-8 pt-8 border-t border-outline-variant/15 flex justify-end">
<button class="text-primary font-bold text-sm tracking-widest uppercase flex items-center gap-2 group">
                        Write Reflection
                        <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
</button>
</div>
</div>
</section>
<!-- Primary Action -->
<div class="mt-16 flex justify-center">
<button class="w-full md:w-auto px-12 py-5 bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full font-bold tracking-wide text-lg shadow-[0_12px_32px_rgba(44,33,24,0.12)] active:scale-[0.98] transition-all">
                Complete Reading
            </button>
</div>
</main>
<!-- BottomNavBar (Hidden on scripture detail per UX Goal: Focus) -->
<!-- The BottomNavBar is suppressed here to prioritize the focused reading experience -->
</body></html>

<!-- Bible Plans Overview -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "outline": "#887368",
                    "surface-container-highest": "#e6e2db",
                    "surface-container-high": "#ece7e1",
                    "on-secondary-container": "#735f4a",
                    "primary": "#964407",
                    "surface-container-lowest": "#ffffff",
                    "on-tertiary-fixed": "#3f0308",
                    "on-secondary-fixed": "#271909",
                    "on-secondary": "#ffffff",
                    "surface-variant": "#e6e2db",
                    "on-tertiary-container": "#fffbff",
                    "surface": "#fef9f2",
                    "primary-fixed-dim": "#ffb68e",
                    "background": "#fef9f2",
                    "on-primary-fixed-variant": "#773300",
                    "surface-bright": "#fef9f2",
                    "on-primary": "#ffffff",
                    "surface-container": "#f2ede6",
                    "tertiary-container": "#b35a59",
                    "secondary-fixed-dim": "#dcc2a9",
                    "on-tertiary": "#ffffff",
                    "on-surface-variant": "#554339",
                    "surface-container-low": "#f8f3ec",
                    "tertiary-fixed": "#ffdad8",
                    "primary-container": "#b65c21",
                    "on-background": "#1d1c18",
                    "surface-dim": "#ded9d3",
                    "secondary-fixed": "#fadec4",
                    "error-container": "#ffdad6",
                    "surface-tint": "#99460a",
                    "tertiary": "#944242",
                    "on-error-container": "#93000a",
                    "error": "#ba1a1a",
                    "outline-variant": "#dbc1b5",
                    "inverse-surface": "#32302c",
                    "on-surface": "#1d1c18",
                    "on-secondary-fixed-variant": "#564330",
                    "on-error": "#ffffff",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "secondary-container": "#f7dbc1",
                    "on-primary-fixed": "#331200",
                    "secondary": "#6f5b46",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "primary-fixed": "#ffdbca",
                    "inverse-on-surface": "#f5f0e9",
                    "on-primary-container": "#fffbff",
                    "inverse-primary": "#ffb68e"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader"],
                    "body": ["Manrope"],
                    "label": ["Manrope"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            background-color: #faf5ee; /* User requested background */
            font-family: 'Manrope', sans-serif;
            color: #1d1c18;
        }
        .serif-text { font-family: 'Newsreader', serif; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="min-h-screen pb-32">
<!-- TopAppBar -->
<header class="sticky top-0 z-50 bg-[#fef9f2]/80 dark:bg-[#32302c]/80 backdrop-blur-md flex justify-between items-center w-full px-6 py-4">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-[#964407] dark:text-[#c2652a] cursor-pointer">arrow_back</span>
<h1 class="text-2xl font-serif italic text-[#1d1c18] dark:text-[#fef9f2] font-['Newsreader'] tracking-tight leading-relaxed">Bible Plans</h1>
</div>
<span class="material-symbols-outlined text-[#964407] dark:text-[#c2652a] cursor-pointer">settings</span>
</header>
<main class="max-w-2xl mx-auto px-6 py-8 space-y-12">
<!-- Featured Plan Section (Asymmetric Bento Style) -->
<section class="space-y-6">
<div class="bg-surface-container-lowest rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:bg-white border-b-4 border-primary">
<div class="relative z-10">
<div class="flex justify-between items-start mb-12">
<div class="space-y-2">
<span class="text-xs font-bold tracking-widest uppercase text-primary/60">Current Journey</span>
<h2 class="serif-text text-4xl font-medium leading-tight text-on-surface">400-Day Journey through the Word</h2>
</div>
<div class="text-right">
<p class="text-4xl font-serif italic text-primary">Day 87</p>
<p class="text-xs text-on-surface-variant/70 uppercase tracking-tighter">of 400</p>
</div>
</div>
<div class="space-y-4">
<div class="flex justify-between items-end">
<span class="text-sm font-medium text-on-surface-variant">Overall Progress</span>
<span class="serif-text text-xl italic text-primary">22%</span>
</div>
<div class="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full bg-gradient-to-r from-primary to-primary-container rounded-full" style="width: 22%"></div>
</div>
</div>
<div class="mt-10 flex justify-end">
<button class="bg-gradient-to-br from-[#964407] to-[#b65c21] text-white px-8 py-3 rounded-full font-medium text-sm flex items-center gap-2 transition-transform active:scale-95">
                            Continue Reading
                            <span class="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
<!-- Subtle texture overlay -->
<div class="absolute inset-0 opacity-5 pointer-events-none" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWfvul-Ijb2xvxvUhxy1wVmSpwlQOaWHjfWdbCFaBibgzU5C-DSs7nzVk8MJUJfZNDDN6gFAs6eLsO180hC-lo34FeTxzeZn97YrImd7J-phmMaUxUV3NiNTNSYmuvDEGs8aRgGQCioitcQTW_z2BK0XDy1QrG4ftoaG2rS9CdNmtLgTb2stvaL1Cvj3uT-S2yiY8-mAh5gWXBmU_NLz1vcERdgGE11OH3qR0NtLw-o6MTvt4y_WL9UOyGs0VGaEnXsxgpTjB75A');"></div>
</div>
</section>
<!-- Upcoming Milestones (Visual Timeline) -->
<section class="space-y-6">
<h3 class="serif-text text-2xl italic px-2">Plan Structure</h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="bg-surface-container-low p-6 rounded-2xl flex items-center gap-4 group">
<div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
<span class="material-symbols-outlined">check_circle</span>
</div>
<div>
<h4 class="font-bold text-sm text-on-surface">The Pentateuch</h4>
<p class="text-xs text-on-surface-variant">Completed on Day 50</p>
</div>
</div>
<div class="bg-surface-container p-6 rounded-2xl flex items-center gap-4 ring-1 ring-primary/20">
<div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
<span class="material-symbols-outlined">auto_stories</span>
</div>
<div>
<h4 class="font-bold text-sm text-on-surface">The Gospels</h4>
<p class="text-xs text-on-surface-variant">Current: Day 87 - 120</p>
</div>
</div>
<div class="bg-surface-container-low p-6 rounded-2xl flex items-center gap-4 opacity-60">
<div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
<span class="material-symbols-outlined">lock</span>
</div>
<div>
<h4 class="font-bold text-sm text-on-surface">Acts &amp; Epistles</h4>
<p class="text-xs text-on-surface-variant">Starts Day 121</p>
</div>
</div>
<div class="bg-surface-container-low p-6 rounded-2xl flex items-center gap-4 opacity-60">
<div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
<span class="material-symbols-outlined">lock</span>
</div>
<div>
<h4 class="font-bold text-sm text-on-surface">Revelation</h4>
<p class="text-xs text-on-surface-variant">Final Section</p>
</div>
</div>
</div>
</section>
<!-- Recent Reflections Section -->
<section class="space-y-8">
<div class="flex justify-between items-baseline px-2">
<h3 class="serif-text text-2xl italic">Recent Reflections</h3>
<a class="text-xs uppercase tracking-widest text-primary font-bold" href="#">View Archive</a>
</div>
<div class="space-y-4">
<!-- Reflection Card 1 -->
<div class="flex gap-6 items-start">
<div class="flex-none pt-2">
<div class="w-1 h-12 bg-[#7a6550] rounded-full"></div> <!-- Spiritual Reflection Marker -->
</div>
<div class="flex-grow bg-surface-container-lowest p-6 rounded-3xl transition-all duration-300 hover:translate-x-1">
<div class="flex justify-between items-center mb-3">
<span class="text-xs font-bold text-primary">Day 86 • John 3:16</span>
<span class="text-[10px] text-on-surface-variant/50 uppercase tracking-widest">Yesterday</span>
</div>
<p class="serif-text text-lg leading-relaxed text-on-surface mb-4">"For God so loved the world, that he gave his only begotten Son..."</p>
<div class="bg-surface-container-low p-4 rounded-xl italic text-on-surface-variant text-sm">
                            Focusing on the depth of 'sacrifice' today. It's not just a word, it's an action that redefines everything.
                        </div>
</div>
</div>
<!-- Reflection Card 2 -->
<div class="flex gap-6 items-start">
<div class="flex-none pt-2">
<div class="w-1 h-12 bg-[#4d6b4a] rounded-full"></div> <!-- Academic Reflection Marker -->
</div>
<div class="flex-grow bg-surface-container-lowest p-6 rounded-3xl transition-all duration-300 hover:translate-x-1">
<div class="flex justify-between items-center mb-3">
<span class="text-xs font-bold text-primary">Day 85 • John 1:1-5</span>
<span class="text-[10px] text-on-surface-variant/50 uppercase tracking-widest">2 Days Ago</span>
</div>
<p class="serif-text text-lg leading-relaxed text-on-surface mb-4">"In the beginning was the Word, and the Word was with God..."</p>
<div class="bg-surface-container-low p-4 rounded-xl italic text-on-surface-variant text-sm">
                            The Greek 'Logos' has so much weight. Exploring the intersection of wisdom and presence.
                        </div>
</div>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#fef9f2]/90 dark:bg-[#32302c]/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(44,33,24,0.04)] rounded-t-[28px]">
<div class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 px-5 py-2 hover:text-[#964407] transition-all duration-300 cursor-pointer">
<span class="material-symbols-outlined mb-1">auto_stories</span>
<span class="font-['Manrope'] text-[11px] font-medium tracking-wide uppercase">Scripture</span>
</div>
<!-- Active Tab: Reflect -->
<div class="flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full px-5 py-2 transition-all duration-300 cursor-pointer">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">self_improvement</span>
<span class="font-['Manrope'] text-[11px] font-medium tracking-wide uppercase">Reflect</span>
</div>
<div class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 px-5 py-2 hover:text-[#964407] transition-all duration-300 cursor-pointer">
<span class="material-symbols-outlined mb-1">event_note</span>
<span class="font-['Manrope'] text-[11px] font-medium tracking-wide uppercase">Plans</span>
</div>
<div class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 px-5 py-2 hover:text-[#964407] transition-all duration-300 cursor-pointer">
<span class="material-symbols-outlined mb-1">menu_book</span>
<span class="font-['Manrope'] text-[11px] font-medium tracking-wide uppercase">Library</span>
</div>
</nav>
</body></html>

<!-- Notifications & Overlays -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;0,700;1,400;1,600&amp;family=Manrope:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-surface-variant": "#554339",
                        "primary-fixed": "#ffdbca",
                        "on-tertiary": "#ffffff",
                        "on-error": "#ffffff",
                        "primary-container": "#b65c21",
                        "surface-container-highest": "#e6e2db",
                        "surface-container-high": "#ece7e1",
                        "secondary-fixed": "#fadec4",
                        "inverse-surface": "#32302c",
                        "tertiary-fixed": "#ffdad8",
                        "tertiary-container": "#b35a59",
                        "tertiary-fixed-dim": "#ffb3b0",
                        "surface-tint": "#99460a",
                        "inverse-primary": "#ffb68e",
                        "on-tertiary-fixed": "#3f0308",
                        "on-surface": "#1d1c18",
                        "error": "#ba1a1a",
                        "surface": "#fef9f2",
                        "on-tertiary-container": "#fffbff",
                        "error-container": "#ffdad6",
                        "primary-fixed-dim": "#ffb68e",
                        "on-primary-fixed-variant": "#773300",
                        "on-secondary-fixed": "#271909",
                        "background": "#fef9f2",
                        "outline": "#887368",
                        "on-error-container": "#93000a",
                        "primary": "#964407",
                        "on-primary": "#ffffff",
                        "on-background": "#1d1c18",
                        "surface-container-low": "#f8f3ec",
                        "surface-dim": "#ded9d3",
                        "surface-container-lowest": "#ffffff",
                        "on-primary-container": "#fffbff",
                        "inverse-on-surface": "#f5f0e9",
                        "tertiary": "#944242",
                        "secondary-fixed-dim": "#dcc2a9",
                        "secondary-container": "#f7dbc1",
                        "secondary": "#6f5b46",
                        "on-secondary": "#ffffff",
                        "on-primary-fixed": "#331200",
                        "on-secondary-container": "#735f4a",
                        "on-secondary-fixed-variant": "#564330",
                        "surface-bright": "#fef9f2",
                        "surface-variant": "#e6e2db",
                        "on-tertiary-fixed-variant": "#792e2f",
                        "outline-variant": "#dbc1b5",
                        "surface-container": "#f2ede6"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1.75rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Newsreader", "serif"],
                        "body": ["Manrope", "sans-serif"],
                        "label": ["Manrope", "sans-serif"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .bg-primary-gradient {
            background: linear-gradient(45deg, #964407, #b65c21);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface font-body selection:bg-primary-fixed">
<!-- Top App Bar -->
<nav class="bg-[#fef9f2]/80 backdrop-blur-xl flex justify-between items-center w-full px-6 h-16 docked full-width top-0 sticky z-40">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-[#964407]">menu</span>
<span class="font-serif italic text-2xl text-[#964407]">Edenify</span>
</div>
<div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden">
<img class="w-full h-full object-cover" data-alt="portrait of a focused man in a linen shirt with soft morning light hitting his face" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALVLo4q64tLGvTrGVdnezTbw3Lg0os7KnYsBQDWokIBroiOAPN2baBQ-A6nbD-Nb9YFw44Lpe_a9PMo6G1uLnz218SjunSW3r0M_ukpzzbj_xDW3Cn_NIfdDfacuWPL9PEayQJhItxOhDp388oXnmakEOv2Sl_NxfwHlIJ4OjZVov6-Uc9iDfYnE6fIndyPxZgtbNnc88qyP3uusxdcM3KaqXQKddH7iUnvS_sdlpBlbVqf3PF6G_tMwDHWdQ9XgCtPrl6q3g3uA"/>
</div>
</nav>
<!-- Main Canvas (Home Screen Midday Background) -->
<main class="min-h-screen px-6 pt-4 pb-32 max-w-2xl mx-auto space-y-8">
<!-- Hero Section -->
<section class="space-y-2 mt-8">
<p class="font-label text-xs uppercase tracking-[0.2em] text-outline">Midday Reflection</p>
<h1 class="font-headline text-4xl font-bold tracking-tight text-on-surface">Stay Disciplined, <br/>Aiden.</h1>
</section>
<!-- Bento Grid Layout for Home Content -->
<div class="grid grid-cols-2 gap-4">
<!-- Spiritual Pillar Card -->
<div class="col-span-2 bg-surface-container-low p-6 rounded-2xl relative overflow-hidden group">
<div class="absolute top-0 left-0 w-1 h-full bg-[#7a6550]"></div>
<div class="flex justify-between items-start">
<div class="space-y-4">
<span class="material-symbols-outlined text-[#7a6550]" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
<div>
<h3 class="font-headline text-xl italic">The Path of Stillness</h3>
<p class="text-sm text-on-surface-variant">4 of 7 Daily Disciplines completed</p>
</div>
</div>
<div class="bg-surface-container-lowest p-3 rounded-full shadow-sm">
<span class="material-symbols-outlined text-primary">play_arrow</span>
</div>
</div>
</div>
<!-- Focus Card -->
<div class="bg-surface-container-low p-6 rounded-2xl space-y-4">
<span class="material-symbols-outlined text-outline">timer</span>
<h4 class="font-headline text-lg italic">Deep Work</h4>
<div class="h-1 w-full bg-surface-variant rounded-full overflow-hidden">
<div class="h-full bg-primary w-2/3"></div>
</div>
</div>
<!-- Stats Card -->
<div class="bg-surface-container-lowest p-6 rounded-2xl space-y-4 shadow-[0_12px_32px_rgba(44,33,24,0.04)]">
<span class="material-symbols-outlined text-[#4d6b4a]">import_contacts</span>
<h4 class="font-headline text-lg italic">Knowledge</h4>
<p class="text-3xl font-bold text-on-surface">12 <span class="text-sm font-normal text-outline">pgs</span></p>
</div>
</div>
<!-- Overlay & Notification Layer -->
<div class="fixed inset-0 pointer-events-none z-50 flex flex-col items-center pt-20 px-4 space-y-4">
<!-- Floating In-App Toast -->
<div class="pointer-events-auto bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-fade-in transform transition-all hover:scale-105">
<div class="w-6 h-6 rounded-full bg-primary-gradient flex items-center justify-center">
<span class="material-symbols-outlined text-[14px] text-white" style="font-variation-settings: 'FILL' 1;">spa</span>
</div>
<span class="font-label text-sm font-medium tracking-wide">Task saved to Physical layer.</span>
</div>
<!-- System Notification Stack (iOS/Android Style in Sahara Aesthetic) -->
<div class="w-full max-w-sm pointer-events-auto flex flex-col gap-2 pt-12">
<!-- Notification 1: Task Alarm -->
<div class="bg-surface-container-lowest/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_24px_rgba(44,33,24,0.08)] flex items-start gap-4 border-l-4 border-[#7a6550]">
<div class="bg-surface-container-high p-2 rounded-xl">
<span class="material-symbols-outlined text-[#7a6550]">notifications_active</span>
</div>
<div class="flex-1">
<div class="flex justify-between items-center mb-1">
<span class="font-label text-[10px] uppercase tracking-widest text-outline">Task Alarm</span>
<span class="font-label text-[10px] text-outline">Now</span>
</div>
<p class="font-headline text-md italic font-semibold text-on-surface leading-tight">Morning Prayer</p>
<p class="text-xs text-on-surface-variant mt-1">Time for your scheduled spiritual alignment.</p>
</div>
</div>
<!-- Notification 2: Daily Scripture -->
<div class="bg-surface-container-lowest/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_24px_rgba(44,33,24,0.08)] flex items-start gap-4 border-l-4 border-[#4d6b4a]">
<div class="bg-surface-container-high p-2 rounded-xl">
<span class="material-symbols-outlined text-[#4d6b4a]">menu_book</span>
</div>
<div class="flex-1">
<div class="flex justify-between items-center mb-1">
<span class="font-label text-[10px] uppercase tracking-widest text-outline">Daily Scripture</span>
<span class="font-label text-[10px] text-outline">12m ago</span>
</div>
<p class="font-headline text-md italic font-semibold text-on-surface leading-tight">Day 87: Wisdom's Call</p>
<p class="text-xs text-on-surface-variant mt-1">Your reading for today is ready to be reflected upon.</p>
</div>
</div>
<!-- Notification 3: Streak Protection -->
<div class="bg-surface-container-lowest/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_24px_rgba(44,33,24,0.08)] flex items-start gap-4 border-l-4 border-[#8c3c3c]">
<div class="bg-surface-container-high p-2 rounded-xl">
<span class="material-symbols-outlined text-[#8c3c3c]">bolt</span>
</div>
<div class="flex-1">
<div class="flex justify-between items-center mb-1">
<span class="font-label text-[10px] uppercase tracking-widest text-outline">Streak Protection Alert</span>
<span class="font-label text-[10px] text-outline">2h ago</span>
</div>
<p class="font-headline text-md italic font-semibold text-on-surface leading-tight">Protect your streak</p>
<p class="text-xs text-on-surface-variant mt-1">Complete one more action to maintain your 42-day discipline.</p>
</div>
</div>
</div>
</div>
</main>
<!-- Bottom Navigation Bar -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-[#fef9f2]/90 backdrop-blur-md shadow-[0_-12px_32px_rgba(44,33,24,0.06)] rounded-t-[28px]">
<div class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:opacity-80 transition-all duration-200 ease-in-out scale-90">
<span class="material-symbols-outlined mb-1">auto_stories</span>
<span class="font-sans text-[10px] uppercase tracking-widest Manrope">Reflect</span>
</div>
<div class="flex flex-col items-center justify-center bg-[#f8f3ec] text-[#964407] rounded-full p-3 hover:opacity-80 transition-all duration-200 ease-in-out scale-90">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">timer</span>
<span class="font-sans text-[10px] uppercase tracking-widest Manrope">Focus</span>
</div>
<div class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:opacity-80 transition-all duration-200 ease-in-out scale-90">
<span class="material-symbols-outlined mb-1">import_contacts</span>
<span class="font-sans text-[10px] uppercase tracking-widest Manrope">Growth</span>
</div>
<div class="flex flex-col items-center justify-center text-[#7a6550] p-3 hover:opacity-80 transition-all duration-200 ease-in-out scale-90">
<span class="material-symbols-outlined mb-1">person</span>
<span class="font-sans text-[10px] uppercase tracking-widest Manrope">Profile</span>
</div>
</nav>
</body></html>

<!-- Academic Layer Detail -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Academic Layer Detail - Edenify</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface-container": "#f2ede6",
                    "secondary-fixed-dim": "#dcc2a9",
                    "secondary-container": "#f7dbc1",
                    "on-error-container": "#93000a",
                    "error": "#ba1a1a",
                    "outline": "#887368",
                    "on-primary": "#ffffff",
                    "background": "#fef9f2",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "secondary": "#6f5b46",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "on-secondary-fixed-variant": "#564330",
                    "primary-container": "#b65c21",
                    "inverse-on-surface": "#f5f0e9",
                    "secondary-fixed": "#fadec4",
                    "tertiary-fixed": "#ffdad8",
                    "tertiary-container": "#b35a59",
                    "inverse-surface": "#32302c",
                    "outline-variant": "#dbc1b5",
                    "on-error": "#ffffff",
                    "on-background": "#1d1c18",
                    "surface": "#fef9f2",
                    "on-tertiary": "#ffffff",
                    "surface-bright": "#fef9f2",
                    "surface-container-lowest": "#ffffff",
                    "primary-fixed-dim": "#ffb68e",
                    "surface-tint": "#99460a",
                    "on-secondary": "#ffffff",
                    "tertiary": "#944242",
                    "on-surface-variant": "#554339",
                    "primary": "#964407",
                    "surface-container-high": "#ece7e1",
                    "on-primary-fixed-variant": "#773300",
                    "surface-dim": "#ded9d3",
                    "on-primary-container": "#fffbff",
                    "on-tertiary-container": "#fffbff",
                    "on-surface": "#1d1c18",
                    "surface-variant": "#e6e2db",
                    "on-primary-fixed": "#331200",
                    "on-tertiary-fixed": "#3f0308",
                    "surface-container-low": "#f8f3ec",
                    "on-secondary-container": "#735f4a",
                    "primary-fixed": "#ffdbca",
                    "inverse-primary": "#ffb68e",
                    "surface-container-highest": "#e6e2db",
                    "on-secondary-fixed": "#271909",
                    "error-container": "#ffdad6"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"],
                    "serif": ["EB Garamond", "serif"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .academic-bg { background-color: #edf0e8; }
        .academic-accent { color: #4d6b4a; }
        .academic-fill { background-color: #4d6b4a; }
        .academic-border { border-color: rgba(77, 107, 74, 0.15); }
        .academic-gradient { background: linear-gradient(135deg, #4d6b4a 0%, #637d60 100%); }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface font-body text-on-surface selection:bg-secondary-container">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-[#fef9f2]/80 dark:bg-[#32302c]/80 backdrop-blur-md flex justify-between items-center px-6 h-16 w-full">
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-on-surface-variant cursor-pointer">arrow_back</span>
<h1 class="text-2xl font-serif italic tracking-tight text-[#964407] dark:text-[#c2652a]">Edenify</h1>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-[#1d1c18]/60 hover:opacity-80 transition-opacity cursor-pointer" data-icon="settings">settings</span>
<div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden">
<img alt="User Profile" class="w-full h-full object-cover" data-alt="minimalist avatar of a scholar wearing glasses with a soft neutral background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbXkhFqSWCNPh_mFpNUbV4SJI-PjNYl8VU5fxcN6rBN6qNJG2cx6eH125kDq2-HTQGA9dvnYVJyLaHHA22XTlsr3EClMx-DmnL78JGVcdK0080TXYnyoOdyJ251ETdpXqi1wWObBq1QsriCd1HWQchMqa2dwho_25N8KIdfU3ivDBTFZXlOFHR3H2aV7Ng87W8ShyEApfz0I_GHdvqe1AvbAuWqx2s0W6DvXS1YYjJ8BxBxbNrUUB5yQAnW5zsQzfbHSoq4qOc2g"/>
</div>
</div>
</header>
<main class="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-12">
<!-- Header & Level Section -->
<section class="space-y-8">
<div class="flex justify-between items-end">
<div>
<span class="font-serif italic text-lg academic-accent opacity-80 block mb-1">Pillar II</span>
<h2 class="text-5xl font-serif font-bold tracking-tight">Academic</h2>
</div>
<div class="text-right">
<span class="text-sm font-label uppercase tracking-widest opacity-60">Mastery</span>
<p class="text-4xl font-serif italic academic-accent">Level 8</p>
</div>
</div>
<!-- XP Bar -->
<div class="space-y-3">
<div class="flex justify-between text-xs font-label uppercase tracking-tighter opacity-70 px-1">
<span>Knowledge Acquisition</span>
<span>4,100 / 5,000 XP</span>
</div>
<div class="h-3 w-full bg-surface-container rounded-full overflow-hidden">
<div class="h-full academic-fill transition-all duration-1000 ease-out" style="width: 82%;"></div>
</div>
</div>
</section>
<!-- Eden Insight (Asymmetric Bento Style) -->
<section>
<div class="academic-bg rounded-[32px] p-8 relative overflow-hidden">
<div class="relative z-10 space-y-4">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined academic-accent" style="font-variation-settings: 'FILL' 1;">lightbulb</span>
<span class="text-xs font-label uppercase tracking-widest academic-accent font-bold">Eden Insight</span>
</div>
<p class="font-serif text-2xl leading-snug text-on-surface italic">
                        "Your cognitive peak occurs between 9:00 AM and 11:30 AM. Shield this time for Deep Work to accelerate your level 9 progression."
                    </p>
<div class="pt-4">
<button class="academic-gradient text-white px-6 py-2 rounded-full text-sm font-label font-bold flex items-center gap-2 shadow-sm">
                            Optimize Schedule <span class="material-symbols-outlined text-sm">north_east</span>
</button>
</div>
</div>
<!-- Decorative element -->
<div class="absolute -right-12 -bottom-12 opacity-5">
<span class="material-symbols-outlined text-[240px]" data-icon="menu_book">menu_book</span>
</div>
</div>
</section>
<!-- Academic Habits (Horizontal Scroll / Grid) -->
<section class="space-y-6">
<div class="flex justify-between items-baseline px-2">
<h3 class="font-serif text-2xl">Daily Habits</h3>
<span class="text-xs font-label uppercase tracking-widest academic-accent cursor-pointer hover:underline">View All</span>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<!-- Habit 1 -->
<div class="bg-surface-container-low p-6 rounded-[24px] flex items-center justify-between group hover:bg-surface-container-high transition-colors">
<div class="flex items-center gap-4">
<div class="w-12 h-12 academic-bg rounded-2xl flex items-center justify-center academic-accent group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined" data-icon="timer">timer</span>
</div>
<div>
<h4 class="font-bold text-sm">Deep Work</h4>
<p class="text-xs opacity-60">90m focused session</p>
</div>
</div>
<div class="w-8 h-8 rounded-full border-2 border-outline-variant flex items-center justify-center cursor-pointer hover:border-academic-accent transition-colors">
<span class="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity academic-accent">check</span>
</div>
</div>
<!-- Habit 2 -->
<div class="bg-surface-container-low p-6 rounded-[24px] flex items-center justify-between group hover:bg-surface-container-high transition-colors">
<div class="flex items-center gap-4">
<div class="w-12 h-12 academic-bg rounded-2xl flex items-center justify-center academic-accent group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined" data-icon="auto_stories">auto_stories</span>
</div>
<div>
<h4 class="font-bold text-sm">Reading</h4>
<p class="text-xs opacity-60">30 pages minimum</p>
</div>
</div>
<div class="w-8 h-8 rounded-full border-2 border-outline-variant flex items-center justify-center cursor-pointer hover:border-academic-accent transition-colors">
<span class="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity academic-accent">check</span>
</div>
</div>
<!-- Habit 3 -->
<div class="bg-surface-container-low p-6 rounded-[24px] flex items-center justify-between group hover:bg-surface-container-high transition-colors">
<div class="flex items-center gap-4">
<div class="w-12 h-12 academic-bg rounded-2xl flex items-center justify-center academic-accent group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined" data-icon="history_edu">history_edu</span>
</div>
<div>
<h4 class="font-bold text-sm">Journaling</h4>
<p class="text-xs opacity-60">Synthesis of learnings</p>
</div>
</div>
<div class="w-8 h-8 rounded-full border-2 border-outline-variant flex items-center justify-center cursor-pointer hover:border-academic-accent transition-colors">
<span class="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity academic-accent">check</span>
</div>
</div>
<!-- Habit 4 -->
<div class="bg-surface-container-low p-6 rounded-[24px] flex items-center justify-between group hover:bg-surface-container-high transition-colors">
<div class="flex items-center gap-4">
<div class="w-12 h-12 academic-bg rounded-2xl flex items-center justify-center academic-accent group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined" data-icon="school">school</span>
</div>
<div>
<h4 class="font-bold text-sm">Language</h4>
<p class="text-xs opacity-60">15m practice</p>
</div>
</div>
<div class="w-8 h-8 rounded-full border-2 border-outline-variant flex items-center justify-center cursor-pointer hover:border-academic-accent transition-colors">
<span class="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity academic-accent">check</span>
</div>
</div>
</div>
</section>
<!-- Academic Tasks (Editorial List Style) -->
<section class="space-y-6 pb-12">
<div class="flex justify-between items-baseline px-2">
<h3 class="font-serif text-2xl text-on-surface">Critical Tasks</h3>
<span class="material-symbols-outlined opacity-40 cursor-pointer">add_circle</span>
</div>
<div class="space-y-4">
<!-- Reflection Marker Used Here -->
<div class="flex gap-4 group">
<div class="w-1 academic-fill rounded-full opacity-40 group-hover:opacity-100 transition-opacity"></div>
<div class="flex-1 pb-4">
<div class="flex justify-between items-start">
<h5 class="font-bold text-on-surface">Dissertation Outline: Chapter 3</h5>
<span class="text-[10px] font-label font-bold uppercase academic-accent py-1 px-2 rounded academic-bg">High Priority</span>
</div>
<p class="text-sm opacity-60 mt-1">Review literature on Sahara nomadism and thermal dynamics.</p>
<div class="flex items-center gap-4 mt-3 text-xs opacity-50 font-label">
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">event</span> May 24</span>
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">bolt</span> 800 XP Reward</span>
</div>
</div>
</div>
<div class="flex gap-4 group">
<div class="w-1 academic-fill rounded-full opacity-20 group-hover:opacity-100 transition-opacity"></div>
<div class="flex-1 pb-4">
<div class="flex justify-between items-start">
<h5 class="font-bold text-on-surface">Archive Research Notes</h5>
<span class="text-[10px] font-label font-bold uppercase opacity-60 py-1 px-2 rounded surface-container">Routine</span>
</div>
<p class="text-sm opacity-60 mt-1">Organize the "Spring 2024" folder with new taxonomy tags.</p>
<div class="flex items-center gap-4 mt-3 text-xs opacity-50 font-label">
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">event</span> May 26</span>
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">bolt</span> 250 XP Reward</span>
</div>
</div>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full z-50 bg-[#fef9f2]/80 dark:bg-[#32302c]/80 backdrop-blur-md flex justify-around items-center px-4 pb-4 pt-2 shadow-[0_-12px_32px_rgba(44,33,24,0.06)] rounded-t-[28px]">
<div class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 p-3 hover:text-[#964407] dark:hover:text-[#c2652a] transition-all cursor-pointer">
<span class="material-symbols-outlined" data-icon="timer">timer</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">Focus</span>
</div>
<div class="flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full p-3 scale-110 shadow-lg cursor-pointer">
<span class="material-symbols-outlined" data-icon="event_note" style="font-variation-settings: 'FILL' 1;">event_note</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">Plan</span>
</div>
<div class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 p-3 hover:text-[#964407] dark:hover:text-[#c2652a] transition-all cursor-pointer">
<span class="material-symbols-outlined" data-icon="menu_book">menu_book</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">Ledger</span>
</div>
<div class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 p-3 hover:text-[#964407] dark:hover:text-[#c2652a] transition-all cursor-pointer">
<span class="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">Vault</span>
</div>
</nav>
</body></html>

<!-- Daily Intentions Planning -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Edenify - Daily Intentions</title>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-container": "#f2ede6",
                        "secondary-fixed-dim": "#dcc2a9",
                        "secondary-container": "#f7dbc1",
                        "on-error-container": "#93000a",
                        "error": "#ba1a1a",
                        "outline": "#887368",
                        "on-primary": "#ffffff",
                        "background": "#fef9f2",
                        "tertiary-fixed-dim": "#ffb3b0",
                        "secondary": "#6f5b46",
                        "on-tertiary-fixed-variant": "#792e2f",
                        "on-secondary-fixed-variant": "#564330",
                        "primary-container": "#b65c21",
                        "inverse-on-surface": "#f5f0e9",
                        "secondary-fixed": "#fadec4",
                        "tertiary-fixed": "#ffdad8",
                        "tertiary-container": "#b35a59",
                        "inverse-surface": "#32302c",
                        "outline-variant": "#dbc1b5",
                        "on-error": "#ffffff",
                        "on-background": "#1d1c18",
                        "surface": "#fef9f2",
                        "on-tertiary": "#ffffff",
                        "surface-bright": "#fef9f2",
                        "surface-container-lowest": "#ffffff",
                        "primary-fixed-dim": "#ffb68e",
                        "surface-tint": "#99460a",
                        "on-secondary": "#ffffff",
                        "tertiary": "#944242",
                        "on-surface-variant": "#554339",
                        "primary": "#964407",
                        "surface-container-high": "#ece7e1",
                        "on-primary-fixed-variant": "#773300",
                        "surface-dim": "#ded9d3",
                        "on-primary-container": "#fffbff",
                        "on-tertiary-container": "#fffbff",
                        "on-surface": "#1d1c18",
                        "surface-variant": "#e6e2db",
                        "on-primary-fixed": "#331200",
                        "on-tertiary-fixed": "#3f0308",
                        "surface-container-low": "#f8f3ec",
                        "on-secondary-container": "#735f4a",
                        "primary-fixed": "#ffdbca",
                        "inverse-primary": "#ffb68e",
                        "surface-container-highest": "#e6e2db",
                        "on-secondary-fixed": "#271909",
                        "error-container": "#ffdad6"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Newsreader", "serif"],
                        "body": ["Manrope", "sans-serif"],
                        "label": ["Manrope", "sans-serif"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
        }
        .text-sienna { color: #c2652a; }
        .bg-sienna { background-color: #c2652a; }
        .font-eb-garamond { font-family: 'EB Garamond', serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-[#faf5ee] text-on-surface font-body min-h-screen selection:bg-secondary-container">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-[#fef9f2]/80 dark:bg-[#32302c]/80 backdrop-blur-md flex justify-between items-center px-6 h-16 w-full">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full overflow-hidden">
<img class="w-full h-full object-cover" data-alt="close-up portrait of a thoughtful person in soft natural lighting, elegant and minimalist aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBCEoTJsHhZsZFZ5XkcosjDHygLx1E56h3yd37KEmBZkmyxAOvP-rShCmdxUi5NZrpzf3SjhqUiKCGeA_q3Yl8ioA-kE9NRPvG_uks2TTxldlt7K0N64TjK2gTmHL_EMIjbHM585EX804Z6iyh8Piv1DRIF5WXcAJ1YoiV0Mxd0qDmKUIeO6rsmEOVjVeAY7Xyec68p2IpRKdZZo8d3CF4VhtCuRVia3R-HAaDNxjYkgxKb5ZRFYz5r75Z7PgW1XEY7s-mmQKFzg"/>
</div>
<span class="text-2xl font-serif text-[#964407] dark:text-[#c2652a] italic tracking-tight">Edenify</span>
</div>
<div class="flex items-center gap-4">
<button class="text-[#1d1c18]/60 hover:opacity-80 transition-opacity">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
</button>
</div>
</header>
<main class="pt-24 pb-32 px-6 max-w-2xl mx-auto">
<!-- Header Section -->
<section class="mb-12">
<h1 class="font-eb-garamond text-5xl font-medium text-on-surface tracking-tight mb-2">Set Your Intentions</h1>
<p class="font-body text-on-surface-variant text-sm opacity-70 tracking-wide uppercase">October 24, The Sacred Ledger</p>
</section>
<!-- Main Intentions Grid -->
<div class="space-y-12">
<!-- Priority A: The Frog -->
<div class="relative">
<div class="flex items-start gap-4 mb-4">
<span class="font-eb-garamond italic text-3xl text-primary opacity-40 select-none">I.</span>
<div class="flex-1">
<label class="block font-label text-[10px] uppercase tracking-[0.2em] text-primary mb-1">The Frog</label>
<input class="w-full bg-transparent border-none border-b-2 border-outline-variant focus:ring-0 focus:border-primary text-xl font-eb-garamond placeholder:text-outline-variant py-2 transition-colors" placeholder="What is your most vital task?" type="text"/>
</div>
</div>
<!-- Category Selector (Reflection Marker Style) -->
<div class="flex gap-2 ml-10 overflow-x-auto no-scrollbar pb-2">
<button class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/15 hover:bg-surface-container-low transition-colors">
<span class="w-2 h-2 rounded-full bg-[#7a6550]"></span>
<span class="text-[11px] font-medium uppercase tracking-wider opacity-60">Spiritual</span>
</button>
<button class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/15 hover:bg-surface-container-low transition-colors">
<span class="w-2 h-2 rounded-full bg-[#4d6b4a]"></span>
<span class="text-[11px] font-medium uppercase tracking-wider opacity-60">Academic</span>
</button>
<button class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/15 hover:bg-surface-container-low transition-colors">
<span class="w-2 h-2 rounded-full bg-[#4a5d6b]"></span>
<span class="text-[11px] font-medium uppercase tracking-wider opacity-60">Financial</span>
</button>
</div>
</div>
<!-- Subsequent Tasks -->
<div class="space-y-10">
<!-- Task II -->
<div class="relative">
<div class="flex items-start gap-4 mb-4">
<span class="font-eb-garamond italic text-2xl text-on-surface-variant opacity-30 select-none">II.</span>
<div class="flex-1">
<label class="block font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Second Focus</label>
<input class="w-full bg-transparent border-none border-b-2 border-outline-variant/30 focus:ring-0 focus:border-primary text-lg font-eb-garamond placeholder:text-outline-variant/60 py-1 transition-colors" placeholder="Enter secondary priority" type="text"/>
</div>
</div>
<div class="flex gap-2 ml-9">
<button class="w-6 h-6 rounded-full bg-[#4d6b4a] ring-2 ring-offset-2 ring-[#4d6b4a]/20"></button>
<button class="w-6 h-6 rounded-full bg-surface-container-high hover:bg-surface-variant transition-colors"></button>
</div>
</div>
<!-- Task III -->
<div class="relative">
<div class="flex items-start gap-4 mb-4">
<span class="font-eb-garamond italic text-2xl text-on-surface-variant opacity-30 select-none">III.</span>
<div class="flex-1">
<label class="block font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Third Focus</label>
<input class="w-full bg-transparent border-none border-b-2 border-outline-variant/30 focus:ring-0 focus:border-primary text-lg font-eb-garamond placeholder:text-outline-variant/60 py-1 transition-colors" placeholder="Enter supporting intention" type="text"/>
</div>
</div>
<div class="flex gap-2 ml-9">
<button class="w-6 h-6 rounded-full bg-[#8c3c3c] ring-2 ring-offset-2 ring-[#8c3c3c]/20"></button>
<button class="w-6 h-6 rounded-full bg-surface-container-high hover:bg-surface-variant transition-colors"></button>
</div>
</div>
</div>
<!-- Notes/Context -->
<div class="mt-16 bg-surface-container-low p-8 rounded-[28px] border border-outline-variant/10">
<div class="flex items-center gap-2 mb-4">
<span class="material-symbols-outlined text-primary scale-75" data-icon="edit_note">edit_note</span>
<h3 class="font-eb-garamond italic text-xl">The Morning Reflection</h3>
</div>
<textarea class="w-full bg-transparent border-none focus:ring-0 text-on-surface-variant font-body text-sm leading-relaxed placeholder:italic" placeholder="Briefly record the spirit of the day..." rows="4"></textarea>
</div>
<!-- Seal Button -->
<div class="flex justify-center pt-8">
<button class="group relative bg-gradient-to-br from-[#964407] to-[#b65c21] text-white px-10 py-4 rounded-full shadow-[0_12px_32px_rgba(150,68,7,0.15)] hover:scale-95 transition-transform duration-300">
<span class="font-label text-sm font-semibold uppercase tracking-[0.2em]">Seal the Ledger</span>
<div class="absolute inset-0 rounded-full border border-white/20 scale-110 group-hover:scale-100 transition-transform duration-300"></div>
</button>
</div>
</div>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-4 pt-2 bg-[#fef9f2]/80 dark:bg-[#32302c]/80 backdrop-blur-md rounded-t-[28px] shadow-[0_-12px_32px_rgba(44,33,24,0.06)] z-50">
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 p-3 scale-90 transition-transform duration-300 hover:text-[#964407]" href="#">
<span class="material-symbols-outlined" data-icon="timer">timer</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">Focus</span>
</a>
<a class="flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full p-3 scale-90 transition-transform duration-300" href="#">
<span class="material-symbols-outlined" data-icon="event_note" style="font-variation-settings: 'FILL' 1;">event_note</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">Plan</span>
</a>
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 p-3 scale-90 transition-transform duration-300 hover:text-[#964407]" href="#">
<span class="material-symbols-outlined" data-icon="menu_book">menu_book</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">Ledger</span>
</a>
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 p-3 scale-90 transition-transform duration-300 hover:text-[#964407]" href="#">
<span class="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">Vault</span>
</a>
</nav>
<!-- Decorative Elements (Sahara Minimalism) -->
<div class="fixed top-0 right-0 -z-10 opacity-10">
<div class="w-96 h-96 bg-primary rounded-full blur-[120px] -mr-48 -mt-48"></div>
</div>
<div class="fixed bottom-0 left-0 -z-10 opacity-5">
<div class="w-64 h-64 bg-secondary rounded-full blur-[100px] -ml-32 -mb-32"></div>
</div>
</body></html>

<!-- Focus Timer Refined -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Edenify - Focus Mode</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400;1,600&amp;family=Manrope:wght@400;500;600;800&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface-container": "#f2ede6",
                    "secondary-fixed-dim": "#dcc2a9",
                    "secondary-container": "#f7dbc1",
                    "on-error-container": "#93000a",
                    "error": "#ba1a1a",
                    "outline": "#887368",
                    "on-primary": "#ffffff",
                    "background": "#fef9f2",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "secondary": "#6f5b46",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "on-secondary-fixed-variant": "#564330",
                    "primary-container": "#b65c21",
                    "inverse-on-surface": "#f5f0e9",
                    "secondary-fixed": "#fadec4",
                    "tertiary-fixed": "#ffdad8",
                    "tertiary-container": "#b35a59",
                    "inverse-surface": "#32302c",
                    "outline-variant": "#dbc1b5",
                    "on-error": "#ffffff",
                    "on-background": "#1d1c18",
                    "surface": "#fef9f2",
                    "on-tertiary": "#ffffff",
                    "surface-bright": "#fef9f2",
                    "surface-container-lowest": "#ffffff",
                    "primary-fixed-dim": "#ffb68e",
                    "surface-tint": "#99460a",
                    "on-secondary": "#ffffff",
                    "tertiary": "#944242",
                    "on-surface-variant": "#554339",
                    "primary": "#964407",
                    "surface-container-high": "#ece7e1",
                    "on-primary-fixed-variant": "#773300",
                    "surface-dim": "#ded9d3",
                    "on-primary-container": "#fffbff",
                    "on-tertiary-container": "#fffbff",
                    "on-surface": "#1d1c18",
                    "surface-variant": "#e6e2db",
                    "on-primary-fixed": "#331200",
                    "on-tertiary-fixed": "#3f0308",
                    "surface-container-low": "#f8f3ec",
                    "on-secondary-container": "#735f4a",
                    "primary-fixed": "#ffdbca",
                    "inverse-primary": "#ffb68e",
                    "surface-container-highest": "#e6e2db",
                    "on-secondary-fixed": "#271909",
                    "error-container": "#ffdad6"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"]
            }
          },
        }
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        body {
            font-family: 'Manrope', sans-serif;
            background-color: #fef9f2; /* From Design System Strategy */
        }
        .serif-italic {
            font-family: 'Newsreader', serif;
            font-style: italic;
        }
        .editorial-shadow {
            box-shadow: 0 12px 32px rgba(44, 33, 24, 0.06);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="text-on-surface antialiased">
<!-- TopAppBar Shell -->
<header class="fixed top-0 w-full z-50 bg-[#fef9f2]/80 dark:bg-[#32302c]/80 backdrop-blur-md flex justify-between items-center px-6 h-16 w-full">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border-2 border-primary-container/20">
<img alt="User" data-alt="minimalist stylized avatar of a professional user with neutral warm tones and simple clean lines" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBESBe9aDHWVwxtC3U1JgQ6Zm0gm8Rwsztt0bMkOtW9mWLnpLSf93sP9kNKCSAPfjVcP_LJjUrqEzZSRs-S2Dq0yMOw-SmJNNsxq_DvIDtM9eeASBMfjusYbsN-u0fLFyS--dXDCO4TlYnbBPxagc2s-BhL7M1eAOJAvcebdBQwwgWuHiG8D9vteTtzFqai81tLtK-cCYjSUFhaLbA6GOsWkli9vz70JhbSdjlGZFWkwwFNt6tULSkjn88xDT-afsiy-ABXL6T-7Q"/>
</div>
<span class="text-2xl font-serif italic tracking-tight text-[#964407] dark:text-[#c2652a]">Edenify</span>
</div>
<button class="text-[#1d1c18]/60 hover:opacity-80 transition-opacity active:scale-95 duration-200">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
</button>
</header>
<main class="pt-24 pb-32 px-6 max-w-lg mx-auto">
<!-- Hero Reflection Section -->
<div class="mb-12 relative">
<div class="absolute -left-4 top-0 h-full w-1 bg-primary rounded-full opacity-20"></div>
<h1 class="font-headline italic text-4xl text-on-surface leading-tight tracking-tight">The Sacred Ledger</h1>
<p class="font-body text-on-surface-variant mt-2 text-lg">A disciplined record of a life lived for a higher purpose.</p>
</div>
<!-- Timer Canvas (Bento Style) -->
<div class="grid grid-cols-1 gap-6">
<!-- Primary Timer Display -->
<section class="bg-surface-container-lowest editorial-shadow rounded-[32px] p-8 text-center relative overflow-hidden">
<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container"></div>
<span class="font-label text-xs uppercase tracking-[0.2em] text-primary mb-4 block">Current Focus</span>
<div class="font-headline italic text-7xl md:text-8xl text-on-surface mb-6 tracking-tighter">
                    25:00
                </div>
<div class="flex justify-center gap-4">
<button class="bg-gradient-to-br from-[#964407] to-[#b65c21] text-white px-10 py-4 rounded-full font-label font-extrabold uppercase tracking-widest text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20">
                        Begin Session
                    </button>
</div>
</section>
<!-- Configuration Bento Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<!-- Focus Duration -->
<div class="bg-surface-container-low rounded-[28px] p-6 flex flex-col justify-between">
<div>
<div class="flex items-center gap-2 mb-1">
<span class="material-symbols-outlined text-primary scale-75" data-icon="timer">timer</span>
<span class="font-label text-[11px] uppercase tracking-wider text-on-surface/60">Focus</span>
</div>
<div class="font-headline italic text-3xl text-on-surface">25 min</div>
</div>
<div class="flex items-center justify-between mt-6 bg-surface-container-lowest/50 rounded-full p-1 border border-outline-variant/15">
<button class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high active:scale-90 transition-all">
<span class="material-symbols-outlined text-primary" data-icon="remove">remove</span>
</button>
<div class="w-1 h-1 rounded-full bg-outline-variant/30"></div>
<button class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high active:scale-90 transition-all">
<span class="material-symbols-outlined text-primary" data-icon="add">add</span>
</button>
</div>
</div>
<!-- Break Duration -->
<div class="bg-surface-container-low rounded-[28px] p-6 flex flex-col justify-between">
<div>
<div class="flex items-center gap-2 mb-1">
<span class="material-symbols-outlined text-secondary scale-75" data-icon="coffee">coffee</span>
<span class="font-label text-[11px] uppercase tracking-wider text-on-surface/60">Short Break</span>
</div>
<div class="font-headline italic text-3xl text-on-surface">5 min</div>
</div>
<div class="flex items-center justify-between mt-6 bg-surface-container-lowest/50 rounded-full p-1 border border-outline-variant/15">
<button class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high active:scale-90 transition-all">
<span class="material-symbols-outlined text-secondary" data-icon="remove">remove</span>
</button>
<div class="w-1 h-1 rounded-full bg-outline-variant/30"></div>
<button class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high active:scale-90 transition-all">
<span class="material-symbols-outlined text-secondary" data-icon="add">add</span>
</button>
</div>
</div>
<!-- Long Break -->
<div class="bg-surface-container-low rounded-[28px] p-6 flex flex-col justify-between md:col-span-2">
<div class="flex justify-between items-start">
<div>
<div class="flex items-center gap-2 mb-1">
<span class="material-symbols-outlined text-tertiary scale-75" data-icon="bedtime">bedtime</span>
<span class="font-label text-[11px] uppercase tracking-wider text-on-surface/60">Long Break</span>
</div>
<div class="font-headline italic text-3xl text-on-surface">15 min</div>
</div>
<div class="flex items-center gap-4 bg-surface-container-lowest/50 rounded-full p-1 border border-outline-variant/15">
<button class="w-12 h-12 rounded-full flex items-center justify-center hover:bg-surface-container-high active:scale-90 transition-all">
<span class="material-symbols-outlined text-tertiary" data-icon="remove">remove</span>
</button>
<span class="w-[1px] h-6 bg-outline-variant/30"></span>
<button class="w-12 h-12 rounded-full flex items-center justify-center hover:bg-surface-container-high active:scale-90 transition-all">
<span class="material-symbols-outlined text-tertiary" data-icon="add">add</span>
</button>
</div>
</div>
</div>
</div>
<!-- Atmosphere Card -->
<div class="bg-surface-container-low rounded-[28px] p-6 flex items-center gap-6 relative overflow-hidden group">
<div class="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden shadow-inner">
<img alt="Soundscape" data-alt="Soft focused detail of an old wooden library desk with dust motes dancing in warm morning sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWmXmD5_A7vTiIKnVmpIBXT8DwrTy5VMC77a4HOsXxv3FosGdH9OldPbUhKVudsQNfOrVVEgzbFUnGO16b9vQTJG-KJ-wjNnomEO5n_YY8QoW2UDTkbWJnOFgNl-eEO-0AV4cHHcL71FTeJbi-vGEeX_PgnN0ZTSRRk6HhwGR8o79O6rpUi8X-AuuZAVIJIxfUhHLasMRQvoX4NsKRG4fUxXmGrFFcyGvC6vZRjnO1bZkFSXkyZ6OWz2bkeCMCBOMf4WDJGrVQPQ"/>
</div>
<div class="flex-grow">
<span class="font-label text-[10px] uppercase tracking-widest text-on-surface/40 mb-1 block">Ambient Soundscape</span>
<h4 class="font-headline text-xl text-on-surface">Desert Monasticism</h4>
<div class="mt-2 flex items-center gap-2">
<div class="h-1 flex-grow bg-outline-variant/20 rounded-full overflow-hidden">
<div class="h-full w-1/3 bg-primary rounded-full"></div>
</div>
<span class="font-label text-[10px] text-on-surface/60">32%</span>
</div>
</div>
<button class="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
<span class="material-symbols-outlined" data-icon="play_arrow" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
</button>
</div>
</div>
</main>
<!-- BottomNavBar Shell -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-4 pt-2 bg-[#fef9f2]/80 dark:bg-[#32302c]/80 backdrop-blur-md z-50 rounded-t-[28px] shadow-[0_-12px_32px_rgba(44,33,24,0.06)]">
<!-- Focus - ACTIVE -->
<a class="flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full p-3 scale-90 transition-transform duration-300" href="#">
<span class="material-symbols-outlined" data-icon="timer" style="font-variation-settings: 'FILL' 1;">timer</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">Focus</span>
</a>
<!-- Plan -->
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 p-3 hover:text-[#964407] dark:hover:text-[#c2652a] scale-90 transition-transform duration-300" href="#">
<span class="material-symbols-outlined" data-icon="event_note">event_note</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">Plan</span>
</a>
<!-- Ledger -->
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 p-3 hover:text-[#964407] dark:hover:text-[#c2652a] scale-90 transition-transform duration-300" href="#">
<span class="material-symbols-outlined" data-icon="menu_book">menu_book</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">Ledger</span>
</a>
<!-- Vault -->
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 p-3 hover:text-[#964407] dark:hover:text-[#c2652a] scale-90 transition-transform duration-300" href="#">
<span class="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider mt-1">Vault</span>
</a>
</nav>
</body></html>

<!-- Financial Layer Detail -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Financial Layer Detail</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "surface-container": "#f2ede6",
                    "secondary-fixed-dim": "#dcc2a9",
                    "secondary-container": "#f7dbc1",
                    "on-error-container": "#93000a",
                    "error": "#ba1a1a",
                    "outline": "#887368",
                    "on-primary": "#ffffff",
                    "background": "#fef9f2",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "secondary": "#6f5b46",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "on-secondary-fixed-variant": "#564330",
                    "primary-container": "#b65c21",
                    "inverse-on-surface": "#f5f0e9",
                    "secondary-fixed": "#fadec4",
                    "tertiary-fixed": "#ffdad8",
                    "tertiary-container": "#b35a59",
                    "inverse-surface": "#32302c",
                    "outline-variant": "#dbc1b5",
                    "on-error": "#ffffff",
                    "on-background": "#1d1c18",
                    "surface": "#fef9f2",
                    "on-tertiary": "#ffffff",
                    "surface-bright": "#fef9f2",
                    "surface-container-lowest": "#ffffff",
                    "primary-fixed-dim": "#ffb68e",
                    "surface-tint": "#99460a",
                    "on-secondary": "#ffffff",
                    "tertiary": "#944242",
                    "on-surface-variant": "#554339",
                    "primary": "#964407",
                    "surface-container-high": "#ece7e1",
                    "on-primary-fixed-variant": "#773300",
                    "surface-dim": "#ded9d3",
                    "on-primary-container": "#fffbff",
                    "on-tertiary-container": "#fffbff",
                    "on-surface": "#1d1c18",
                    "surface-variant": "#e6e2db",
                    "on-primary-fixed": "#331200",
                    "on-tertiary-fixed": "#3f0308",
                    "surface-container-low": "#f8f3ec",
                    "on-secondary-container": "#735f4a",
                    "primary-fixed": "#ffdbca",
                    "inverse-primary": "#ffb68e",
                    "surface-container-highest": "#e6e2db",
                    "on-secondary-fixed": "#271909",
                    "error-container": "#ffdad6"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .financial-accent { color: #4a5d6b; }
        .financial-bg { background-color: #e8ecf0; }
        .financial-border { border-color: rgba(74, 93, 107, 0.15); }
        .reflection-marker { border-left: 3px solid #4a5d6b; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface font-body text-on-surface antialiased">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-[#fef9f2]/80 dark:bg-[#32302c]/80 backdrop-blur-md flex justify-between items-center px-6 h-16 w-full">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-surface-variant cursor-pointer">arrow_back</span>
<h1 class="text-2xl font-headline italic tracking-tight text-[#964407] dark:text-[#c2652a]">Financial</h1>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="settings">settings</span>
<div class="w-8 h-8 rounded-full overflow-hidden bg-surface-container">
<img alt="user profile" class="w-full h-full object-cover" data-alt="close up professional portrait of a person with a serene expression in natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9DTlfEwQsUh8SzWOg5aKgpv2N5uwf8vDyFhDR59X90AoU5rsmkoGUyNRJfAJe7qwOCLMg3JYOzMPCynChme_atRy6Q1ij4ZDZEEZUzRRXn-aLU3bX1zM7vw18aPkhXl49yuAwtNDpSmdS31b23emBrv2zw5iN3QGn9QDuyyFIhhVSBLsuKQpUi8jUCOB6EfbjV06k0I4l8jh-Lnzp84w0UHY5GPuK0jsNQTT8yJlvmP6TfTrDkOAdXBXopD-CAmthLkev1RE0fA"/>
</div>
</div>
</header>
<main class="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-10">
<!-- Hero Section: Progress & Level -->
<section class="space-y-6">
<div class="relative overflow-hidden rounded-[2rem] p-8 financial-bg aspect-[4/3] flex flex-col justify-end group">
<img alt="Financial visualization" class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply transition-transform duration-700 group-hover:scale-110" data-alt="abstract architectural shot of a minimalist marble building with sharp shadows and soft blue sky reflecting discipline and wealth" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFQ9EqbLtBy-lx9ak659MhjvCq-_k8nEnKeAC5ELM_z9_IxYh3SFmKBrfjTrWhWSZFSKuub95EorxZ3zz0WJ_oAMzQcR0f6uE7PZUmFe_NkccllBTsRwWHIZmkqxYwxIhqWINtHa38VNZ6NTilxzKLAa-hvqzBzLB951S47ZYEheFzQJIn3PZ4f2jIrjUyrpsT6Fw2wXAYz5Z9Y1FJHyeELkY1EchdCokq2_CzKtZIQgQjFhKMFowExBvVuvN4_SpWWLR9tr9TDw"/>
<div class="relative z-10 space-y-4">
<div class="flex justify-between items-end">
<div>
<p class="font-label text-[11px] uppercase tracking-[0.2em] opacity-60 mb-1">Current Mastery</p>
<h2 class="text-5xl font-headline font-light italic">Level 3</h2>
</div>
<div class="text-right">
<span class="font-headline text-2xl financial-accent">350</span>
<span class="font-label text-sm opacity-40">/ 1,500 XP</span>
</div>
</div>
<div class="h-1.5 w-full bg-white/30 rounded-full overflow-hidden">
<div class="h-full bg-[#4a5d6b] rounded-full" style="width: 23.3%"></div>
</div>
</div>
</div>
</section>
<!-- Eden Insight -->
<section class="space-y-4">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined financial-accent" data-icon="auto_awesome">auto_awesome</span>
<h3 class="font-headline text-xl italic">Eden Insight</h3>
</div>
<div class="bg-surface-container-low rounded-2xl p-6 reflection-marker">
<p class="font-headline text-lg leading-relaxed text-on-surface-variant">
                    "True financial discipline is not about restriction, but about creating space for what truly matters. Your logging consistency has improved by <span class="financial-accent font-bold">12%</span> this week."
                </p>
</div>
</section>
<!-- Financial Habits -->
<section class="space-y-6">
<div class="flex justify-between items-center">
<h3 class="font-headline text-2xl">Financial Habits</h3>
<span class="text-sm font-label financial-accent font-bold tracking-wider uppercase">View All</span>
</div>
<div class="grid grid-cols-1 gap-4">
<!-- Habit 1 -->
<div class="group p-5 bg-surface-container-lowest rounded-2xl flex items-center justify-between transition-all hover:bg-surface-container-high">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full financial-bg flex items-center justify-center">
<span class="material-symbols-outlined financial-accent" data-icon="edit_note">edit_note</span>
</div>
<div>
<p class="font-headline text-lg">Expense Logging</p>
<p class="text-xs font-label opacity-50 uppercase tracking-widest">Daily • 8:00 PM</p>
</div>
</div>
<div class="flex items-center gap-2">
<div class="flex -space-x-1">
<div class="w-2 h-2 rounded-full bg-[#4a5d6b]"></div>
<div class="w-2 h-2 rounded-full bg-[#4a5d6b]"></div>
<div class="w-2 h-2 rounded-full bg-[#4a5d6b]/20"></div>
</div>
<span class="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">check_circle</span>
</div>
</div>
<!-- Habit 2 -->
<div class="group p-5 bg-surface-container-lowest rounded-2xl flex items-center justify-between transition-all hover:bg-surface-container-high">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full financial-bg flex items-center justify-center">
<span class="material-symbols-outlined financial-accent" data-icon="savings">savings</span>
</div>
<div>
<p class="font-headline text-lg">Weekly Review</p>
<p class="text-xs font-label opacity-50 uppercase tracking-widest">Sunday • Morning</p>
</div>
</div>
<span class="material-symbols-outlined text-outline-variant">radio_button_unchecked</span>
</div>
</div>
</section>
<!-- Financial Tasks -->
<section class="space-y-6">
<h3 class="font-headline text-2xl">Ledger Tasks</h3>
<div class="space-y-3">
<div class="bg-surface-container-low rounded-2xl p-4 flex gap-4 items-start border-l-4 border-transparent hover:border-[#4a5d6b] transition-all">
<span class="material-symbols-outlined mt-1 opacity-30">drag_indicator</span>
<div class="flex-1">
<p class="font-headline text-lg leading-snug">Audit subscription services for Q3</p>
<p class="text-sm opacity-60 mt-1">Due in 2 days • High Priority</p>
</div>
<span class="material-symbols-outlined financial-accent" data-icon="flag" data-weight="fill">flag</span>
</div>
<div class="bg-surface-container-low rounded-2xl p-4 flex gap-4 items-start border-l-4 border-transparent hover:border-[#4a5d6b] transition-all">
<span class="material-symbols-outlined mt-1 opacity-30">drag_indicator</span>
<div class="flex-1">
<p class="font-headline text-lg leading-snug">Transfer $200 to Savings Vault</p>
<p class="text-sm opacity-60 mt-1">Recurring • Monthly</p>
</div>
<span class="material-symbols-outlined opacity-20" data-icon="flag">flag</span>
</div>
</div>
</section>
</main>
<!-- BottomNavBar (Ledger Active) -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-4 pt-2 bg-[#fef9f2]/80 dark:bg-[#32302c]/80 backdrop-blur-md z-50 rounded-t-[28px] shadow-[0_-12px_32px_rgba(44,33,24,0.06)]">
<!-- Focus -->
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 p-3 scale-90 transition-transform duration-300 hover:text-[#964407] dark:hover:text-[#c2652a]" href="#">
<span class="material-symbols-outlined mb-1" data-icon="timer">timer</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider">Focus</span>
</a>
<!-- Plan -->
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 p-3 scale-90 transition-transform duration-300 hover:text-[#964407] dark:hover:text-[#c2652a]" href="#">
<span class="material-symbols-outlined mb-1" data-icon="event_note">event_note</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider">Plan</span>
</a>
<!-- Ledger (Active) -->
<a class="flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full p-3 scale-90 transition-transform duration-300" href="#">
<span class="material-symbols-outlined mb-1" data-icon="menu_book">menu_book</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider">Ledger</span>
</a>
<!-- Vault -->
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 p-3 scale-90 transition-transform duration-300 hover:text-[#964407] dark:hover:text-[#c2652a]" href="#">
<span class="material-symbols-outlined mb-1" data-icon="account_balance_wallet">account_balance_wallet</span>
<span class="font-sans text-[11px] font-medium uppercase tracking-wider">Vault</span>
</a>
</nav>
</body></html>

<!-- Physical Layer Detail -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Edenify - Physical Layer</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
<!-- Icons -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary-fixed": "#3f0308",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "surface-tint": "#99460a",
                    "inverse-primary": "#ffb68e",
                    "tertiary-container": "#b35a59",
                    "tertiary-fixed": "#ffdad8",
                    "inverse-surface": "#32302c",
                    "surface-container-highest": "#e6e2db",
                    "surface-container-high": "#ece7e1",
                    "secondary-fixed": "#fadec4",
                    "primary-container": "#b65c21",
                    "on-tertiary": "#ffffff",
                    "on-error": "#ffffff",
                    "primary-fixed": "#ffdbca",
                    "on-surface-variant": "#554339",
                    "primary": "#964407",
                    "outline": "#887368",
                    "on-error-container": "#93000a",
                    "on-secondary-fixed": "#271909",
                    "background": "#fef9f2",
                    "on-primary-fixed-variant": "#773300",
                    "primary-fixed-dim": "#ffb68e",
                    "error-container": "#ffdad6",
                    "on-tertiary-container": "#fffbff",
                    "surface": "#fef9f2",
                    "on-surface": "#1d1c18",
                    "error": "#ba1a1a",
                    "secondary-fixed-dim": "#dcc2a9",
                    "secondary-container": "#f7dbc1",
                    "tertiary": "#944242",
                    "inverse-on-surface": "#f5f0e9",
                    "on-primary-container": "#fffbff",
                    "surface-dim": "#ded9d3",
                    "surface-container-lowest": "#ffffff",
                    "surface-container-low": "#f8f3ec",
                    "on-background": "#1d1c18",
                    "on-primary": "#ffffff",
                    "surface-container": "#f2ede6",
                    "outline-variant": "#dbc1b5",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "surface-variant": "#e6e2db",
                    "surface-bright": "#fef9f2",
                    "on-secondary-fixed-variant": "#564330",
                    "on-secondary-container": "#735f4a",
                    "on-primary-fixed": "#331200",
                    "on-secondary": "#ffffff",
                    "secondary": "#6f5b46",
                    "accent-physical": "#8c3c3c"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Manrope', sans-serif; }
        h1, h2, h3, .serif-italic { font-family: 'Newsreader', serif; font-style: italic; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background text-on-surface selection:bg-primary-fixed">
<!-- TopAppBar -->
<header class="bg-[#fef9f2]/80 dark:bg-[#1d1c18]/80 backdrop-blur-md fixed top-0 w-full z-50">
<div class="flex justify-between items-center px-6 h-16 w-full max-w-screen-2xl mx-auto">
<div class="flex items-center gap-4">
<button class="text-[#7a6550] hover:opacity-80 transition-opacity">
<span class="material-symbols-outlined">menu</span>
</button>
<span class="font-serif italic text-2xl tracking-tight text-[#964407] dark:text-[#c2652a]">Edenify</span>
</div>
<div class="flex items-center gap-4">
<span class="font-sans font-medium uppercase tracking-wider text-[10px] text-[#7a6550] hidden md:block">Physical Path</span>
<div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant/20">
<img alt="User Profile" data-alt="close-up portrait of a serene man with a soft smile in warm, natural sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEUTFQlbm9gS5eXJMBcrw1FtgzhVqenXndGJxW6X-wU5P1UGllR7xtkM-94Ws8t7R_MugsZFx9Cah3dULVfl27zO3-7tGMPMjvfN95dHth4Prfcx6gKVQb1gghSGWuTPvd_Fx6cE5gX_tbT8yV3AzMdJOqW4L7egrHiuXlw0flLJc5ln4BICNALCt-sqlImK6q7TG_TgX8bTtKLBO-z4HkdZOA6VHMRGX1tR6x7HneuwpCVctZFeJnNiwKl3FQygPnNMfpnA6TFg"/>
</div>
</div>
</div>
</header>
<main class="pt-24 pb-32 px-6 max-w-screen-xl mx-auto">
<!-- Header & XP Tracker -->
<section class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
<div class="max-w-xl">
<h1 class="text-6xl font-serif italic tracking-tight text-on-surface mb-2">Physical</h1>
<p class="text-secondary font-body text-lg leading-relaxed">The body is the vessel for the soul's work. Tend to your strength with discipline and grace.</p>
</div>
<!-- XP Progress Card -->
<div class="w-full md:w-80 bg-surface-container-lowest p-6 rounded-[28px] border-b-2 border-accent-physical/10">
<div class="flex justify-between items-center mb-4">
<span class="font-label font-bold text-xs uppercase tracking-widest text-secondary">Level 14</span>
<span class="font-headline italic text-accent-physical text-lg">Vitality Specialist</span>
</div>
<div class="h-2 w-full bg-surface-container-high rounded-full overflow-hidden mb-2">
<div class="h-full bg-gradient-to-r from-accent-physical to-[#b35a59] w-[72%]"></div>
</div>
<div class="flex justify-between text-[11px] font-label font-semibold text-outline">
<span>1,420 XP</span>
<span>2,000 XP</span>
</div>
</div>
</section>
<!-- Eden Insight Card (Bento Focus) -->
<section class="mb-16">
<div class="relative overflow-hidden rounded-[32px] bg-surface-container-low min-h-[300px] flex items-center">
<div class="absolute inset-0 opacity-10">
<img class="w-full h-full object-cover" data-alt="meditative morning sunlight streaming through a window onto a wooden floor with a yoga mat and soft shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrJ10AwMGgOMT5NLNTArxEP5T_H0NSkP_IanrBhEWfokpbRCpZSA82Sc3gtb9I6wOpuT9ZN-qnnNPno1UFQ1XdhcpMKM_Tg7IRtKxzhSBWr5lWIbbD8caXDDWNPYV12RBOUkw5tgeLrKtks0wTloRi72wx4MomdhtXx-dj43Rzbc1vnaDJUiZh4CPL4WsCl-7CItcwcHPtbywg0M0TV32dWvNSBGGpOGS5gJy_xrK7CuaiG-RdLWnm8U1D1BpwPSJcDfzG0GXFAQ"/>
</div>
<div class="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row gap-12 items-center">
<div class="md:w-1/2">
<div class="flex items-center gap-2 mb-4">
<span class="material-symbols-outlined text-accent-physical">auto_awesome</span>
<span class="font-label uppercase text-[10px] tracking-[0.2em] font-bold text-accent-physical">Eden Insight</span>
</div>
<h2 class="text-4xl text-on-surface mb-6 leading-tight">The Rhythm of Restoration</h2>
<p class="text-secondary leading-relaxed mb-8 font-body">True physical progress is found in the stillness between the strain. Prioritize magnesium-rich greens and 7 hours of deep recovery tonight to optimize your metabolic threshold.</p>
<button class="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded-full font-label font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all">
                            View Plan
                        </button>
</div>
<div class="md:w-1/2 flex justify-center">
<div class="relative group">
<div class="absolute -inset-4 bg-accent-physical/5 rounded-full blur-2xl group-hover:bg-accent-physical/10 transition-all"></div>
<img class="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-[48px] shadow-sm rotate-3 group-hover:rotate-0 transition-transform duration-500" data-alt="a rustic bowl of vibrant green salad with seeds and light drizzled oil on a textured stone surface with warm side lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnP-i-wfDwlEVU32TS14bVBp_Z9tQSMoHzI5UJ_K_Cjlq3Je-Cz8HwI7x97p-T0eTiHdaWFJMmBxLWAIkEH-wOfONGWhl3Vl7HGx4BKlPm4GUPIq9MmpIFhy4nFth2g0FRIZhwTV-w1TP86n9Q_-708JT-1AgCWowkm49TOiWlzUu1kHXyGxE8akzZTD-2WNnlyEY236k79OPYFQv0jmmls9Yv_XSDKXGbideYy0fYDJHjA0RRlsSOygmTYM7BFrCHI3f5MWqk_w"/>
</div>
</div>
</div>
</div>
</section>
<!-- Workout Guides (Asymmetric Grid) -->
<section class="mb-20">
<div class="flex justify-between items-center mb-10">
<h3 class="text-3xl text-on-surface">Workout Guides</h3>
<span class="font-label text-xs font-bold text-accent-physical border-b border-accent-physical/20 pb-1 cursor-pointer">Explore All</span>
</div>
<div class="grid grid-cols-1 md:grid-cols-12 gap-6">
<!-- Large Feature Card -->
<div class="md:col-span-7 bg-surface-container-lowest rounded-[28px] overflow-hidden flex flex-col group border-t-2 border-accent-physical/5">
<div class="h-64 overflow-hidden relative">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="close-up of focused athlete hands lifting heavy dumbbells in a moody gym setting with warm spotlighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKQErgHO8A5Rnc8j4u6Nnb2ZMl1_LfInsxmAKDU8SzvHxQ79wCtv60s5vVuVaFs4Ye52oWiZcGteTllOibwUYU5_rSWqXrSDjecuRAg_aoDBo8Ucw6sdPM92I6oyquy8j-p7EVff9x8xf1MSJGIeiELvPpCvMMfPN8cP8pOUuK6EWajQgqVRttM9henrZfc5zCuSNHd-z54ERYEqBuInONrrGa9D4gwdrl0Wnd0-VfBtOpOOyw_iceCZzNxfuNycinGqudLZsyDA"/>
<div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-accent-physical">60 Mins</div>
</div>
<div class="p-8">
<h4 class="text-2xl font-serif italic mb-3">Full Body Discipline</h4>
<p class="text-secondary text-sm leading-relaxed mb-6">A rigorous sequence designed to challenge endurance and build functional strength across all major muscle chains.</p>
<button class="w-full bg-surface-container-high py-4 rounded-xl font-label font-bold text-[10px] uppercase tracking-widest hover:bg-accent-physical hover:text-white transition-colors duration-300">Start Workout</button>
</div>
</div>
<!-- Vertical Stack Cards -->
<div class="md:col-span-5 flex flex-col gap-6">
<div class="bg-surface-container-low p-6 rounded-[24px] flex items-center gap-6 group hover:bg-surface-container-high transition-colors">
<div class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
<img class="w-full h-full object-cover" data-alt="muscular arms holding gym equipment with warm studio lighting and soft shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG5-9XWCyVbEjxHng_RTHR7XKuK3S2-1FXykZSaWuRYnucJWKdpzKiQhjhWdKugmgl39decj1TzMASQYg7oKM9bfJZjdLodU-_RlH86TAgUMUhoLnfIs8jA3jy8czMrZ9o9BTIU9eL-O1ScOv02RVQJNE0dQYO2FeTn_cPpN-PisjDCYa8mXSkk5QU4SkpZjofXk-jcn8-yF2sOvFQJGgmUSh9yTZncnWoVwgHgL67dbpQDqeuaLtOfXNRv2XbFLLEVgHceAn2kw"/>
</div>
<div class="flex-grow">
<h4 class="font-serif italic text-lg leading-tight mb-1">Upper Body</h4>
<p class="text-outline text-xs line-clamp-2">Sculpt and strengthen arms and chest through controlled tempo.</p>
</div>
<button class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-accent-physical shadow-sm group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-sm">play_arrow</span>
</button>
</div>
<div class="bg-surface-container-low p-6 rounded-[24px] flex items-center gap-6 group hover:bg-surface-container-high transition-colors">
<div class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
<img class="w-full h-full object-cover" data-alt="close up of person doing core exercises on a mat in a bright minimal studio" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKutajJRHrQTl46zs-2yHrzeO5EaTgnYgr_muHLTxdD_z65Vtpcl9cnH72TStxOd2-1QwcTJNKWaxZl_2GkY6U_NfjG1fedIZ0D510abaEOvZF3du7ABy0XH0hc-qo9qo5xZ1p5QgI8D-7dsc-IcYt7SPhUeEwXqZiZoybHUrK5cTUfX6RBZHHGqRV8xhB8ICNVhy1xwa6Kl8yKjaKY3J84JFRDlkE5imIrUaiIkR-rDIHP0PSPR3fqNC2cJrKEc2VzpHdLzk9rA"/>
</div>
<div class="flex-grow">
<h4 class="font-serif italic text-lg leading-tight mb-1">Core (Abs)</h4>
<p class="text-outline text-xs line-clamp-2">Stability and focus for a centered physical foundation.</p>
</div>
<button class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-accent-physical shadow-sm group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-sm">play_arrow</span>
</button>
</div>
<div class="bg-surface-container-low p-6 rounded-[24px] flex items-center gap-6 group hover:bg-surface-container-high transition-colors">
<div class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
<img class="w-full h-full object-cover" data-alt="legs of an athlete mid-stride on a paved path during sunset" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnsHku6g2kzAIqe9cYN63SXWo5cPRaFY1TDxw2HQmkQGex6T9TRH2tFTLArsGb2cyKGBLSUSRD8ttlROG7toqeWuoocF3pDAkk3M4x2NPML1Pjp59g_A__z1jXGn4O0KQOpXggY5faeYHTr-431MsoPUXjbtny3at42cVdt897sL_oMcapkDSlsLO-g56ek7spWLcqsZX7IBJ4AoMxPpB_AAxT71_ZQMuleZtz5AY5vScm53-BdBxmFfsJ8pk4Y0ZydAyUi11SJA"/>
</div>
<div class="flex-grow">
<h4 class="font-serif italic text-lg leading-tight mb-1">Lower Body</h4>
<p class="text-outline text-xs line-clamp-2">Power and mobility for the lower extremities.</p>
</div>
<button class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-accent-physical shadow-sm group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined text-sm">play_arrow</span>
</button>
</div>
</div>
</div>
</section>
<!-- Nutritional Wisdom (Tonal Cards) -->
<section class="mb-20">
<h3 class="text-3xl text-on-surface mb-10">Nutritional Wisdom</h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
<div class="bg-surface-container-low rounded-[28px] p-8 border-l-4 border-accent-physical/30">
<div class="flex items-center gap-4 mb-6">
<span class="material-symbols-outlined text-accent-physical">bolt</span>
<h4 class="text-xl font-serif italic">Pre-Workout Fuel</h4>
</div>
<p class="text-secondary text-sm mb-6">Ignite your metabolism with slow-release carbohydrates and natural stimulants.</p>
<ul class="space-y-3">
<li class="flex items-center gap-3 text-on-surface-variant font-body text-sm">
<span class="w-1.5 h-1.5 rounded-full bg-accent-physical/40"></span>
                            Oats with crushed walnuts
                        </li>
<li class="flex items-center gap-3 text-on-surface-variant font-body text-sm">
<span class="w-1.5 h-1.5 rounded-full bg-accent-physical/40"></span>
                            Green tea or cold-brew espresso
                        </li>
</ul>
</div>
<div class="bg-surface-container-low rounded-[28px] p-8 border-l-4 border-[#4d6b4a]/30">
<div class="flex items-center gap-4 mb-6">
<span class="material-symbols-outlined text-[#4d6b4a]">eco</span>
<h4 class="text-xl font-serif italic">Recovery Greens</h4>
</div>
<p class="text-secondary text-sm mb-6">Repair muscle fibers and reduce inflammation with alkalizing nutrients.</p>
<ul class="space-y-3">
<li class="flex items-center gap-3 text-on-surface-variant font-body text-sm">
<span class="w-1.5 h-1.5 rounded-full bg-[#4d6b4a]/40"></span>
                            Spinach and spirulina smoothie
                        </li>
<li class="flex items-center gap-3 text-on-surface-variant font-body text-sm">
<span class="w-1.5 h-1.5 rounded-full bg-[#4d6b4a]/40"></span>
                            Steamed broccoli with lemon zest
                        </li>
</ul>
</div>
</div>
</section>
<!-- Physical Habits (Minimalist List) -->
<section class="mb-12">
<h3 class="text-3xl text-on-surface mb-8">Physical Habits</h3>
<div class="space-y-4">
<div class="group flex items-center justify-between p-6 bg-surface-container-lowest rounded-2xl transition-all hover:translate-x-1">
<div class="flex items-center gap-6">
<div class="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-accent-physical group-hover:bg-accent-physical/5 transition-colors">
<span class="material-symbols-outlined">align_stretch</span>
</div>
<div>
<span class="font-serif italic text-lg">Morning Stretch</span>
<p class="text-outline text-xs uppercase tracking-tighter">10 Minutes Daily</p>
</div>
</div>
<span class="material-symbols-outlined text-outline-variant group-hover:text-accent-physical transition-colors">check_circle</span>
</div>
<div class="group flex items-center justify-between p-6 bg-surface-container-lowest rounded-2xl transition-all hover:translate-x-1">
<div class="flex items-center gap-6">
<div class="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-accent-physical group-hover:bg-accent-physical/5 transition-colors">
<span class="material-symbols-outlined">directions_walk</span>
</div>
<div>
<span class="font-serif italic text-lg">Evening Walk</span>
<p class="text-outline text-xs uppercase tracking-tighter">30 Minutes Sunset</p>
</div>
</div>
<span class="material-symbols-outlined text-accent-physical">check_circle</span>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#fef9f2]/90 dark:bg-[#1d1c18]/90 backdrop-blur-xl rounded-t-[28px] shadow-[0_-4px_24px_rgba(44,33,24,0.04)]">
<a class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#f8f3ec]/50 p-2 hover:text-[#964407] transition-colors" href="#">
<span class="material-symbols-outlined mb-1">auto_awesome</span>
<span class="font-sans text-[11px] font-semibold tracking-tight">Spiritual</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#f8f3ec]/50 p-2 hover:text-[#964407] transition-colors" href="#">
<span class="material-symbols-outlined mb-1">school</span>
<span class="font-sans text-[11px] font-semibold tracking-tight">Academic</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#f8f3ec]/50 p-2 hover:text-[#964407] transition-colors" href="#">
<span class="material-symbols-outlined mb-1">payments</span>
<span class="font-sans text-[11px] font-semibold tracking-tight">Financial</span>
</a>
<a class="flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full p-3 -translate-y-2 shadow-lg scale-110" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">fitness_center</span>
<span class="font-sans text-[11px] font-semibold tracking-tight mt-1">Physical</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#f8f3ec]/50 p-2 hover:text-[#964407] transition-colors" href="#">
<span class="material-symbols-outlined mb-1">edit_note</span>
<span class="font-sans text-[11px] font-semibold tracking-tight">Journal</span>
</a>
</nav>
</body></html>

<!-- Financial Layer Detail -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Financial Detail - Edenify</title>
<!-- Google Fonts: Newsreader (Serif) & Manrope (Sans) -->
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;0,700;1,400;1,600&amp;family=Manrope:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-tertiary-fixed": "#3f0308",
                        "tertiary-fixed-dim": "#ffb3b0",
                        "surface-tint": "#99460a",
                        "inverse-primary": "#ffb68e",
                        "tertiary-container": "#b35a59",
                        "tertiary-fixed": "#ffdad8",
                        "inverse-surface": "#32302c",
                        "surface-container-highest": "#e6e2db",
                        "surface-container-high": "#ece7e1",
                        "secondary-fixed": "#fadec4",
                        "primary-container": "#b65c21",
                        "on-tertiary": "#ffffff",
                        "on-error": "#ffffff",
                        "primary-fixed": "#ffdbca",
                        "on-surface-variant": "#554339",
                        "primary": "#964407",
                        "outline": "#887368",
                        "on-error-container": "#93000a",
                        "on-secondary-fixed": "#271909",
                        "background": "#fef9f2",
                        "on-primary-fixed-variant": "#773300",
                        "primary-fixed-dim": "#ffb68e",
                        "error-container": "#ffdad6",
                        "on-tertiary-container": "#fffbff",
                        "surface": "#fef9f2",
                        "on-surface": "#1d1c18",
                        "error": "#ba1a1a",
                        "secondary-fixed-dim": "#dcc2a9",
                        "secondary-container": "#f7dbc1",
                        "tertiary": "#944242",
                        "inverse-on-surface": "#f5f0e9",
                        "on-primary-container": "#fffbff",
                        "surface-dim": "#ded9d3",
                        "surface-container-lowest": "#ffffff",
                        "surface-container-low": "#f8f3ec",
                        "on-background": "#1d1c18",
                        "on-primary": "#ffffff",
                        "surface-container": "#f2ede6",
                        "outline-variant": "#dbc1b5",
                        "on-tertiary-fixed-variant": "#792e2f",
                        "surface-variant": "#e6e2db",
                        "surface-bright": "#fef9f2",
                        "on-secondary-fixed-variant": "#564330",
                        "on-secondary-container": "#735f4a",
                        "on-primary-fixed": "#331200",
                        "on-secondary": "#ffffff",
                        "secondary": "#6f5b46",
                        "accent-financial": "#4a5d6b"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Newsreader", "serif"],
                        "body": ["Manrope", "sans-serif"],
                        "label": ["Manrope", "sans-serif"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Manrope', sans-serif; background-color: #fef9f2; }
        .font-serif { font-family: 'Newsreader', serif; }
        .asymmetric-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 2rem;
        }
        @media (max-width: 768px) {
            .asymmetric-grid {
                grid-template-columns: 1fr;
            }
        }
        .reflection-marker {
            border-left: 2px solid #4a5d6b;
            padding-left: 1.5rem;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="text-on-surface selection:bg-secondary-container selection:text-on-secondary-container">
<!-- TopAppBar -->
<nav class="bg-[#fef9f2]/80 dark:bg-[#1d1c18]/80 backdrop-blur-md fixed top-0 w-full z-50">
<div class="flex justify-between items-center px-6 h-16 w-full max-w-screen-2xl mx-auto">
<div class="flex items-center gap-4">
<button class="hover:opacity-80 transition-opacity active:scale-95">
<span class="material-symbols-outlined text-[#964407] dark:text-[#c2652a]" data-icon="arrow_back">arrow_back</span>
</button>
<span class="font-serif italic text-2xl tracking-tight text-[#964407] dark:text-[#c2652a]">Financial</span>
</div>
<div class="flex items-center gap-4">
<span class="font-sans font-medium uppercase tracking-wider text-sm text-[#7a6550] dark:text-[#f8f3ec]/60">Level 14</span>
<div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden">
<img class="w-full h-full object-cover" data-alt="Portrait of a young professional man with a thoughtful expression in soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0PReS6IsESivLi3d64drHxsTb7fvDl3TB5_EyHSYnQhUfgwwwBN33StUjQqPIALVldWDU6qY-JZwQlggZFHxgrOz1AN-_djO08Jner4LyQBV9BhCu82tpT56rjwmQ_muiPg3wOgM68sJBOK6DHJ-mb00yndQDSPxw1g4OFBYiISPo88EhOm4Fd4feQJsUcXHX3Ahz1SOG9k0RH5aPAi1c5KDOR46_vGyteNzbw9EfQiUJoZr0AgtJ6NyEjZWzBlTelCyjuoFCaQ"/>
</div>
</div>
</div>
</nav>
<main class="pt-24 pb-32 px-6 max-w-screen-xl mx-auto">
<!-- Header Section: XP Tracking -->
<section class="mb-12">
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
<div class="max-w-xl">
<h1 class="font-serif text-5xl md:text-6xl italic leading-tight text-on-surface mb-4">Financial Stewardship</h1>
<p class="text-on-surface-variant font-body text-lg leading-relaxed">Cultivating discipline through intentional resource management and strategic growth.</p>
</div>
<div class="flex flex-col items-end gap-2">
<div class="flex items-center gap-3 mb-1">
<span class="font-serif italic text-3xl text-accent-financial">3,450</span>
<span class="font-sans text-sm font-semibold text-outline tracking-widest uppercase">XP TO NEXT LEVEL</span>
</div>
<div class="w-64 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-accent-financial w-[72%] rounded-full"></div>
</div>
</div>
</div>
</section>
<!-- Bento Grid Layout -->
<div class="asymmetric-grid mb-16">
<!-- Left Column: Insight & Planning -->
<div class="space-y-12">
<!-- Eden Insight Card -->
<div class="bg-surface-container-lowest p-8 rounded-3xl reflection-marker relative overflow-hidden">
<div class="absolute -top-12 -right-12 opacity-5">
<span class="material-symbols-outlined text-9xl text-accent-financial" data-icon="payments">payments</span>
</div>
<span class="font-sans text-[11px] font-bold tracking-[0.2em] text-accent-financial uppercase mb-6 block">Eden Insight</span>
<h3 class="font-serif text-3xl italic text-on-surface mb-4">The Discipline of Stewardship</h3>
<p class="text-on-surface-variant font-body leading-relaxed text-lg italic">
                        "Financial freedom is not found in the abundance of possessions, but in the mastery over one's desires. A sacred ledger tracks not just gold, but the integrity of one's discipline."
                    </p>
</div>
<!-- Financial Planning Section -->
<div>
<div class="flex justify-between items-baseline mb-8">
<h2 class="font-serif text-4xl text-on-surface italic">Financial Planning</h2>
<span class="font-sans text-[11px] font-bold text-outline uppercase tracking-widest">3 Active Strategies</span>
</div>
<div class="grid grid-cols-1 md:grid-cols-1 gap-6">
<!-- Monthly Budgeting -->
<div class="group bg-surface-container-low p-6 rounded-2xl flex items-center justify-between hover:bg-surface-container-high transition-all duration-300 cursor-pointer">
<div class="flex items-center gap-6">
<div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm text-accent-financial">
<span class="material-symbols-outlined text-2xl" data-icon="account_balance_wallet">account_balance_wallet</span>
</div>
<div>
<h4 class="font-body font-bold text-on-surface text-lg">Monthly Budgeting</h4>
<p class="text-on-surface-variant text-sm">Reviewing allocations for June</p>
</div>
</div>
<span class="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
</div>
<!-- Savings Vault Strategy -->
<div class="group bg-surface-container-low p-6 rounded-2xl flex items-center justify-between hover:bg-surface-container-high transition-all duration-300 cursor-pointer">
<div class="flex items-center gap-6">
<div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm text-accent-financial">
<span class="material-symbols-outlined text-2xl" data-icon="vault">cached</span>
</div>
<div>
<h4 class="font-body font-bold text-on-surface text-lg">Savings Vault Strategy</h4>
<p class="text-on-surface-variant text-sm">Long-term compound goal: 82% reached</p>
</div>
</div>
<span class="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
</div>
<!-- Debt Elimination -->
<div class="group bg-surface-container-low p-6 rounded-2xl flex items-center justify-between hover:bg-surface-container-high transition-all duration-300 cursor-pointer">
<div class="flex items-center gap-6">
<div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm text-accent-financial">
<span class="material-symbols-outlined text-2xl" data-icon="trending_down">trending_down</span>
</div>
<div>
<h4 class="font-body font-bold text-on-surface text-lg">Debt Elimination</h4>
<p class="text-on-surface-variant text-sm">Snowball method: 2 active targets</p>
</div>
</div>
<span class="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
</div>
</div>
</div>
</div>
<!-- Right Column: Wisdom & Habits -->
<div class="space-y-12">
<!-- Investment Wisdom -->
<div class="bg-inverse-surface text-inverse-on-surface p-8 rounded-3xl">
<h2 class="font-serif text-3xl italic mb-8">Investment Wisdom</h2>
<div class="space-y-6">
<div class="border-b border-white/10 pb-6 last:border-0 last:pb-0">
<h5 class="font-body font-bold text-secondary-fixed mb-2 flex items-center gap-2">
<span class="material-symbols-outlined text-sm" data-icon="auto_awesome">auto_awesome</span>
                                Patience over Speculation
                            </h5>
<p class="text-sm text-surface-dim font-light leading-relaxed">
                                Wealth is a garden that grows by years, not a race won by moments. Focus on broad-market indices and consistent contributions.
                            </p>
</div>
<div class="border-b border-white/10 pb-6 last:border-0 last:pb-0">
<h5 class="font-body font-bold text-secondary-fixed mb-2 flex items-center gap-2">
<span class="material-symbols-outlined text-sm" data-icon="auto_awesome">auto_awesome</span>
                                The Margin Rule
                            </h5>
<p class="text-sm text-surface-dim font-light leading-relaxed">
                                Always maintain a 20% breathing space between your living costs and your income. This is the seed of your future freedom.
                            </p>
</div>
</div>
</div>
<!-- Financial Habits -->
<div class="bg-surface-container-high p-8 rounded-3xl">
<h2 class="font-serif text-3xl italic text-on-surface mb-8">Financial Habits</h2>
<div class="space-y-4">
<div class="flex items-center gap-4 bg-surface p-4 rounded-xl">
<div class="w-6 h-6 rounded border border-outline-variant flex items-center justify-center text-accent-financial">
<span class="material-symbols-outlined text-lg" data-icon="check" style="font-variation-settings: 'FILL' 1;">check</span>
</div>
<div>
<span class="block font-body font-bold text-on-surface">Daily Expense Logging</span>
<span class="block text-[10px] text-outline uppercase tracking-wider">Morning Ritual</span>
</div>
</div>
<div class="flex items-center gap-4 bg-surface p-4 rounded-xl opacity-60">
<div class="w-6 h-6 rounded border border-outline-variant"></div>
<div>
<span class="block font-body font-bold text-on-surface">Weekly Financial Review</span>
<span class="block text-[10px] text-outline uppercase tracking-wider">Sunday Evening</span>
</div>
</div>
<div class="flex items-center gap-4 bg-surface p-4 rounded-xl opacity-60">
<div class="w-6 h-6 rounded border border-outline-variant"></div>
<div>
<span class="block font-body font-bold text-on-surface">Monthly Portfolio Rebalance</span>
<span class="block text-[10px] text-outline uppercase tracking-wider">Last Friday</span>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- Visual Aesthetic Accent: The Sacred Ledger Entry -->
<section class="mt-12 text-center">
<div class="inline-block p-1 bg-surface-container-low rounded-full px-6 py-2 mb-4">
<span class="font-serif italic text-accent-financial">"Stewardship is the intentional cultivation of what you've been given."</span>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#fef9f2]/90 dark:bg-[#1d1c18]/90 backdrop-blur-xl rounded-t-[28px] shadow-[0_-4px_24px_rgba(44,33,24,0.04)]">
<a class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#f8f3ec]/50 p-2 hover:text-[#964407] dark:hover:text-[#c2652a] transition-all duration-300" href="#">
<span class="material-symbols-outlined text-2xl mb-1" data-icon="auto_awesome">auto_awesome</span>
<span class="font-sans text-[11px] font-semibold tracking-tight">Spiritual</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#f8f3ec]/50 p-2 hover:text-[#964407] dark:hover:text-[#c2652a] transition-all duration-300" href="#">
<span class="material-symbols-outlined text-2xl mb-1" data-icon="school">school</span>
<span class="font-sans text-[11px] font-semibold tracking-tight">Academic</span>
</a>
<a class="flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full p-3 -translate-y-2 shadow-lg scale-110 duration-300 ease-out" href="#">
<span class="material-symbols-outlined text-2xl" data-icon="payments" style="font-variation-settings: 'FILL' 1;">payments</span>
<span class="font-sans text-[10px] font-bold mt-0.5">Financial</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#f8f3ec]/50 p-2 hover:text-[#964407] dark:hover:text-[#c2652a] transition-all duration-300" href="#">
<span class="material-symbols-outlined text-2xl mb-1" data-icon="fitness_center">fitness_center</span>
<span class="font-sans text-[11px] font-semibold tracking-tight">Physical</span>
</a>
<a class="flex flex-col items-center justify-center text-[#7a6550] dark:text-[#f8f3ec]/50 p-2 hover:text-[#964407] dark:hover:text-[#c2652a] transition-all duration-300" href="#">
<span class="material-symbols-outlined text-2xl mb-1" data-icon="edit_note">edit_note</span>
<span class="font-sans text-[11px] font-semibold tracking-tight">Journal</span>
</a>
</nav>
<!-- Background Decoration -->
<div class="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
<div class="absolute top-[10%] right-[5%] w-96 h-96 bg-accent-financial/5 blur-[120px] rounded-full"></div>
<div class="absolute bottom-[20%] left-[5%] w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>
</div>
</body></html>

<!-- Quick Add Habit - Details -->
<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;family=Manrope:wght@200..800&amp;family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            font-family: 'Manrope', sans-serif;
            background-color: #fef9f2;
        }
        .serif-text {
            font-family: 'EB Garamond', serif;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-container-lowest": "#ffffff",
                        "primary-fixed-dim": "#ffb68e",
                        "primary": "#964407",
                        "surface-container-high": "#ece7e1",
                        "on-primary-fixed-variant": "#773300",
                        "tertiary": "#944242",
                        "surface-tint": "#99460a",
                        "on-secondary": "#ffffff",
                        "on-surface-variant": "#554339",
                        "on-tertiary-fixed": "#3f0308",
                        "surface-variant": "#e6e2db",
                        "on-primary-fixed": "#331200",
                        "surface-container-low": "#f8f3ec",
                        "surface-dim": "#ded9d3",
                        "on-tertiary-container": "#fffbff",
                        "on-surface": "#1d1c18",
                        "on-primary-container": "#fffbff",
                        "surface-container-highest": "#e6e2db",
                        "on-secondary-fixed": "#271909",
                        "inverse-primary": "#ffb68e",
                        "error-container": "#ffdad6",
                        "on-secondary-container": "#735f4a",
                        "primary-fixed": "#ffdbca",
                        "outline": "#887368",
                        "error": "#ba1a1a",
                        "background": "#fef9f2",
                        "on-primary": "#ffffff",
                        "surface-container": "#f2ede6",
                        "secondary-fixed-dim": "#dcc2a9",
                        "on-error-container": "#93000a",
                        "secondary-container": "#f7dbc1",
                        "on-tertiary-fixed-variant": "#792e2f",
                        "on-secondary-fixed-variant": "#564330",
                        "secondary": "#6f5b46",
                        "primary-container": "#b65c21",
                        "tertiary-fixed-dim": "#ffb3b0",
                        "inverse-surface": "#32302c",
                        "secondary-fixed": "#fadec4",
                        "inverse-on-surface": "#f5f0e9",
                        "tertiary-container": "#b35a59",
                        "tertiary-fixed": "#ffdad8",
                        "surface-bright": "#fef9f2",
                        "outline-variant": "#dbc1b5",
                        "surface": "#fef9f2",
                        "on-tertiary": "#ffffff",
                        "on-error": "#ffffff",
                        "on-background": "#1d1c18"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Newsreader", "EB Garamond", "serif"],
                        "body": ["Manrope", "sans-serif"],
                        "label": ["Manrope", "sans-serif"]
                    }
                }
            }
        }
    </script>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface min-h-screen">
<!-- Background Content (Simulated Home Screen) -->
<div class="fixed inset-0 z-0 p-6 opacity-40 grayscale-[0.2]">
<header class="flex justify-between items-center mb-12">
<div>
<h2 class="serif-text text-3xl font-medium italic tracking-tight">The Ledger</h2>
<p class="text-label text-[12px] uppercase tracking-[0.2em] opacity-60">Monday, October 14</p>
</div>
<div class="w-10 h-10 rounded-full bg-surface-container-high"></div>
</header>
<div class="grid grid-cols-1 gap-6">
<div class="bg-surface-container-low p-8 rounded-xl h-48"></div>
<div class="bg-surface-container-low p-8 rounded-xl h-32"></div>
<div class="bg-surface-container-low p-8 rounded-xl h-32"></div>
</div>
</div>
<!-- Overlay Backdrop -->
<div class="fixed inset-0 z-40 bg-[#1d1c18]/20 backdrop-blur-sm"></div>
<!-- Bottom Sheet Container -->
<div class="fixed inset-x-0 bottom-0 z-50 flex justify-center">
<div class="bg-[#faf5ee] w-full max-w-2xl rounded-t-[28px] shadow-[0_-12px_32px_rgba(44,33,24,0.1)] transition-transform overflow-hidden">
<!-- Drag Handle -->
<div class="flex justify-center py-4">
<div class="w-12 h-1.5 rounded-full bg-outline/30"></div>
</div>
<!-- Header Content -->
<div class="px-8 pb-4 flex justify-between items-center">
<h1 class="serif-text text-4xl font-medium tracking-tight text-on-surface">New Habit</h1>
<button class="text-on-surface-variant hover:opacity-70 transition-opacity">
<span class="material-symbols-outlined">close</span>
</button>
</div>
<div class="px-8 pb-12 space-y-10">
<!-- Input Section -->
<div class="space-y-2">
<label class="text-[11px] font-bold uppercase tracking-[0.15em] text-outline ml-1">Habit Name</label>
<input class="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-outline-variant px-1 py-3 text-xl font-body focus:ring-0 focus:border-primary transition-colors placeholder:text-outline-variant/60" placeholder="Morning Reflection..." type="text"/>
</div>
<!-- Layer Selector -->
<div class="space-y-4">
<div class="flex items-baseline justify-between">
<label class="text-[11px] font-bold uppercase tracking-[0.15em] text-outline ml-1">Pillar Layer</label>
<span class="text-[10px] italic serif-text text-primary">Academic selected</span>
</div>
<div class="flex justify-between items-center bg-surface-container-low/50 p-2 rounded-full">
<!-- Spiritual -->
<button class="flex flex-col items-center justify-center w-[18%] aspect-square rounded-full transition-all hover:bg-surface-container-high group">
<span class="material-symbols-outlined text-[#7a6550]">folded_hands</span>
<span class="text-[9px] font-bold mt-1 uppercase text-[#7a6550] opacity-0 group-hover:opacity-100 transition-opacity">Spiritual</span>
</button>
<!-- Academic (Selected) -->
<button class="flex flex-col items-center justify-center w-[18%] aspect-square rounded-full bg-[#4d6b4a]/10 border border-[#4d6b4a]/20 transition-all">
<span class="material-symbols-outlined text-[#4d6b4a]" style="font-variation-settings: 'FILL' 1;">menu_book</span>
<span class="text-[9px] font-bold mt-1 uppercase text-[#4d6b4a]">Academic</span>
</button>
<!-- Financial -->
<button class="flex flex-col items-center justify-center w-[18%] aspect-square rounded-full transition-all hover:bg-surface-container-high group">
<span class="material-symbols-outlined text-[#4a5d6b]">account_balance_wallet</span>
<span class="text-[9px] font-bold mt-1 uppercase text-[#4a5d6b] opacity-0 group-hover:opacity-100 transition-opacity">Financial</span>
</button>
<!-- Physical -->
<button class="flex flex-col items-center justify-center w-[18%] aspect-square rounded-full transition-all hover:bg-surface-container-high group">
<span class="material-symbols-outlined text-[#8c3c3c]">fitness_center</span>
<span class="text-[9px] font-bold mt-1 uppercase text-[#8c3c3c] opacity-0 group-hover:opacity-100 transition-opacity">Physical</span>
</button>
<!-- General -->
<button class="flex flex-col items-center justify-center w-[18%] aspect-square rounded-full transition-all hover:bg-surface-container-high group">
<span class="material-symbols-outlined text-[#5c4a6b]">category</span>
<span class="text-[9px] font-bold mt-1 uppercase text-[#5c4a6b] opacity-0 group-hover:opacity-100 transition-opacity">General</span>
</button>
</div>
</div>
<!-- Frequency Selector -->
<div class="space-y-4">
<label class="text-[11px] font-bold uppercase tracking-[0.15em] text-outline ml-1">Frequency</label>
<div class="grid grid-cols-3 gap-3">
<button class="py-4 px-2 rounded-xl bg-surface-container-low text-on-surface-variant font-medium text-sm hover:bg-surface-container-high transition-colors">
                            Daily
                        </button>
<button class="py-4 px-2 rounded-xl bg-primary text-on-primary font-medium text-sm shadow-sm">
                            Weekly
                        </button>
<button class="py-4 px-2 rounded-xl bg-surface-container-low text-on-surface-variant font-medium text-sm hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1">
                            Custom <span class="material-symbols-outlined text-[16px]">tune</span>
</button>
</div>
</div>
<!-- Action Button -->
<div class="pt-6">
<button class="w-full py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold tracking-widest uppercase text-sm shadow-[0_8px_24px_rgba(150,68,7,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Next
                    </button>
<p class="text-center mt-6 serif-text italic text-outline text-sm opacity-60">Step 1 of 3: Establishing the focus</p>
</div>
</div>
</div>
</div>
<!-- Hidden bottom nav for context -->
<nav class="fixed bottom-0 left-0 w-full z-10 flex justify-around items-center px-4 pb-6 pt-2 bg-surface-container-low/20 backdrop-blur-md">
<div class="flex flex-col items-center justify-center opacity-40">
<span class="material-symbols-outlined">menu_book</span>
<span class="text-[11px] font-medium mt-1">Ledger</span>
</div>
<div class="flex flex-col items-center justify-center opacity-40">
<span class="material-symbols-outlined">auto_stories</span>
<span class="text-[11px] font-medium mt-1">Grow</span>
</div>
<div class="flex flex-col items-center justify-center opacity-40">
<span class="material-symbols-outlined">brightness_5</span>
<span class="text-[11px] font-medium mt-1">Rituals</span>
</div>
<div class="flex flex-col items-center justify-center opacity-40">
<span class="material-symbols-outlined">person</span>
<span class="text-[11px] font-medium mt-1">Profile</span>
</div>
</nav>
</body></html>

<!-- Quick Add Habit - Frequency -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&amp;family=Manrope:wght@200..800&amp;family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-container-lowest": "#ffffff",
                        "primary-fixed-dim": "#ffb68e",
                        "primary": "#964407",
                        "surface-container-high": "#ece7e1",
                        "on-primary-fixed-variant": "#773300",
                        "tertiary": "#944242",
                        "surface-tint": "#99460a",
                        "on-secondary": "#ffffff",
                        "on-surface-variant": "#554339",
                        "on-tertiary-fixed": "#3f0308",
                        "surface-variant": "#e6e2db",
                        "on-primary-fixed": "#331200",
                        "surface-container-low": "#f8f3ec",
                        "surface-dim": "#ded9d3",
                        "on-tertiary-container": "#fffbff",
                        "on-surface": "#1d1c18",
                        "on-primary-container": "#fffbff",
                        "surface-container-highest": "#e6e2db",
                        "on-secondary-fixed": "#271909",
                        "inverse-primary": "#ffb68e",
                        "error-container": "#ffdad6",
                        "on-secondary-container": "#735f4a",
                        "primary-fixed": "#ffdbca",
                        "outline": "#887368",
                        "error": "#ba1a1a",
                        "background": "#fef9f2",
                        "on-primary": "#ffffff",
                        "surface-container": "#f2ede6",
                        "secondary-fixed-dim": "#dcc2a9",
                        "on-error-container": "#93000a",
                        "secondary-container": "#f7dbc1",
                        "on-tertiary-fixed-variant": "#792e2f",
                        "on-secondary-fixed-variant": "#564330",
                        "secondary": "#6f5b46",
                        "primary-container": "#b65c21",
                        "tertiary-fixed-dim": "#ffb3b0",
                        "inverse-surface": "#32302c",
                        "secondary-fixed": "#fadec4",
                        "inverse-on-surface": "#f5f0e9",
                        "tertiary-container": "#b35a59",
                        "tertiary-fixed": "#ffdad8",
                        "surface-bright": "#fef9f2",
                        "outline-variant": "#dbc1b5",
                        "surface": "#fef9f2",
                        "on-tertiary": "#ffffff",
                        "on-error": "#ffffff",
                        "on-background": "#1d1c18"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1.75rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["EB Garamond", "serif"],
                        "display": ["Newsreader", "serif"],
                        "body": ["Manrope", "sans-serif"],
                        "label": ["Manrope", "sans-serif"]
                    }
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            font-family: 'Manrope', sans-serif;
            background-color: #fef9f2;
            color: #1d1c18;
        }
        .serif-text {
            font-family: 'EB Garamond', serif;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="min-h-screen flex flex-col items-center">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-[#fef9f2]/80 dark:bg-[#1d1c18]/80 backdrop-blur-md flex justify-between items-center px-6 py-4 w-full">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[#7a6550]">close</span>
<span class="text-xl serif-text font-serif text-[#1d1c18] tracking-tight">New Intent</span>
</div>
<button class="text-[#c2652a] font-semibold hover:opacity-70 transition-opacity">Save</button>
</header>
<!-- Main Content Canvas -->
<main class="w-full max-w-xl px-6 pt-24 pb-32 flex flex-col gap-10">
<!-- Header Section -->
<header class="flex flex-col gap-2">
<h1 class="text-5xl serif-text text-on-surface tracking-tight leading-none">Set Frequency</h1>
<p class="font-body text-on-surface-variant max-w-[280px] leading-relaxed">Define the rhythm of your discipline.</p>
</header>
<!-- Frequency Selection (Daily/Weekly) -->
<section class="flex flex-col gap-6">
<!-- Daily Option Card -->
<div class="bg-surface-container-low p-6 rounded-2xl flex flex-col gap-2 cursor-pointer hover:bg-surface-container transition-colors group relative overflow-hidden">
<div class="absolute left-0 top-0 bottom-0 w-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
<div class="flex justify-between items-center">
<h3 class="serif-text text-2xl font-medium">Daily</h3>
<div class="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center bg-primary">
<span class="material-symbols-outlined text-white text-[16px]" style="font-variation-settings: 'FILL' 1;">check</span>
</div>
</div>
<p class="font-body text-sm text-on-surface-variant">This habit will repeat every day</p>
</div>
<!-- Weekly Option Card (Expanded State Concept) -->
<div class="bg-surface-container-low p-6 rounded-2xl flex flex-col gap-5 transition-colors border border-outline-variant/10">
<div class="flex justify-between items-center">
<h3 class="serif-text text-2xl font-medium">Weekly</h3>
<div class="w-6 h-6 rounded-full border-2 border-outline-variant cursor-pointer"></div>
</div>
<div class="flex justify-between items-center gap-2">
<div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold bg-surface-variant text-on-surface-variant">M</div>
<div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold bg-surface-variant text-on-surface-variant">T</div>
<div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold bg-surface-variant text-on-surface-variant">W</div>
<div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold bg-surface-variant text-on-surface-variant">T</div>
<div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold bg-surface-variant text-on-surface-variant">F</div>
<div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold bg-surface-variant text-on-surface-variant">S</div>
<div class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold bg-surface-variant text-on-surface-variant">S</div>
</div>
</div>
</section>
<!-- Time of Day Section -->
<section class="flex flex-col gap-4">
<h4 class="font-body text-xs font-bold tracking-widest uppercase text-outline">Time of Day</h4>
<!-- Asymmetric Bento-style Grid for Times -->
<div class="grid grid-cols-2 gap-3">
<button class="bg-surface-container-lowest p-5 rounded-2xl text-left border border-outline-variant/15 flex flex-col gap-3 hover:bg-surface-container-high transition-all">
<span class="material-symbols-outlined text-[#7a6550]" data-icon="wb_twilight">wb_twilight</span>
<div>
<div class="font-body font-bold text-sm">Morning</div>
<div class="font-body text-[11px] text-on-surface-variant">Before 11:00 AM</div>
</div>
</button>
<button class="bg-surface-container-lowest p-5 rounded-2xl text-left border border-outline-variant/15 flex flex-col gap-3 hover:bg-surface-container-high transition-all">
<span class="material-symbols-outlined text-[#b65c21]" data-icon="light_mode">light_mode</span>
<div>
<div class="font-body font-bold text-sm">Afternoon</div>
<div class="font-body text-[11px] text-on-surface-variant">12:00 PM – 4:00 PM</div>
</div>
</button>
<button class="bg-surface-container-lowest p-5 rounded-2xl text-left border border-outline-variant/15 flex flex-col gap-3 hover:bg-surface-container-high transition-all">
<span class="material-symbols-outlined text-[#4d6b4a]" data-icon="bedtime">bedtime</span>
<div>
<div class="font-body font-bold text-sm">Evening</div>
<div class="font-body text-[11px] text-on-surface-variant">After 6:00 PM</div>
</div>
</button>
<button class="bg-surface-container-low p-5 rounded-2xl text-left flex flex-col gap-3 justify-center border-2 border-dashed border-outline-variant/20 hover:bg-surface-variant transition-all">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-outline" data-icon="schedule">schedule</span>
<div class="font-body font-bold text-sm">Custom</div>
</div>
</button>
</div>
</section>
<!-- Form Actions -->
<footer class="flex flex-col gap-4 mt-8">
<button class="w-full h-14 bg-gradient-to-tr from-[#964407] to-[#b65c21] text-white rounded-full font-body font-bold text-base shadow-[0_12px_32px_rgba(150,68,7,0.15)] hover:scale-[1.02] transition-transform active:scale-[0.98]">
                Save Habit
            </button>
<button class="w-full py-4 text-[#964407] font-body font-bold text-sm hover:opacity-70 transition-opacity flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-sm">arrow_back</span>
                Back
            </button>
</footer>
</main>
<!-- BottomNavBar (Suppressed as this is a transactional flow) -->
<!-- Exclusion based on task focus: Close/Back flow -->
</body></html>

<!-- Empty State - Offline Error -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "primary-container": "#b65c21",
                    "surface-tint": "#99460a",
                    "on-tertiary-fixed": "#3f0308",
                    "surface-dim": "#ded9d3",
                    "primary-fixed": "#ffdbca",
                    "surface-variant": "#e6e2db",
                    "on-secondary-container": "#735f4a",
                    "on-secondary": "#ffffff",
                    "inverse-primary": "#ffb68e",
                    "on-primary-fixed-variant": "#773300",
                    "outline-variant": "#dbc1b5",
                    "surface-container-highest": "#e6e2db",
                    "on-error": "#ffffff",
                    "on-background": "#1d1c18",
                    "secondary-fixed": "#fadec4",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "on-tertiary-container": "#fffbff",
                    "on-primary-fixed": "#331200",
                    "on-primary": "#ffffff",
                    "secondary-container": "#f7dbc1",
                    "surface-container": "#f2ede6",
                    "on-tertiary": "#ffffff",
                    "outline": "#887368",
                    "on-surface-variant": "#554339",
                    "inverse-on-surface": "#f5f0e9",
                    "secondary": "#6f5b46",
                    "primary-fixed-dim": "#ffb68e",
                    "surface-container-low": "#f8f3ec",
                    "surface-container-high": "#ece7e1",
                    "on-secondary-fixed": "#271909",
                    "tertiary": "#944242",
                    "on-surface": "#1d1c18",
                    "primary": "#964407",
                    "on-secondary-fixed-variant": "#564330",
                    "surface": "#fef9f2",
                    "error": "#ba1a1a",
                    "on-primary-container": "#fffbff",
                    "inverse-surface": "#32302c",
                    "surface-bright": "#fef9f2",
                    "secondary-fixed-dim": "#dcc2a9",
                    "tertiary-fixed": "#ffdad8",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "tertiary-container": "#b35a59",
                    "surface-container-lowest": "#ffffff",
                    "error-container": "#ffdad6",
                    "on-error-container": "#93000a",
                    "background": "#fef9f2"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"]
            }
          },
        },
      }
    </script>
<style>.material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 300, "GRAD" 0, "opsz" 24;
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr
    }
.bg-grain {
    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuCf5VabI3CIeJn7uZknLL3du5BvxNj9x8jLKtxfwti9z1qS1dgSl5vunQwIqTOMXIl90ueayMrueBLgj2OwAeEE9Jy_muI0fkOZGXd8mfe9VtlLqiAKB51hMSAiEZwJR9WKRQwAePK_58dxyKWRCDo-aCPlEaHHi3WdhGgUTBD7lsW6W-vQAd6yoyb7crUbwQCe7ZNcorJMw7i2q70ydFKtpUJBg5vCXlEQezwnmfo5rkmutMEAVbPYMFimR2WL273XNJpbUTgQ8Q);
    opacity: 0.03;
    pointer-events: none
    }</style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface font-body min-h-screen flex flex-col relative overflow-hidden">
<div class="fixed inset-0 bg-grain z-0"></div>
<header class="fixed top-0 w-full z-50 bg-[#fef9f2]/80 backdrop-blur-md flex justify-between items-center px-6 h-16 w-full">
<div class="flex items-center gap-3">
<span class="text-2xl font-headline font-black text-[#1d1c18]">Edenify</span>
</div>
<div class="flex items-center gap-4">
<button class="text-[#1d1c18]/60 hover:opacity-80 transition-opacity active:scale-95">
<span class="material-symbols-outlined text-2xl" data-icon="settings">settings</span>
</button>
</div>
</header>
<main class="flex-grow flex items-center justify-center px-8 z-10">
<div class="max-w-md w-full flex flex-col items-center text-center">
<div class="relative mb-12">
<div class="absolute -inset-8 bg-surface-container-low rounded-full blur-3xl opacity-50"></div>
<div class="relative flex items-center justify-center w-48 h-48">
<svg class="w-32 h-32 text-outline-variant stroke-[0.5] overflow-visible" fill="none" viewbox="0 0 24 24">
<path d="M17.5 19C15.567 19 14 17.433 14 15.5C14 13.567 15.567 12 17.5 12C17.6186 12 17.735 12.006 17.8491 12.0177C18.4239 10.2215 20.0617 9 22 9C24.2091 9 26 10.7909 26 13C26 15.2091 24.2091 17 22 17H17.5" stroke="currentColor" stroke-linecap="round" transform="translate(-10, -5)"></path>
<path class="text-primary" d="M3 21L21 3" stroke="currentColor" stroke-linecap="round" stroke-width="1"></path>
</svg>
<span class="material-symbols-outlined absolute text-6xl text-outline-variant/40 select-none" data-icon="cloud_off" style="font-variation-settings: 'wght' 100;">cloud_off</span>
</div>
</div>
<h1 class="font-headline text-4xl font-bold tracking-tight text-on-surface mb-6">
                You are offline.
            </h1>
<p class="font-body text-on-surface-variant leading-relaxed mb-10 max-w-[280px]">
                Your tasks and habits are saved locally and will sync when you reconnect.
            </p>
<div class="w-full space-y-4">
<button class="w-full py-4 px-8 bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full font-label font-semibold tracking-wide shadow-[0_12_32_rgba(44,33,24,0.06)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-sm" data-icon="refresh">refresh</span>
                    Try Again
                </button>
<button class="w-full py-4 px-8 text-primary font-label font-semibold tracking-wide hover:bg-surface-container-low rounded-full transition-colors active:scale-[0.98]">
                    Go to Offline Ledger
                </button>
</div>
<div class="mt-20">
<div class="flex items-center justify-center gap-2 text-on-surface-variant/50">
<span class="w-8 h-[1px] bg-outline-variant/30"></span>
<span class="font-label text-[11px] uppercase tracking-[0.2em]">Last synced 14 minutes ago</span>
<span class="w-8 h-[1px] bg-outline-variant/30"></span>
</div>
</div>
</div>
</main>
<div class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-6 bg-[#fef9f2]/80 backdrop-blur-md z-50 rounded-t-3xl shadow-[0_-12px_32px_rgba(44,33,24,0.04)]">
<div class="flex flex-col items-center justify-center text-[#1d1c18]/50 px-5 py-1.5 transition-transform duration-300 ease-out active:scale-90">
<span class="material-symbols-outlined mb-1" data-icon="menu_book">menu_book</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase">Ledger</span>
</div>
<div class="flex flex-col items-center justify-center text-[#1d1c18]/50 px-5 py-1.5 transition-transform duration-300 ease-out active:scale-90">
<span class="material-symbols-outlined mb-1" data-icon="layers">layers</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase">Grow</span>
</div>
<div class="flex flex-col items-center justify-center text-[#1d1c18]/50 px-5 py-1.5 transition-transform duration-300 ease-out active:scale-90">
<span class="material-symbols-outlined mb-1" data-icon="spa">spa</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase">Rituals</span>
</div>
<div class="flex flex-col items-center justify-center text-[#1d1c18]/50 px-5 py-1.5 transition-transform duration-300 ease-out active:scale-90">
<span class="material-symbols-outlined mb-1" data-icon="person">person</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase">Profile</span>
</div>
</div>
</body></html>

<!-- Empty State - Eden Agent -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Edenify - Eden Agent</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
<!-- Icons -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "primary-container": "#b65c21",
                      "surface-tint": "#99460a",
                      "on-tertiary-fixed": "#3f0308",
                      "surface-dim": "#ded9d3",
                      "primary-fixed": "#ffdbca",
                      "surface-variant": "#e6e2db",
                      "on-secondary-container": "#735f4a",
                      "on-secondary": "#ffffff",
                      "inverse-primary": "#ffb68e",
                      "on-primary-fixed-variant": "#773300",
                      "outline-variant": "#dbc1b5",
                      "surface-container-highest": "#e6e2db",
                      "on-error": "#ffffff",
                      "on-background": "#1d1c18",
                      "secondary-fixed": "#fadec4",
                      "tertiary-fixed-dim": "#ffb3b0",
                      "on-tertiary-container": "#fffbff",
                      "on-primary-fixed": "#331200",
                      "on-primary": "#ffffff",
                      "secondary-container": "#f7dbc1",
                      "surface-container": "#f2ede6",
                      "on-tertiary": "#ffffff",
                      "outline": "#887368",
                      "on-surface-variant": "#554339",
                      "inverse-on-surface": "#f5f0e9",
                      "secondary": "#6f5b46",
                      "primary-fixed-dim": "#ffb68e",
                      "surface-container-low": "#f8f3ec",
                      "surface-container-high": "#ece7e1",
                      "on-secondary-fixed": "#271909",
                      "tertiary": "#944242",
                      "on-surface": "#1d1c18",
                      "primary": "#964407",
                      "on-secondary-fixed-variant": "#564330",
                      "surface": "#fef9f2",
                      "error": "#ba1a1a",
                      "on-primary-container": "#fffbff",
                      "inverse-surface": "#32302c",
                      "surface-bright": "#fef9f2",
                      "secondary-fixed-dim": "#dcc2a9",
                      "tertiary-fixed": "#ffdad8",
                      "on-tertiary-fixed-variant": "#792e2f",
                      "tertiary-container": "#b35a59",
                      "surface-container-lowest": "#ffffff",
                      "error-container": "#ffdad6",
                      "on-error-container": "#93000a",
                      "background": "#fef9f2"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "fontFamily": {
                      "headline": ["Newsreader", "serif"],
                      "body": ["Manrope", "sans-serif"],
                      "label": ["Manrope", "sans-serif"]
              }
            },
          },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Manrope', sans-serif; }
        h1, h2, h3 { font-family: 'Newsreader', serif; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface min-h-screen flex flex-col">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-[#fef9f2]/80 dark:bg-[#1d1c18]/80 backdrop-blur-md flex justify-between items-center px-6 h-16 w-full">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden">
<img alt="User profile portrait" class="w-full h-full object-cover" data-alt="close-up portrait of a thoughtful man with a soft smile in gentle natural morning sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9zoeD4Opbcn8qi05ovTxKb6zBI8v4ynGGiWcu-Md3IPcyGTJLOHV_ABjJnaXeSW75tS5gJPQTgt8mgjstCYAlOH0yb5TxVnAYPOWLzcKaz2lFP6Roe8Nhi3AA_7F9feQJzrt-VKtCdYO3M8XFxPymLbZVHb3cf749UPsOYJn_UTvW7FReatU6CcmUuLMCAw50AwVQ5-MuwHVUCkolm0THD0l48OXkDFzeD3BDetMQf6XPreuy1_rmwgfhk_NC3CiHjk1vM4XX0w"/>
</div>
<span class="text-2xl font-serif font-black text-[#1d1c18] dark:text-[#fef9f2]">Edenify</span>
</div>
<div class="flex items-center text-[#1d1c18]/60 dark:text-[#fef9f2]/60 hover:opacity-80 transition-opacity scale-95 active:duration-100 cursor-pointer">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
</div>
</header>
<!-- Main Content Canvas -->
<main class="flex-grow flex flex-col items-center justify-center px-8 pt-16 pb-24 max-w-4xl mx-auto w-full">
<!-- Empty State Container (Bento-inspired asymmetry) -->
<div class="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
<!-- Illustration Area -->
<div class="md:col-span-5 flex justify-center md:justify-end order-1 md:order-1">
<div class="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
<!-- Background Tonal Glow -->
<div class="absolute inset-0 bg-primary/5 rounded-full blur-3xl"></div>
<!-- Minimalist Leaf Illustration -->
<svg class="w-32 h-32 text-primary opacity-80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.75" viewbox="0 0 24 24">
<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1.85 9.42A7 7 0 0 1 11 20z"></path>
<path d="M11 20l.5-6"></path>
<path d="M14 14l-3 1"></path>
<path d="M8 17l3-2"></path>
</svg>
</div>
</div>
<!-- Text Content Area -->
<div class="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-2">
<h1 class="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-on-surface tracking-tight mb-4">
                    Eden is ready.
                </h1>
<p class="text-lg md:text-xl text-on-surface-variant max-w-md font-body leading-relaxed mb-10">
                    Ask about your habits, Scripture, or what to focus on today.
                </p>
<!-- Quick Action Pills -->
<div class="flex flex-wrap justify-center md:justify-start gap-3 w-full">
<button class="px-5 py-2.5 rounded-full bg-surface-container-low text-primary text-sm font-semibold border border-[#dbc1b5]/20 hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                        Suggest a reading
                    </button>
<button class="px-5 py-2.5 rounded-full bg-surface-container-low text-primary text-sm font-semibold border border-[#dbc1b5]/20 hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                        Review my habits
                    </button>
<button class="px-5 py-2.5 rounded-full bg-surface-container-low text-primary text-sm font-semibold border border-[#dbc1b5]/20 hover:bg-surface-container-high transition-colors active:scale-95 duration-200">
                        Plan my focus
                    </button>
</div>
</div>
</div>
<!-- Floating Input Field (Mimics a journal entry point) -->
<div class="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-40">
<div class="relative group">
<input class="w-full bg-surface-container-lowest text-on-surface px-6 py-4 rounded-full border-none shadow-[0_12px_32px_rgba(44,33,24,0.06)] focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/40 transition-all" placeholder="Speak with Eden..." type="text"/>
<button class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#964407] to-[#b65c21] text-white active:scale-90 transition-transform">
<span class="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</div>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-6 bg-[#fef9f2]/80 dark:bg-[#1d1c18]/80 backdrop-blur-md rounded-t-3xl shadow-[0_-12px_32px_rgba(44,33,24,0.04)] z-50">
<!-- Ledger -->
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 px-5 py-1.5 transition-transform duration-300 ease-out active:scale-90 hover:text-[#964407]" href="#">
<span class="material-symbols-outlined mb-1" data-icon="menu_book">menu_book</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase">Ledger</span>
</a>
<!-- Grow (Active: Eden Agent is part of the 'Grow' ecosystem) -->
<a class="flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full px-5 py-1.5 transition-transform duration-300 ease-out active:scale-90" href="#">
<span class="material-symbols-outlined mb-1" data-icon="layers" style="font-variation-settings: 'FILL' 1;">layers</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase">Grow</span>
</a>
<!-- Rituals -->
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 px-5 py-1.5 transition-transform duration-300 ease-out active:scale-90 hover:text-[#964407]" href="#">
<span class="material-symbols-outlined mb-1" data-icon="spa">spa</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase">Rituals</span>
</a>
<!-- Profile -->
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 px-5 py-1.5 transition-transform duration-300 ease-out active:scale-90 hover:text-[#964407]" href="#">
<span class="material-symbols-outlined mb-1" data-icon="person">person</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase">Profile</span>
</a>
</nav>
</body></html>

<!-- Empty State - Home Dashboard -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "primary-container": "#b65c21",
                    "surface-tint": "#99460a",
                    "on-tertiary-fixed": "#3f0308",
                    "surface-dim": "#ded9d3",
                    "primary-fixed": "#ffdbca",
                    "surface-variant": "#e6e2db",
                    "on-secondary-container": "#735f4a",
                    "on-secondary": "#ffffff",
                    "inverse-primary": "#ffb68e",
                    "on-primary-fixed-variant": "#773300",
                    "outline-variant": "#dbc1b5",
                    "surface-container-highest": "#e6e2db",
                    "on-error": "#ffffff",
                    "on-background": "#1d1c18",
                    "secondary-fixed": "#fadec4",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "on-tertiary-container": "#fffbff",
                    "on-primary-fixed": "#331200",
                    "on-primary": "#ffffff",
                    "secondary-container": "#f7dbc1",
                    "surface-container": "#f2ede6",
                    "on-tertiary": "#ffffff",
                    "outline": "#887368",
                    "on-surface-variant": "#554339",
                    "inverse-on-surface": "#f5f0e9",
                    "secondary": "#6f5b46",
                    "primary-fixed-dim": "#ffb68e",
                    "surface-container-low": "#f8f3ec",
                    "surface-container-high": "#ece7e1",
                    "on-secondary-fixed": "#271909",
                    "tertiary": "#944242",
                    "on-surface": "#1d1c18",
                    "primary": "#964407",
                    "on-secondary-fixed-variant": "#564330",
                    "surface": "#fef9f2",
                    "error": "#ba1a1a",
                    "on-primary-container": "#fffbff",
                    "inverse-surface": "#32302c",
                    "surface-bright": "#fef9f2",
                    "secondary-fixed-dim": "#dcc2a9",
                    "tertiary-fixed": "#ffdad8",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "tertiary-container": "#b35a59",
                    "surface-container-lowest": "#ffffff",
                    "error-container": "#ffdad6",
                    "on-error-container": "#93000a",
                    "background": "#fef9f2"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Manrope', sans-serif; }
        h1, h2, h3 { font-family: 'Newsreader', serif; }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface min-h-screen selection:bg-primary-container/30">
<!-- TopAppBar -->
<header class="bg-[#fef9f2]/80 dark:bg-[#1d1c18]/80 backdrop-blur-md fixed top-0 w-full z-50">
<div class="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden">
<img alt="User profile portrait" class="w-full h-full object-cover" data-alt="Close up portrait of a serene person in natural warm sunlight with soft focus garden background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLhsxyvPpuzbOEIORw_YiM5TQAR-yP-qLLr76ZPhto9vX9poZhb1RgZ4RoJCRPShkenhe3qHdDBF6KeNfZHHCiqvGJk2gbEmGZvX_-pVxBRWsmnE1QF2WSDl_tzFkomJxhtceWEsaYI_x5gqG1jr_HJlmek0Uw-N-5Gvzq1Kict5FtB87rYBW1-VUJ6yZBn0W34xNZS3XRAgb7yiXji9PPi6o25QDHLmiEME3f9mnmBORE0jJnzrtTc3s1UDsGrLGU2xUC6ZRzvg"/>
</div>
<span class="text-2xl font-serif font-black text-[#1d1c18] dark:text-[#fef9f2]">Edenify</span>
</div>
<div class="flex items-center gap-4">
<button class="hover:opacity-80 transition-opacity scale-95 active:duration-100 text-[#1d1c18]/60 dark:text-[#fef9f2]/60">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
</button>
</div>
</div>
</header>
<!-- Main Content Area -->
<main class="pt-24 pb-32 px-6 flex flex-col items-center justify-center min-h-[751px] max-w-2xl mx-auto">
<!-- Asymmetric Decorative Element -->
<div class="w-full flex justify-end mb-4 opacity-10 pointer-events-none select-none">
<span class="text-[120px] font-serif italic text-primary leading-none -mr-8">Reflect.</span>
</div>
<!-- Empty State Container -->
<div class="flex flex-col items-center text-center space-y-8 animate-in fade-in duration-700">
<!-- Custom Line-art Illustration -->
<div class="relative w-48 h-48 flex items-center justify-center">
<!-- Subtle Gradient Background Glow -->
<div class="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent rounded-full blur-2xl"></div>
<!-- The Empty Circle and Horizontal Line Illustration -->
<svg class="relative z-10" fill="none" height="160" viewbox="0 0 160 160" width="160" xmlns="http://www.w3.org/2000/svg">
<circle class="text-outline-variant/40" cx="80" cy="80" r="70" stroke="currentColor" stroke-width="1.5"></circle>
<line class="text-primary/60" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" x1="40" x2="120" y1="80" y2="80"></line>
<!-- Decorative floating dot for Sahara vibe -->
<circle class="text-primary-container/40" cx="80" cy="30" fill="currentColor" r="2"></circle>
</svg>
</div>
<!-- Content -->
<div class="space-y-4 max-w-sm">
<h1 class="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-surface">
                    Your day is open.
                </h1>
<p class="text-on-surface-variant font-body leading-relaxed">
                    Start with one task. Give this day a direction.
                </p>
</div>
<!-- Action -->
<div class="pt-4">
<button class="group relative px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-label font-semibold tracking-wide flex items-center gap-3 shadow-[0_12px_32px_rgba(150,68,7,0.15)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(150,68,7,0.25)] hover:scale-[1.02] active:scale-95">
<span class="material-symbols-outlined text-[20px]" data-icon="add">add</span>
<span>Add a Task</span>
</button>
</div>
</div>
<!-- Secondary Quote/Insight Card (Bento Style Sub-element) -->
<div class="mt-24 w-full grid grid-cols-1 md:grid-cols-12 gap-6">
<div class="md:col-span-8 bg-surface-container-low p-8 rounded-[2rem] flex flex-col justify-between min-h-[160px]">
<div class="flex items-start gap-1">
<span class="w-1 h-8 bg-tertiary/30 rounded-full"></span>
<p class="text-sm font-label uppercase tracking-[0.2em] text-outline ml-3">Daily Wisdom</p>
</div>
<p class="font-headline italic text-xl text-on-surface-variant max-w-md">
                    "The beginning is the most important part of the work."
                </p>
</div>
<div class="md:col-span-4 bg-surface-container-high p-8 rounded-[2rem] flex flex-col items-center justify-center text-center">
<span class="material-symbols-outlined text-4xl text-primary/40 mb-2" data-icon="light_mode">light_mode</span>
<p class="font-label text-xs uppercase tracking-widest text-on-surface/60">Solar Hour</p>
<p class="font-headline text-2xl font-bold">10:42 AM</p>
</div>
</div>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 left-0 w-full z-50">
<!-- Elevated Navigation Shell -->
<div class="bg-[#fef9f2]/80 dark:bg-[#1d1c18]/80 backdrop-blur-md rounded-t-[28px] shadow-[0_-12px_32px_rgba(44,33,24,0.04)] px-4 pt-3 pb-6 flex justify-around items-center w-full max-w-7xl mx-auto">
<!-- Ledger (Active) -->
<a class="transition-transform duration-300 ease-out active:scale-90 flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full px-5 py-1.5" href="#">
<span class="material-symbols-outlined" data-icon="menu_book" style="font-variation-settings: 'FILL' 1;">menu_book</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase mt-0.5">Ledger</span>
</a>
<!-- Grow -->
<a class="transition-transform duration-300 ease-out active:scale-90 flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 px-5 py-1.5 hover:text-[#964407] dark:hover:text-[#c2652a]" href="#">
<span class="material-symbols-outlined" data-icon="layers">layers</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase mt-0.5">Grow</span>
</a>
<!-- Rituals -->
<a class="transition-transform duration-300 ease-out active:scale-90 flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 px-5 py-1.5 hover:text-[#964407] dark:hover:text-[#c2652a]" href="#">
<span class="material-symbols-outlined" data-icon="spa">spa</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase mt-0.5">Rituals</span>
</a>
<!-- Profile -->
<a class="transition-transform duration-300 ease-out active:scale-90 flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 px-5 py-1.5 hover:text-[#964407] dark:hover:text-[#c2652a]" href="#">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase mt-0.5">Profile</span>
</a>
</div>
</nav>
</body></html>

<!-- Empty State - Habits -->
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Edenify — Layer Detail</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "primary-container": "#b65c21",
                    "surface-tint": "#99460a",
                    "on-tertiary-fixed": "#3f0308",
                    "surface-dim": "#ded9d3",
                    "primary-fixed": "#ffdbca",
                    "surface-variant": "#e6e2db",
                    "on-secondary-container": "#735f4a",
                    "on-secondary": "#ffffff",
                    "inverse-primary": "#ffb68e",
                    "on-primary-fixed-variant": "#773300",
                    "outline-variant": "#dbc1b5",
                    "surface-container-highest": "#e6e2db",
                    "on-error": "#ffffff",
                    "on-background": "#1d1c18",
                    "secondary-fixed": "#fadec4",
                    "tertiary-fixed-dim": "#ffb3b0",
                    "on-tertiary-container": "#fffbff",
                    "on-primary-fixed": "#331200",
                    "on-primary": "#ffffff",
                    "secondary-container": "#f7dbc1",
                    "surface-container": "#f2ede6",
                    "on-tertiary": "#ffffff",
                    "outline": "#887368",
                    "on-surface-variant": "#554339",
                    "inverse-on-surface": "#f5f0e9",
                    "secondary": "#6f5b46",
                    "primary-fixed-dim": "#ffb68e",
                    "surface-container-low": "#f8f3ec",
                    "surface-container-high": "#ece7e1",
                    "on-secondary-fixed": "#271909",
                    "tertiary": "#944242",
                    "on-surface": "#1d1c18",
                    "primary": "#964407",
                    "on-secondary-fixed-variant": "#564330",
                    "surface": "#fef9f2",
                    "error": "#ba1a1a",
                    "on-primary-container": "#fffbff",
                    "inverse-surface": "#32302c",
                    "surface-bright": "#fef9f2",
                    "secondary-fixed-dim": "#dcc2a9",
                    "tertiary-fixed": "#ffdad8",
                    "on-tertiary-fixed-variant": "#792e2f",
                    "tertiary-container": "#b35a59",
                    "surface-container-lowest": "#ffffff",
                    "error-container": "#ffdad6",
                    "on-error-container": "#93000a",
                    "background": "#fef9f2"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader", "serif"],
                    "body": ["Manrope", "sans-serif"],
                    "label": ["Manrope", "sans-serif"]
            }
          },
        },
      }
    </script>
<style>
        body { font-family: 'Manrope', sans-serif; }
        .font-serif { font-family: 'Newsreader', serif; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background text-on-surface min-h-screen">
<header class="fixed top-0 w-full z-50 bg-[#fef9f2]/80 dark:bg-[#1d1c18]/80 backdrop-blur-md flex justify-between items-center px-6 h-16 w-full">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-[#964407] dark:text-[#c2652a] hover:opacity-80 transition-opacity active:duration-100 scale-95 cursor-pointer">arrow_back</span>
<span class="text-2xl font-serif font-black text-[#1d1c18] dark:text-[#fef9f2]">Edenify</span>
</div>
<div class="flex items-center gap-4">
<div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden">
<img alt="User profile portrait" class="w-full h-full object-cover" data-alt="Close up portrait of a calm man with a slight smile in soft natural sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq86G7U_naqrs2NERHSDKbfwhtDP6TVxZ4pDCfAe9VgywPrKXOV-fn_8a01OvaQ-9_KmaI2bOVcvOvnU7qpRHALE4CYY1o4z3B78iaj6_zfYqkF2nmUBa4YOVrX55VMrt0h8AcYKdffu9ltfg5zo1B7TbXCWI0pJ5RsDuntRwma2S7EBu2-IgEc1bB8fCqXK7CQsW5TL0ptZNb9vQZiNaVQ2qLGzNw-T36McvItKBLNCCLvzvMzNCxbkY-95oMCvS9nFmlfEaRgw"/>
</div>
<span class="material-symbols-outlined text-[#964407] dark:text-[#c2652a] hover:opacity-80 transition-opacity active:duration-100 scale-95 cursor-pointer">settings</span>
</div>
</header>
<main class="pt-24 pb-32 px-6 max-w-2xl mx-auto min-h-screen flex flex-col justify-center">
<div class="mb-12 relative">
<div class="absolute -left-4 top-0 w-1 h-12 bg-[#7a6550] rounded-full"></div>
<h1 class="text-4xl font-serif font-bold tracking-tight text-on-surface mb-2">Spiritual Layer</h1>
<p class="font-body text-on-surface-variant/70 italic">Cultivating inner stillness and sacred discipline.</p>
</div>
<div class="bg-surface-container-low rounded-[2rem] p-12 flex flex-col items-center text-center">
<div class="relative w-48 h-48 mb-8 flex items-center justify-center">
<svg class="w-full h-full overflow-visible" viewbox="0 0 100 100">
<path class="text-primary/30" d="M 20 70 A 30 30 0 0 1 80 70" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"></path>
<circle class="text-primary animate-pulse" cx="50" cy="65" fill="currentColor" r="3"></circle>
</svg>
<div class="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent pointer-events-none"></div>
</div>
<h2 class="text-2xl font-serif font-bold text-on-surface mb-3">No habits in this layer yet.</h2>
<p class="font-body text-on-surface-variant max-w-xs mb-10 leading-relaxed">
                Begin with one small habit. Consistency over intensity.
            </p>
<div class="flex flex-col sm:flex-row gap-4 w-full justify-center">
<button class="bg-gradient-to-br from-[#964407] to-[#b65c21] text-white font-label font-semibold py-4 px-8 rounded-full shadow-lg shadow-[#964407]/10 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-sm">add</span>
                    Add a Habit
                </button>
<button class="font-label font-semibold py-4 px-8 rounded-full border border-outline-variant/30 text-primary hover:bg-surface-container-high transition-all active:scale-95 flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-sm">auto_awesome</span>
                    Ask Eden to suggest habits
                </button>
</div>
</div>
<div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 grayscale pointer-events-none">
<div class="bg-surface-container-highest p-6 rounded-2xl">
<div class="flex items-center gap-3 mb-4">
<div class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
<span class="material-symbols-outlined text-primary">book</span>
</div>
<div class="h-4 w-24 bg-on-surface/10 rounded"></div>
</div>
<div class="h-2 w-full bg-on-surface/5 rounded mb-2"></div>
<div class="h-2 w-2/3 bg-on-surface/5 rounded"></div>
</div>
<div class="bg-surface-container-highest p-6 rounded-2xl">
<div class="flex items-center gap-3 mb-4">
<div class="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
<span class="material-symbols-outlined text-primary">self_improvement</span>
</div>
<div class="h-4 w-32 bg-on-surface/10 rounded"></div>
</div>
<div class="h-2 w-full bg-on-surface/5 rounded mb-2"></div>
<div class="h-2 w-1/2 bg-on-surface/5 rounded"></div>
</div>
</div>
</main>
<nav class="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-6 bg-[#fef9f2]/80 dark:bg-[#1d1c18]/80 backdrop-blur-md rounded-t-3xl shadow-[0_-12px_32px_rgba(44,33,24,0.04)] z-50">
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 px-5 py-1.5 transition-transform duration-300 ease-out active:scale-90 hover:text-[#964407]" href="#">
<span class="material-symbols-outlined mb-1">menu_book</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase">Ledger</span>
</a>
<a class="flex flex-col items-center justify-center bg-gradient-to-br from-[#964407] to-[#b65c21] text-white rounded-full px-5 py-1.5 transition-transform duration-300 ease-out active:scale-90" href="#">
<span class="material-symbols-outlined mb-1">layers</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase">Grow</span>
</a>
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 px-5 py-1.5 transition-transform duration-300 ease-out active:scale-90 hover:text-[#964407]" href="#">
<span class="material-symbols-outlined mb-1">spa</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase">Rituals</span>
</a>
<a class="flex flex-col items-center justify-center text-[#1d1c18]/50 dark:text-[#fef9f2]/50 px-5 py-1.5 transition-transform duration-300 ease-out active:scale-90 hover:text-[#964407]" href="#">
<span class="material-symbols-outlined mb-1">person</span>
<span class="font-sans text-[11px] font-semibold tracking-wide uppercase">Profile</span>
</a>
</nav>
</body>
</html>