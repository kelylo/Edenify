# Telegram Standalone Bot

This folder contains an independent Telegram backend bot runtime that is separate from the Edenify PWA server.

## What it does

- Personal todo list per Telegram chat (set, edit, done, remove)
- Timed reminder notifications (5 minutes before due and at due time)
- Layer-based planning (`spiritual`, `academic`, `financial`, `physical`, `general`)
- Priority planning (`A` to `E`) and repeat modes (`once`, `daily`, `weekly`)
- Recurring task roll-forward for daily/weekly tasks
- Tracking dashboard (`/today`, `/track`) and streak tracking
- Daily scripture lookup from Bible reading plan and Bible database
- Specific verse lookup and keyword verse search from Bible database
- Lightweight local JSON storage for bot state

## Commands

- `/set YYYY-MM-DD HH:mm | <task> | <layer> | <priority> | <repeat>`: Set/add task
- `/add YYYY-MM-DD HH:mm | <task> | <layer> | <priority> | <repeat>`: Add task
- `/edit <number> YYYY-MM-DD HH:mm | <new text> | <layer> | <priority> | <repeat>`: Edit task
- `/edit <number> YYYY-MM-DD HH:mm`: Edit due time only
- `/edit <number> | <new text>`: Edit text only
- `/list`: Show tasks
- `/done <number>`: Mark task done
- `/remove <number>` or `/delete <number>`: Remove task
- `/today`: Focused daily summary (today, overdue, top priorities)
- `/track`: Progress and streak dashboard
- `/defaults <layer> <priority> <repeat>`: Set planning defaults for new tasks
- `/scripture`: Show scripture for current journey day
- `/scripture <day>`: Show scripture for a specific plan day
- `/verse <reference|keywords>`: Search the Bible database
- `/find <reference|keywords>`: Alias of `/verse`
- `/help`: Show available commands

Behavior notes:

- On the first command from a chat, the bot starts that chat's scripture journey at Day 1.
- On every command, the bot also sends the current daily scripture for that chat journey.
- Tasks trigger two notifications automatically: 5 minutes before due, and exactly at due time.
- Daily/weekly repeat tasks roll forward to the next due date when marked done.

## Setup

1. Open this folder in terminal:
   - `cd telegram-standalone`
2. Install dependencies:
   - `npm install`
3. Create environment file:
   - Copy `.env.example` to `.env`
4. Set at least:
   - `TELEGRAM_BOT_TOKEN`
5. Run the bot:
   - `npm run dev`

## Deploy As Independent Backend (Render)

This folder includes its own Render blueprint at `telegram-standalone/render.yaml`.

1. Push repository to GitHub.
2. In Render, create **Blueprint** and point to this repo.
3. Confirm worker service `edenify-telegram-standalone`.
4. Set environment variable:
   - `TELEGRAM_BOT_TOKEN`
5. Deploy and keep it running 24/7.

## Notes

- Default todo storage file: `telegram-standalone/data/store.json`
- Default Bible plan path: `telegram-standalone/data/bible-plan.json`
- Default Bible database path: `telegram-standalone/data/bible-data.json`
- You can override paths with `BOT_STORE_PATH`, `BIBLE_PLAN_PATH`, and `BIBLE_DB_PATH`.
- This bot does not depend on Edenify web routes or app state sync, so it runs independently.
- The bot timezone label defaults to UTC and can be changed with `BOT_TIMEZONE`.
    