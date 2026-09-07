import { Loja } from '../types';

export const lojaMock: Loja = {
  id: 'loja-1',
  nome: 'Hamburgueria Nhac',
  descricao: 'Os melhores hambúrgueres artesanais da cidade, feitos com ingredientes selecionados e muito carinho.',
  categoria: 'Hambúrgueres',
  fotoUrl: '/nhac-logo.png',
  endereco: {
    cep: '01001-000',
    rua: 'Rua das Flores',
    numero: '123',
    complemento: 'Sala 4',
    bairro: 'Centro',
    cidade: 'São Paulo',
    uf: 'SP',
  },
  entrega: {
    entregaPropria: true,
    retiradaNoLocal: true,
    raioEntregaKm: 7,
    taxaEntregaReais: 5.0,
  },
  horarios: [
    { diaSemana: 'Segunda-feira', aberto: true, horarioAbertura: '18:00', horarioFechamento: '23:00' },
    { diaSemana: 'Terça-feira', aberto: true, horarioAbertura: '18:00', horarioFechamento: '23:00' },
    { diaSemana: 'Quarta-feira', aberto: true, horarioAbertura: '18:00', horarioFechamento: '23:00' },
    { diaSemana: 'Quinta-feira', aberto: true, horarioAbertura: '18:00', horarioFechamento: '23:00' },
    { diaSemana: 'Sexta-feira', aberto: true, horarioAbertura: '18:00', horarioFechamento: '00:00' },
    { diaSemana: 'Sábado', aberto: true, horarioAbertura: '18:00', horarioFechamento: '00:00' },
    { diaSemana: 'Domingo', aberto: false, horarioAbertura: '18:00', horarioFechamento: '23:00' },
  ],
  formasPagamento: {
    dinheiro: true,
    cartaoCredito: true,
    cartaoDebito: true,
    pix: true,
    valeRefeicao: true,
    valeAlimentacao: false,
  },
};