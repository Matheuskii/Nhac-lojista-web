import {
  ResumoFinanceiro,
  DadosFaturamento,
  PedidosPorDia,
  VendasPorCategoria,
  ProdutoMaisVendido,
} from '../types';

export const resumoFinanceiroMock: ResumoFinanceiro = {
  faturamentoDia: 2847.6,
  faturamentoMes: 67420.0,
  numeroPedidosDia: 42,
  numeroPedidosMes: 1230,
  ticketMedio: 54.81,
  taxaCancelamento: 0.032,
};

function gerarFaturamentoDiario(): DadosFaturamento[] {
  const dados: DadosFaturamento[] = [];
  const hoje = new Date();
  for (let i = 29; i >= 0; i--) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    const diaSemana = data.getDay();
    const base = diaSemana === 0 || diaSemana === 6 ? 3200 : 2100;
    const variacao = (Math.random() - 0.5) * 800;
    const valor = Math.max(800, base + variacao);
    dados.push({
      data: data.toISOString().split('T')[0],
      valor: Math.round(valor * 100) / 100,
    });
  }
  return dados;
}

export const faturamentoDiarioMock: DadosFaturamento[] = gerarFaturamentoDiario();

export const pedidosPorDiaMock: PedidosPorDia[] = [
  { dia: 'Seg', quantidade: 145 },
  { dia: 'Ter', quantidade: 132 },
  { dia: 'Qua', quantidade: 158 },
  { dia: 'Qui', quantidade: 163 },
  { dia: 'Sex', quantidade: 210 },
  { dia: 'Sáb', quantidade: 248 },
  { dia: 'Dom', quantidade: 174 },
];

export const vendasPorCategoriaMock: VendasPorCategoria[] = [
  { categoria: 'Hambúrgueres', valor: 28500, porcentagem: 0.423 },
  { categoria: 'Pizzas', valor: 15200, porcentagem: 0.225 },
  { categoria: 'Bebidas', valor: 8400, porcentagem: 0.125 },
  { categoria: 'Sobremesas', valor: 6800, porcentagem: 0.101 },
  { categoria: 'Porções', valor: 4900, porcentagem: 0.073 },
  { categoria: 'Outros', valor: 3620, porcentagem: 0.054 },
];

export const vendasPorPagamentoMock: VendasPorCategoria[] = [
  { categoria: 'Cartão de crédito', valor: 24100, porcentagem: 0.357 },
  { categoria: 'Pix', valor: 21800, porcentagem: 0.323 },
  { categoria: 'Cartão de débito', valor: 10500, porcentagem: 0.156 },
  { categoria: 'Vale-refeição', valor: 6200, porcentagem: 0.092 },
  { categoria: 'Dinheiro', valor: 3500, porcentagem: 0.052 },
  { categoria: 'Vale-alimentação', valor: 1320, porcentagem: 0.020 },
];

export const produtosMaisVendidosMock: ProdutoMaisVendido[] = [
  { posicao: 1, nome: 'X-Burguer Clássico', quantidadeVendida: 342, faturamento: 9884.0 },
  { posicao: 2, nome: 'Smash Burger Duplo', quantidadeVendida: 287, faturamento: 10332.0 },
  { posicao: 3, nome: 'Pizza Margherita', quantidadeVendida: 198, faturamento: 9880.2 },
  { posicao: 4, nome: 'Combo Família', quantidadeVendida: 156, faturamento: 18704.4 },
  { posicao: 5, nome: 'Coca-Cola 350ml', quantidadeVendida: 520, faturamento: 3640.0 },
  { posicao: 6, nome: 'Porção de Batata Frita', quantidadeVendida: 178, faturamento: 3916.0 },
  { posicao: 7, nome: 'Brownie com Sorvete', quantidadeVendida: 165, faturamento: 3283.5 },
  { posicao: 8, nome: 'Suco de Laranja Natural', quantidadeVendida: 230, faturamento: 2760.0 },
  { posicao: 9, nome: 'Pizza Calabresa', quantidadeVendida: 142, faturamento: 6375.8 },
  { posicao: 10, nome: 'Salada Caesar', quantidadeVendida: 95, faturamento: 2840.5 },
];

export interface FaturamentoPorHora {
  hora: string;
  pedidos: number;
}

export const pedidosPorHoraMock: FaturamentoPorHora[] = [
  { hora: '10h', pedidos: 8 },
  { hora: '11h', pedidos: 22 },
  { hora: '12h', pedidos: 45 },
  { hora: '13h', pedidos: 38 },
  { hora: '14h', pedidos: 15 },
  { hora: '15h', pedidos: 10 },
  { hora: '16h', pedidos: 8 },
  { hora: '17h', pedidos: 12 },
  { hora: '18h', pedidos: 28 },
  { hora: '19h', pedidos: 52 },
  { hora: '20h', pedidos: 58 },
  { hora: '21h', pedidos: 42 },
  { hora: '22h', pedidos: 25 },
  { hora: '23h', pedidos: 10 },
];
