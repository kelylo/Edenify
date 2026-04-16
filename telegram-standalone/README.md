# Telegram Standalone Bot

This folder contains an independent Telegram backend bot runtime that is separate from the Edenify PWA server.

## What it does

- Personal todo list per Telegram chat (set, edit, done, remove)
- Daily scripture lookup from Bible reading plan and Bible database
- Specific verse lookup and keyword verse search from Bible database
- Lightweight local JSON storage for bot state

## Commands

- `/set <task>`: Set/add a task
- `/add <task>`: Add a task
- `/edit <number> <new text>`: Edit a task
- `/list`: Show tasks
- `/done <number>`: Mark task done
- `/remove <number>` or `/delete <number>`: Remove task
- `/scripture`: Show scripture for today (day-of-year)
- `/scripture <day>`: Show scripture for a specific plan day
- `/verse <reference|keywords>`: Search the Bible database
- `/find <reference|keywords>`: Alias of `/verse`
- `/help`: Show available commands

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
- The bot uses Gemini for scripture lookup, so set `GEMINI_API_KEY_1` and `GEMINI_API_KEY_2` for better reliability.
- The bot's timezone is set to UTC by default, but you can change it with the `BOT_TIMEZONE` environment variable if needed.
    