#!/usr/bin/env node
// entries/*.html 을 스캔해서 manifest.json을 생성합니다.
// - title: <title> 태그
// - description: <meta name="description">
// - author, date: 해당 파일의 git 마지막 커밋 정보 (없으면 파일 mtime 사용)

import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ENTRIES_DIR = join(ROOT, 'entries');
const OUT_FILE = join(ROOT, 'manifest.json');

function extractTag(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : '';
}

function gitInfo(relPath) {
  try {
    const out = execSync(`git log -1 --format=%aI%x1f%an -- "${relPath}"`, {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    if (!out) return null;
    const [date, author] = out.split('\x1f');
    return { date, author };
  } catch {
    return null;
  }
}

function main() {
  let files = [];
  try {
    files = readdirSync(ENTRIES_DIR).filter(f => f.toLowerCase().endsWith('.html'));
  } catch {
    files = [];
  }

  const items = files.map(file => {
    const full = join(ENTRIES_DIR, file);
    const html = readFileSync(full, 'utf8');
    const title = extractTag(html, /<title[^>]*>([^<]*)<\/title>/i) || file;
    const description = extractTag(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
    );
    const relPath = 'entries/' + file;
    const info = gitInfo(relPath);
    const stat = statSync(full);
    return {
      file,
      title,
      description,
      author: info?.author || '',
      date: info?.date || stat.mtime.toISOString(),
    };
  });

  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  writeFileSync(OUT_FILE, JSON.stringify(items, null, 2) + '\n');
  console.log(`manifest.json 생성 완료 (${items.length}개 항목)`);
}

main();
