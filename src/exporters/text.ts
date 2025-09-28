
import { Scenario } from '../core/types.js';
import { renderScenarioToText } from '../core/engine.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export function exportText(s: Scenario, outPath: string) {
  const txt = renderScenarioToText(s);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, txt, 'utf8');
}

