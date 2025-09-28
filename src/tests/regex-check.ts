
import { readFileSync } from 'node:fs';
import { Scenario } from '../core/types.js';
import YAML from 'yaml';
import { renderScenarioToText } from '../core/engine.js';
import { GRAMMAR } from '../banks/inter/grammar.js';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const raw = readFileSync('scenarios/inter-demo.yml', 'utf8');
const scenario = YAML.parse(raw) as Scenario;
const txt = renderScenarioToText(scenario);

const lines = txt.split('\n').filter(l => l.trim().length > 0);

// Valida algumas amostras por tipo (MVP)
const checks = [
  { re: GRAMMAR.PIX_CP_ENVIADO,  sample: lines.find(l => l.startsWith('Pix enviado: "Cp :') && l.includes('" -R$')) },
  { re: GRAMMAR.PIX_CP_RECEBIDO, sample: lines.find(l => l.startsWith('Pix recebido: "Cp :') && l.includes(' R$ ')) },
  { re: GRAMMAR.PIX_NOCP_ENVIADO,sample: lines.find(l => l.startsWith('Pix enviado: "00019')) },
  { re: GRAMMAR.PAGAMENTO_EFETUADO, sample: lines.find(l => l.startsWith('Pagamento efetuado:')) },
  { re: GRAMMAR.ROTATIVO, sample: lines.find(l => l.startsWith('Rotativo Digital:')) },
  { re: GRAMMAR.CASHBACK, sample: lines.find(l => l.startsWith('Cashback:')) },
  { re: GRAMMAR.COMPRA_DEBITO, sample: lines.find(l => l.startsWith('Compra no debito:')) },
  { re: GRAMMAR.HEADER_DIA, sample: lines.find(l => l.match(/Saldo do dia:/)) },
];

for (const c of checks) {
  if (!c.sample) continue; // nem todo cenário terá todos
  assert(c.re.test(c.sample), `Falhou regex: ${c.re} em "${c.sample}"`);
}

console.log('Regex OK para amostras do cenário.');

