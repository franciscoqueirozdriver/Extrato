
import { Transaction } from '../../core/types.js';
import { upperName, truncateName, formatBRL } from '../../core/format.js';

export function renderInterLine(t: Transaction): string {
  switch (t.type) {
    case 'PIX_ENVIADO_CP':
      return `Pix enviado: "Cp :${t.cpCode}-${upperName(truncateName(t.counterparty ?? ''))}" ${formatBRL(t.amount)} ${formatBRL(t.balanceAfter)}`;
    case 'PIX_RECEBIDO_CP':
      return `Pix recebido: "Cp :${t.cpCode}-${upperName(truncateName(t.counterparty ?? ''))}" ${formatBRL(t.amount)} ${formatBRL(t.balanceAfter)}`;
    case 'PIX_ENVIADO_NOCP':
      return `Pix enviado: "${t.phonePrefix} ${t.phone} ${upperName(truncateName(t.counterparty ?? ''))}" ${formatBRL(t.amount)} ${formatBRL(t.balanceAfter)}`;
    case 'PIX_RECEBIDO_NOCP':
      return `Pix recebido: "${t.phonePrefix} ${t.phone} ${upperName(truncateName(t.counterparty ?? ''))}" ${formatBRL(t.amount)} ${formatBRL(t.balanceAfter)}`;
    case 'PAGAMENTO':
      // nos PDFs, às vezes vem só "Pagamento" com os 2 valores
      return `Pagamento ${formatBRL(t.amount)} ${formatBRL(t.balanceAfter)}`;
    case 'PAGAMENTO_EFETUADO':
      return `Pagamento efetuado: "${t.freeText}" ${formatBRL(t.amount)} ${formatBRL(t.balanceAfter)}`;
    case 'ROTATIVO':
      return `Rotativo Digital: "${t.city}" ${formatBRL(t.amount)} ${formatBRL(t.balanceAfter)}`;
    case 'CASHBACK':
      return `Cashback: "${t.freeText}" ${formatBRL(t.amount)} ${formatBRL(t.balanceAfter)}`;
    case 'COMPRA_DEBITO':
      return `Compra no debito: "${t.freeText}" ${formatBRL(t.amount)} ${formatBRL(t.balanceAfter)}`;
  }
}

