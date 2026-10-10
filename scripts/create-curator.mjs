#!/usr/bin/env node
/**
 * Creates (or repairs) the curator account for the admin portal.
 *
 * There is no sign-up route by design, so the single artist account is
 * provisioned out-of-band with the service-role key.
 *
 * Usage:
 *   SUPABASE_URL=https://<ref>.supabase.co \
 *   SUPABASE_SECRET_KEY=<service-role-key> \
 *   node scripts/create-curator.mjs <email> <password>
 *
 * The secret key is read from the environment and never written to disk.
 */
const [email, password] = process.argv.slice(2);
const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!email || !password) {
  console.error("Usage: node scripts/create-curator.mjs <email> <password>");
  process.exit(2);
}
if (!url || !secretKey) {
  console.error("Set SUPABASE_URL and SUPABASE_SECRET_KEY in the environment first.");
  process.exit(2);
}

const headers = {
  apikey: secretKey,
  Authorization: `Bearer ${secretKey}`,
  "Content-Type": "application/json",
};

async function findUserByEmail(target) {
  const res = await fetch(`${url}/auth/v1/admin/users?page=1&per_page=200`, { headers });
  if (!res.ok) throw new Error(`list users failed: ${res.status} ${await res.text()}`);
  const body = await res.json();
  const users = body.users ?? [];
  return users.find((u) => u.email?.toLowerCase() === target.toLowerCase()) ?? null;
}

async function main() {
  const existing = await findUserByEmail(email);

  if (existing) {
    const res = await fetch(`${url}/auth/v1/admin/users/${existing.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ password, email_confirm: true }),
    });
    if (!res.ok) throw new Error(`update failed: ${res.status} ${await res.text()}`);
    console.log(`Updated existing curator: ${email} (${existing.id})`);
    return;
  }

  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  if (!res.ok) throw new Error(`create failed: ${res.status} ${await res.text()}`);
  const created = await res.json();
  console.log(`Created curator: ${created.email} (${created.id})`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
