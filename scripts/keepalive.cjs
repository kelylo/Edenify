const raw = (process.env.KEEPALIVE_URL || process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || '').trim();

if (!raw) {
  console.error('Set KEEPALIVE_URL (for example: https://your-app.onrender.com)');
  process.exit(1);
}

const baseUrl = raw.replace(/\/+$/, '');
const healthUrl = `${baseUrl}/api/health`;
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 8000);

fetch(healthUrl, {
  method: 'GET',
  cache: 'no-store',
  signal: controller.signal,
})
  .then(async (response) => {
    const bodyText = await response.text().catch(() => '');
    console.log('[keepalive]', healthUrl, response.status, bodyText.slice(0, 200));
    if (!response.ok) {
      throw new Error(`${healthUrl} -> ${response.status}`);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('[keepalive] failed', error?.message || error);
    process.exit(1);
  })
  .finally(() => {
    clearTimeout(timeoutId);
  });