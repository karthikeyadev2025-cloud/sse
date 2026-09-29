// Generates supabase/schema.sql = schema-base.sql + seed data from src/data/defaults.js
// Usage: npm run gen:sql
import { readFileSync, writeFileSync } from 'node:fs'
import { defaultContent, defaultCollections } from '../src/data/defaults.js'

const q = (s) => `'${String(s).replace(/'/g, "''")}'`
const j = (o) => `${q(JSON.stringify(o))}::jsonb`
let sql = readFileSync(new URL('../supabase/schema-base.sql', import.meta.url), 'utf8')

sql += `\n-- 5. DEFAULT CONTENT (only inserted if the tables are empty) ------------\n`
sql += `do $$ begin\nif not exists (select 1 from public.site_content) then\n`
for (const [k, v] of Object.entries(defaultContent)) sql += `  insert into public.site_content (key, value) values (${q(k)}, ${j(v)});\n`
sql += `end if;\nif not exists (select 1 from public.items) then\n`
for (const [c, list] of Object.entries(defaultCollections)) {
  list.forEach((it, i) => {
    const { id, sort_order, is_active, ...data } = it
    sql += `  insert into public.items (collection, data, sort_order, is_active) values (${q(c)}, ${j(data)}, ${i + 1}, true);\n`
  })
}
sql += `end if;\nend $$;\n`
sql += `
-- 6. YOUR SUPER ADMIN ---------------------------------------------------
-- Change this email to the one you will log in with, then create the same
-- user in Supabase → Authentication → Users → "Add user" (with a password).
insert into public.admin_users (email, role) values ('admin@sseindustries.in', 'super_admin')
on conflict (email) do update set role = 'super_admin';
`
writeFileSync(new URL('../supabase/schema.sql', import.meta.url), sql)
console.log('supabase/schema.sql written')
