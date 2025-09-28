import { Transaction } from '../../core/types.js';
import { upperName, truncateName, formatBRL } from '../../core/format.js';

// garante número (evita TS2345 quando vier undefined)
const n = (v: number | undefined): number => (typeof v === 'number' && Number.isFinite(v)) ? v : 0;

export function renderInterLine(t: Transaction): string {
  switch (t.type) {
    case 'PIX_ENVIADO_CP':
      return `Pix enviado: "Cp :${t.cpCode}-${upperName(truncateName(t.counterparty ?? ''))}" ${formatBRL(n(t.amount))} ${formatBRL(n(t.balanceAfter))}`;
    case 'PIX_RECEBIDO_CP':
      return `Pix recebido: "Cp :${t.cpCode}-${upperName(truncateName(t.counterparty ?? ''))}" ${formatBRL(n(t.amount))} ${formatBRL(n(t.balanceAfter))}`;
    case 'PIX_ENVIADO_NOCP':
      return `Pix enviado: "${t.phonePrefix} ${t.phone} ${upperName(truncateName(t.counterparty ?? ''))}" ${formatBRL(n(t.amount))} ${formatBRL(n(t.balanceAfter))}`;
    case 'PIX_RECEBIDO_NOCP':
      return `Pix recebido: "${t.phonePrefix} ${t.phone} ${upperName(truncateName(t.counterparty ?? ''))}" ${formatBRL(n(t.amount))} ${formatBRL(n(t.balanceAfter))}`;
    case 'PAGAMENTO':
      return `Pagamento ${formatBRL(n(t.amount))} ${formatBRL(n(t.balanceAfter))}`;
    case 'PAGAMENTO_EFETUADO':
      return `Pagamento efetuado: "${t.freeText}" ${formatBRL(n(t.amount))} ${formatBRL(n(t.balanceAfter))}`;
    case 'ROTATIVO':
      return `Rotativo Digital: "${t.city}" ${formatBRL(n(t.amount))} ${formatBRL(n(t.balanceAfter))}`;
    case 'CASHBACK':
      return `Cashback: "${t.freeText}" ${formatBRL(n(t.amount))} ${formatBRL(n(t.balanceAfter))}`;
    case 'COMPRA_DEBITO': {
      const base = (t.freeText ?? '').trim();
      const rotulo = base.toLowerCase().startsWith('no estabelecimento')
        ? base
        : (base ? `No estabelecimento ${base}` : 'No estabelecimento');
      return `Compra no debito: "${rotulo}" ${formatBRL(n(t.amount))} ${formatBRL(n(t.balanceAfter))}`;
    }
    default:
      return `${t.type} ${formatBRL(n(t.amount))} ${formatBRL(n(t.balanceAfter))}`;
  }
}

