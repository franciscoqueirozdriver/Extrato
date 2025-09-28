
export type Direction = 'ENVIADO'|'RECEBIDO'|'NEUTRO';

export type EntryType =
  | 'PIX_ENVIADO_CP'
  | 'PIX_RECEBIDO_CP'
  | 'PIX_ENVIADO_NOCP'
  | 'PIX_RECEBIDO_NOCP'
  | 'PAGAMENTO'
  | 'PAGAMENTO_EFETUADO'
  | 'ROTATIVO'
  | 'CASHBACK'
  | 'COMPRA_DEBITO';

export interface Transaction {
  type: EntryType;
  // valores em BRL (positivo crédito, negativo débito)
  amount: number;
  balanceAfter: number; // saldo após a operação
  // campos específicos:
  cpCode?: string;             // Pix com Cp
  counterparty?: string;       // nome do favorecido/origem
  phonePrefix?: string;        // 00019
  phone?: string;              // 0127263594
  freeText?: string;           // descrições livres
  city?: string;               // "BH" (Rotativo)
}

export interface DayBlock {
  date: string; // YYYY-MM-DD
  entries: Transaction[];
  saldo_dia?: number; // saldo final mostrado no cabeçalho do dia
}

export interface SaldoTotal {
  total: number;
  disponivel: number;
  bloqueado: number;
}

export interface Scenario {
  version: number;
  bank: 'INTER';
  openingBalance?: number; // opcional; usamos o saldo_dia do primeiro dia como verdade de exibição
  saldo_total?: SaldoTotal;
  days: DayBlock[];
}

