/**
 * Cliente HTTP central para comunicação com o backend Nhac
 * Backend: https://github.com/Matheuskii/backend-nhac
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

/**
 * Gera um UUID v4 simples para uso no frontend (ex: ID do usuário no registro)
 * Nota: Em produção, considere usar uma biblioteca dedicada como 'uuid'
 */
function gerarUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Faz uma requisição HTTP genérica com tratamento de erros e autenticação
 */
async function requisicao<T>(
  endpoint: string,
  opcoes: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('@nhac:token');
  
  const cabecalhos: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const resposta = await fetch(url, {
    ...opcoes,
    headers: {
      ...cabecalhos,
      ...opcoes.headers,
    },
  });

  if (!resposta.ok) {
    let mensagemErro = `Erro ${resposta.status}: ${resposta.statusText}`;
    
    try {
      const corpoErro = await resposta.json();
      mensagemErro = corpoErro.mensagem || corpoErro.error || mensagemErro;
    } catch {
      // Se não conseguir parsear JSON, usa mensagem padrão
    }

    throw new Error(mensagemErro);
  }

  // Se a resposta for 204 No Content, retorna undefined
  if (resposta.status === 204) {
    return undefined as T;
  }

  return resposta.json();
}

// ==================== Autenticação ====================

export interface RegistroRequestDTO {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface LoginRequestDTO {
  email: string;
  senha: string;
}

export interface LoginResponseDTO {
  token: string;
  usuarioId: string;
  nome: string;
  isNovoUsuario: boolean;
  papel: string;
}

/**
 * Registra um novo usuário (conta sem loja)
 * POST /auth/registrar
 */
export async function registrar(dados: RegistroRequestDTO): Promise<{ token: string; usuarioId: string }> {
  return requisicao<{ token: string; usuarioId: string }>('/auth/registrar', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

/**
 * Realiza login
 * POST /auth/login
 */
export async function login(dados: LoginRequestDTO): Promise<LoginResponseDTO> {
  return requisicao<LoginResponseDTO>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

/**
 * Envia código de verificação de e-mail para cadastro
 * POST /auth/enviar-codigo-cadastro
 * 
 * NOTA: Este endpoint ainda não existe no backend.
 * Enquanto isso não é implementado, a etapa de confirmação de e-mail
 * deve ser pulada/ocultada no wizard de cadastro.
 */
export async function enviarCodigoCadastro(email: string): Promise<void> {
  return requisicao<void>('/auth/enviar-codigo-cadastro', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Confirma e-mail no cadastro
 * POST /auth/confirmar-email-cadastro
 * 
 * NOTA: Este endpoint ainda não existe no backend.
 */
export async function confirmarEmailCadastro(email: string, codigo: string): Promise<void> {
  return requisicao<void>('/auth/confirmar-email-cadastro', {
    method: 'POST',
    body: JSON.stringify({ email, codigo }),
  });
}

// ==================== Loja ====================

export interface EnderecoLojaDTO {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface HorariosDTO {
  segunda: string;
  terca: string;
  quarta: string;
  quinta: string;
  sexta: string;
  sabado: string;
  domingo: string;
}

export interface DadosOperacionaisDTO {
  taxaEntregaBase: number;
  tempoEntregaMin: number;
  tempoEntregaMax: number;
  entregaPropria?: boolean;
  retiradaNoLocal?: boolean;
  raioEntregaKm?: number | null;
}

export interface FormasPagamentoDTO {
  aceitaDinheiro: boolean;
  aceitaCredito: boolean;
  aceitaDebito: boolean;
  aceitaPix: boolean;
  aceitaValeRefeicao: boolean;
  aceitaValeAlimentacao: boolean;
}

export interface LojaCreateDTO {
  nome: string;
  imagemUrl: string;
  descricao: string;
  categoria: string;
  isAberto: boolean;
  endereco: EnderecoLojaDTO;
  horarios: HorariosDTO;
  dadosOperacionais: DadosOperacionaisDTO;
  formasPagamento?: FormasPagamentoDTO;
}

/**
 * Cria uma nova loja (cadastro completo em uma chamada)
 * POST /lojas
 * 
 * NOTA: O backend exige todos os campos obrigatórios de uma vez.
 * Não há suporte a rascunho incremental via PATCH.
 */
export async function criarLoja(dados: LojaCreateDTO): Promise<{ id: string }> {
  return requisicao<{ id: string }>('/lojas', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

/**
 * Busca dados da loja do usuário autenticado.
 * Travado: GET /lojas/minha-loja ainda não existe no backend.
 */
export async function buscarMinhaLoja(): Promise<never> {
  throw new Error('GET /lojas/minha-loja ainda não existe no backend.');
}

/**
 * Atualiza dados da loja.
 * Travado: PUT /lojas/{id} ainda não existe no backend.
 */
export async function atualizarLoja(_id: string, _dados: Partial<LojaCreateDTO>): Promise<never> {
  throw new Error('PUT /lojas/{id} ainda não existe no backend.');
}

// ==================== Produtos ====================

export interface PaginaSpring<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ProdutoLojistaDTO {
  id?: string;
  nome: string;
  descricao: string;
  preco: number;
  categoriaMenu: string;
  imagemUrl?: string;
  peso?: number;
  percentualDesconto?: number;
  ativo: boolean;
  estoque?: number;
  adicionais?: GrupoAdicionalDTO[];
}

export interface GrupoAdicionalDTO {
  nome: string;
  obrigatorio: boolean;
  minimo?: number;
  maximo?: number;
  itens: { nome: string; preco: number }[];
}

/**
 * Lista produtos da loja do lojista autenticado (paginado).
 * GET /lojista/produtos
 */
export async function listarProdutos(): Promise<ProdutoLojistaDTO[]> {
  const pagina = await requisicao<PaginaSpring<ProdutoLojistaDTO>>('/lojista/produtos?size=100');
  return pagina.content ?? [];
}

/**
 * Busca um produto específico por ID
 * GET /produtos/{id}
 */
export async function buscarProduto(id: string): Promise<ProdutoLojistaDTO> {
  return requisicao<ProdutoLojistaDTO>(`/produtos/${id}`);
}

/**
 * Cria um novo produto
 * POST /produtos
 */
export async function criarProduto(dados: ProdutoLojistaDTO): Promise<{ id: string }> {
  return requisicao<{ id: string }>('/produtos', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

/**
 * Atualiza um produto existente
 * PUT /produtos/{id}
 */
export async function atualizarProduto(id: string, dados: Partial<ProdutoLojistaDTO>): Promise<void> {
  return requisicao<void>(`/produtos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

/**
 * Desativa um produto (soft delete)
 * DELETE /produtos/{id} → 204 No Content
 */
export async function desativarProduto(id: string): Promise<void> {
  return requisicao<void>(`/produtos/${id}`, {
    method: 'DELETE',
  });
}

// ==================== Pedidos ====================

export interface PedidoResumoDTO {
  id: string;
  lojaId: string;
  lojaNome: string;
  valorTotal: number;
  status: string;
  criadoEm: string;
}

export interface PedidoDetalheDTO extends PedidoResumoDTO {
  itens: {
    produtoId: string;
    nomeProduto: string;
    quantidade: number;
    precoUnitario: number;
    adicionais?: string[];
  }[];
  formaPagamento: string;
  enderecoEntrega: string;
  clienteNome?: string;
  clienteTelefone?: string;
  observacoes?: string;
}

/**
 * Lista pedidos recebidos pela loja do lojista autenticado (paginado).
 * GET /lojista/pedidos
 */
export async function listarPedidos(filtros?: { status?: string }): Promise<PedidoResumoDTO[]> {
  const params = new URLSearchParams();
  params.set('size', '100');
  if (filtros?.status) params.set('status', filtros.status);

  const pagina = await requisicao<PaginaSpring<PedidoResumoDTO>>(`/lojista/pedidos?${params.toString()}`);
  return pagina.content ?? [];
}

/**
 * Detalhe de pedido para o lojista.
 * Travado: GET /pedidos/{id} só autoriza o cliente comprador (403 para o lojista).
 * Não existe GET /lojista/pedidos/{id} no backend ainda.
 */
export async function buscarPedido(_id: string): Promise<never> {
  throw new Error('Detalhe de pedido para lojista ainda não existe no backend.');
}

/**
 * Atualiza status de um pedido
 * PATCH /pedidos/{id}/status
 * 
 * NOTA: Confirmar nome do campo de status no body (ex: { status: 'PAGO' })
 */
export async function atualizarStatusPedido(id: string, status: string): Promise<void> {
  return requisicao<void>(`/pedidos/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * Cancela um pedido
 * PATCH /pedidos/{id}/cancelar
 */
export async function cancelarPedido(id: string): Promise<void> {
  return requisicao<void>(`/pedidos/${id}/cancelar`, {
    method: 'PATCH',
  });
}

// ==================== Utilitários ====================

/**
 * Busca CEP via ViaCEP (proxy não existe no backend, chamamos direto)
 * GET https://viacep.com.br/ws/{cep}/json/
 */
export async function buscarCep(cep: string): Promise<{
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  localidade: string;
  uf: string;
}> {
  const cepLimpo = cep.replace(/\D/g, '');
  const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  
  if (!resposta.ok) {
    throw new Error('Erro ao buscar CEP');
  }
  
  return resposta.json();
}

// Exporta utilitários para uso externo
export { gerarUUID, requisicao };
