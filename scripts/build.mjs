import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs';
const out = 'dist';
if (existsSync(out)) rmSync(out, { recursive: true });
mkdirSync(out, { recursive: true });
for (const f of ['index.html', 'assets', 'blueprints', 'decision-log', 'about']) {
  cpSync(f, `${out}/${f}`, { recursive: true });
}
console.log('dist/ built');
