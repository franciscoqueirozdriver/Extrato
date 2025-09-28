
import { readFileSync } from 'node:fs';
import { exportText } from './exporters/text.js';
import YAML from 'yaml';
import { Scenario } from './core/types.js';

function arg(name: string, fallback?: string) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx >= 0 && process.argv[idx+1]) return process.argv[idx+1];
  return fallback;
}

const scenarioPath = arg('scenario');
const outPath = arg('out', 'build/extrato.txt');

if (!scenarioPath) {
  console.error('Uso: node dist/cli.js --scenario scenarios/inter-demo.yml --out build/extrato.txt');
  process.exit(1);
}

const raw = readFileSync(scenarioPath, 'utf8');
const scenario = YAML.parse(raw) as Scenario;

if (scenario.bank !== 'INTER') {
  console.error('Apenas bank: INTER é suportado nesta versão.');
  process.exit(1);
}

exportText(scenario, outPath);
console.log(`OK: gerado ${outPath}`);

