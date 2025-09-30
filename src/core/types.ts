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
  amount: number;           // +crédito / -débito
  balanceAfter?: number;    // opcional no cenário
  cpCode?: string;
  counterparty?: string;
  phonePrefix?: string;
  phone?: string;
  freeText?: string;
  city?: string;
}

export interface DayBlock {
  date: string; // YYYY-MM-DD
  entries: Transaction[];
  saldo_dia?: number;
}

export interface SaldoTotal {
  total: number;
  disponivel: number;
  bloqueado: number;
}

export interface HeaderInfo {
  titular?: string;         // "ALESSANDRA ALVES DE BRITO"
  documento?: string;       // "115.574.766-67"
  conta?: string;           // "Banco Inter • Ag: 0001-9 • Conta: 4830868-4"
  periodoInicio?: string;   // "2024-08-06"
  periodoFim?: string;      // "2024-08-09"
}

export interface Scenario {
  version: number;
  bank: 'INTER';
  openingBalance?: number;
  saldo_total?: SaldoTotal;
  header?: HeaderInfo;      // <<< novo
  days: DayBlock[];
}
