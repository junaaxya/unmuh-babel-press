export async function getSettings() {
  const res = await fetch('/api/settings', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function updateSettings(payload) {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
