/**
 * Formata um valor numérico como moeda brasileira (R$).
 */
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Formata um número de telefone brasileiro.
 * Ex.: 11999887766 → (11) 99988-7766
 */
export function formatarTelefone(telefone: string): string {
  const limpo = telefone.replace(/\D/g, '');
  if (limpo.length === 11) {
    return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`;
  }
  if (limpo.length === 10) {
    return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 6)}-${limpo.slice(6)}`;
  }
  return telefone;
}

/**
 * Formata um CEP brasileiro.
 * Ex.: 01001000 → 01001-000
 */
export function formatarCep(cep: string): string {
  const limpo = cep.replace(/\D/g, '');
  if (limpo.length === 8) {
    return `${limpo.slice(0, 5)}-${limpo.slice(5)}`;
  }
  return cep;
}

/**
 * Formata uma data ISO para formato brasileiro.
 * Ex.: 2025-08-28T10:30:00 → 28/08/2025
 */
export function formatarData(dataISO: string): string {
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR');
}

/**
 * Formata uma data ISO para formato brasileiro com hora.
 * Ex.: 2025-08-28T10:30:00 → 28/08/2025 às 10:30
 */
export function formatarDataHora(dataISO: string): string {
  const data = new Date(dataISO);
  return `${data.toLocaleDateString('pt-BR')} às ${data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

/**
 * Formata apenas a hora de uma data ISO.
 * Ex.: 2025-08-28T10:30:00 → 10:30
 */
export function formatarHora(dataISO: string): string {
  const data = new Date(dataISO);
  return data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formata um número com ponto de milhar.
 * Ex.: 1500 → 1.500
 */
export function formatarNumero(valor: number): string {
  return valor.toLocaleString('pt-BR');
}

/**
 * Formata porcentagem.
 * Ex.: 0.153 → 15,3%
 */
export function formatarPorcentagem(valor: number): string {
  return `${(valor * 100).toLocaleString('pt-BR', {
    maximumFractionDigits: 1,
  })}%`;
}

/**
 * Retorna as iniciais de um nome (máx 2 letras).
 * Ex.: "João Silva" → "JS"
 */
export function obterIniciais(nome: string): string {
  return nome
    .split(' ')
    .filter((p) => p.length > 0)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

/**
 * Gera um ID simples (mock).
 */
export function gerarId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Máscara de telefone enquanto digita.
 */
export function mascaraTelefone(valor: string): string {
  const limpo = valor.replace(/\D/g, '').slice(0, 11);
  if (limpo.length <= 2) return `(${limpo}`;
  if (limpo.length <= 7) return `(${limpo.slice(0, 2)}) ${limpo.slice(2)}`;
  return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`;
}

/**
 * Máscara de CEP enquanto digita.
 */
export function mascaraCep(valor: string): string {
  const limpo = valor.replace(/\D/g, '').slice(0, 8);
  if (limpo.length <= 5) return limpo;
  return `${limpo.slice(0, 5)}-${limpo.slice(5)}`;
}

/**
 * Máscara de moeda enquanto digita.
 */
export function mascaraMoeda(valor: string): string {
  const limpo = valor.replace(/\D/g, '');
  const numero = parseInt(limpo || '0', 10) / 100;
  return formatarMoeda(numero);
}

/**
 * Rótulo em português e variante de Emblema para cada status de pedido.
 */
export const STATUS_PEDIDO_INFO: Record<string, { rotulo: string; variante: 'sucesso' | 'erro' | 'aviso' | 'info' | 'neutro' }> = {
  pendente: { rotulo: 'Confirmar', variante: 'aviso' },
  aceito: { rotulo: 'Aceito', variante: 'info' },
  preparando: { rotulo: 'Em preparo', variante: 'info' },
  saiu_entrega: { rotulo: 'A caminho', variante: 'info' },
  entregue: { rotulo: 'Entregue', variante: 'sucesso' },
  cancelado: { rotulo: 'Cancelado', variante: 'erro' },
};

/**
 * Ordem cronológica do fluxo normal de um pedido (sem contar cancelamento).
 */
export const FLUXO_STATUS_PEDIDO = ['pendente', 'aceito', 'preparando', 'saiu_entrega', 'entregue'] as const;

/**
 * Lista dos estados brasileiros (siglas).
 */
export const ESTADOS_BRASILEIROS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;