import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import YAML from 'yaml';
import { Scenario } from '../core/types.js';
import { renderScenarioToHTML } from '../templates/inter-html.js';

function arg(name: string, fallback: string): string {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

function bail(msg: string, code = 1): never {
  console.error(msg);
  process.exit(code);
}

function loadScenario(path: string): Scenario {
  const raw = readFileSync(path, 'utf8');
  return YAML.parse(raw) as Scenario;
}

const scenarioPath = arg('scenario', 'scenarios/inter-demo.yml');
const outPath = arg('out', 'public/extrato.html');

try {
  const scenario = loadScenario(scenarioPath);
  if (scenario.bank !== 'INTER') {
    bail('Apenas bank: INTER é suportado nesta versão.');
  }

  const html = renderScenarioToHTML(scenario);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
  console.log(`OK: gerado ${outPath}`);
} catch (err) {
  bail(`Falha ao processar cenário em "${scenarioPath}": ${(err as Error).message}`);
}
