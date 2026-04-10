import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();

async function main() {
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY in environment.');
  }

  const dbPath = path.join(process.cwd(), 'db.json');
  if (!fs.existsSync(dbPath)) {
    throw new Error('db.json not found in project root.');
  }

  const raw = fs.readFileSync(dbPath, 'utf-8');
  const db = JSON.parse(raw) as { data?: Record<string, any> };
  const stateMap = db.data || {};
  const userIds = Object.keys(stateMap);

  if (userIds.length === 0) {
    console.log('No user states found in db.json data map. Nothing to migrate.');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const rows = userIds.map((userId) => ({
    user_id: userId,
    state_json: stateMap[userId] || {},
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from('edenify_user_state').upsert(rows, {
    onConflict: 'user_id',
  });

  if (error) {
    throw new Error(`Supabase migration failed: ${error.message}`);
  }

  console.log(`Migration complete. Upserted ${rows.length} user state row(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
