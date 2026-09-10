import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, 
  Store, UploadCloud, MapPin, CheckCircle, 
  Banknote, CreditCard, Smartphone, Utensils, ShoppingBag
} from 'lucide-react';
import estilos from './PaginaCadastro.module.css';
import { Botao, InputTexto, Seletor, Toggle, Checkbox, IndicadorEtapas, Cartao } from '../../components/ui';
import { mascaraTelefone, mascaraCep, ESTADOS_BRASILEIROS } from '../../utils/formatacao';
import { CATEGORIAS_LOJA } from '../../dados/categorias';
import { registrar, criarLoja, buscarCep as apiBuscarCep, gerarUUID } from '../../services/api';

// Etapas do wizard SEM a etapa de confirmação de e-mail (backend não tem esse endpoint ainda)
const ETAPAS = [
  'Dados Pessoais',
  'Dados da Loja',
  'Endereço',
  'Entrega',
  'Horários',
  'Pagamento',
  'Revisão'
];

const DIAS_SEMANA = [
  { id: 'seg', nome: 'Segunda-feira' },
  { id: 'ter', nome: 'Terça-feira' },
  { id: 'qua', nome: 'Quarta-feira' },
  { id: 'qui', nome: 'Quinta-feira' },
  { id: 'sex', nome: 'Sexta-feira' },
  { id: 'sab', nome: 'Sábado' },
  { id: 'dom', nome: 'Domingo' }
];

export default function PaginaCadastro() {
  const navigate = useNavigate();
  
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [cadastroConcluido, setCadastroConcluido] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Etapa 0 — Dados Pessoais
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // Etapa 1 — Dados da Loja (antiga etapa 2)
  const [fotoUrl, setFotoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nomeLoja, setNomeLoja] = useState('');
  const [descricaoLoja, setDescricaoLoja] = useState('');
  const [categoriaLoja, setCategoriaLoja] = useState('');

  // Etapa 2 — Endereço (antiga etapa 3)
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [buscandoCep, setBuscandoCep] = useState(false);

  // Etapa 3 — Entrega (antiga etapa 4)
  const [entregaPropria, setEntregaPropria] = useState(true);
  const [retiradaNoLocal, setRetiradaNoLocal] = useState(true);
  const [raioEntregaKm, setRaioEntregaKm] = useState('5');
  const [taxaEntregaReais, setTaxaEntregaReais] = useState('5.00');
  const [tempoEntregaMin, setTempoEntregaMin] = useState('30');
  const [tempoEntregaMax, setTempoEntregaMax] = useState('60');

  // Etapa 4 — Horários (antiga etapa 5)
  const [horarios, setHorarios] = useState(
    DIAS_SEMANA.map(dia => ({
      ...dia,
      aberto: dia.id !== 'sab' && dia.id !== 'dom',
      abertura: '10:00',
      fechamento: '22:00'
    }))
  );

  // Etapa 5 — Pagamento (antiga etapa 6)
  const [pagamentos, setPagamentos] = useState({
    dinheiro: false,
    credito: false,
    debito: false,
    pix: false,
    refeicao: false,
    alimentacao: false
  });

  const validarEtapa0 = () => {
    const novosErros: Record<string, string> = {};
    if (!nomeCompleto) novosErros.nomeCompleto = 'Nome é obrigatório';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) novosErros.email = 'E-mail inválido';
    if (!telefone) novosErros.telefone = 'Telefone é obrigatório';
    if (senha.length < 6) novosErros.senha = 'A senha deve ter pelo menos 6 caracteres';
    if (senha !== confirmarSenha) novosErros.confirmarSenha = 'As senhas não coincidem';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarEtapa1 = () => {
    const novosErros: Record<string, string> = {};
    if (!nomeLoja) novosErros.nomeLoja = 'Nome da loja é obrigatório';
    if (!categoriaLoja) novosErros.categoriaLoja = 'Selecione uma categoria';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarEtapa2 = () => {
    const novosErros: Record<string, string> = {};
    if (!cep) novosErros.cep = 'CEP é obrigatório';
    if (!rua) novosErros.rua = 'Rua é obrigatória';
    if (!numero) novosErros.numero = 'Número é obrigatório';
    if (!bairro) novosErros.bairro = 'Bairro é obrigatório';
    if (!cidade) novosErros.cidade = 'Cidade é obrigatória';
    if (!uf) novosErros.uf = 'UF é obrigatório';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarEtapa3 = () => {
    const novosErros: Record<string, string> = {};
    const min = parseInt(tempoEntregaMin, 10);
    const max = parseInt(tempoEntregaMax, 10);
    if (Number.isNaN(min) || min < 0) novosErros.tempoEntregaMin = 'Informe o tempo mínimo em minutos';
    if (Number.isNaN(max) || max < 0) novosErros.tempoEntregaMax = 'Informe o tempo máximo em minutos';
    if (!Number.isNaN(min) && !Number.isNaN(max) && max < min) {
      novosErros.tempoEntregaMax = 'O tempo máximo deve ser maior ou igual ao mínimo';
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarEtapa5 = () => {
    const selecionadoAlgum = Object.values(pagamentos).some(v => v);
    if (!selecionadoAlgum) {
      setErros({ pagamentos: 'Selecione pelo menos uma forma de pagamento' });
      return false;
    }
    setErros({});
    return true;
  };

  const avancar = () => {
    let valido = false;
    if (etapaAtual === 0) valido = validarEtapa0();
    else if (etapaAtual === 1) valido = validarEtapa1();
    else if (etapaAtual === 2) valido = validarEtapa2();
    else if (etapaAtual === 3) valido = validarEtapa3();
    else if (etapaAtual === 4) valido = true;
    else if (etapaAtual === 5) valido = validarEtapa5();

    if (valido) {
      setEtapaAtual(prev => Math.min(prev + 1, ETAPAS.length - 1));
      window.scrollTo(0, 0);
    }
  };

  const voltar = () => {
    setEtapaAtual(prev => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const finalizar = async () => {
    setCarregando(true);
    try {
      // 1. Registra o usuário (conta)
      const usuarioId = gerarUUID();
      const respostaRegistro = await registrar({
        id: usuarioId,
        nome: nomeCompleto,
        email,
        telefone,
        senha,
      });

      const serializarHorario = (dia: { aberto: boolean; abertura: string; fechamento: string }) =>
        dia.aberto ? `${dia.abertura} - ${dia.fechamento}` : 'Fechado';

      const horariosDTO = {
        segunda: serializarHorario(horarios[0]),
        terca: serializarHorario(horarios[1]),
        quarta: serializarHorario(horarios[2]),
        quinta: serializarHorario(horarios[3]),
        sexta: serializarHorario(horarios[4]),
        sabado: serializarHorario(horarios[5]),
        domingo: serializarHorario(horarios[6]),
      };

      await criarLoja({
        nome: nomeLoja,
        imagemUrl: fotoUrl || 'https://via.placeholder.com/150',
        descricao: descricaoLoja || '',
        categoria: categoriaLoja,
        isAberto: true,
        endereco: {
          cep: cep.replace(/\D/g, ''),
          rua,
          numero,
          complemento: complemento || undefined,
          bairro,
          cidade,
          estado: uf,
        },
        horarios: horariosDTO,
        dadosOperacionais: {
          entregaPropria,
          retiradaNoLocal,
          raioEntregaKm: parseFloat(raioEntregaKm) || null,
          taxaEntregaBase: parseFloat(taxaEntregaReais.replace(',', '.')) || 0,
          tempoEntregaMin: parseInt(tempoEntregaMin, 10),
          tempoEntregaMax: parseInt(tempoEntregaMax, 10),
        },
        formasPagamento: {
          aceitaDinheiro: pagamentos.dinheiro,
          aceitaCredito: pagamentos.credito,
          aceitaDebito: pagamentos.debito,
          aceitaPix: pagamentos.pix,
          aceitaValeRefeicao: pagamentos.refeicao,
          aceitaValeAlimentacao: pagamentos.alimentacao,
        },
      });

      setCadastroConcluido(true);
    } catch (erro: any) {
      setErros({ geral: erro.message || 'Erro ao cadastrar. Tente novamente.' });
    } finally {
      setCarregando(false);
    }
  };

  const lidarComArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFotoUrl(url);
    }
  };

  const buscarCep = async (valorCep: string) => {
    const cepLimpo = valorCep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      setBuscandoCep(true);
      try {
        const dados = await apiBuscarCep(cepLimpo);
        setRua(dados.logradouro);
        setBairro(dados.bairro);
        setCidade(dados.localidade);
        setUf(dados.uf);
        if (dados.complemento) setComplemento(dados.complemento);
      } catch (erro) {
        setErros(prev => ({ ...prev, cep: 'CEP não encontrado' }));
      } finally {
        setBuscandoCep(false);
      }
    }
  };

  const copiarHorario = (indexOrigem: number) => {
    const origem = horarios[indexOrigem];
    setHorarios(horarios.map(h => ({
      ...h,
      aberto: origem.aberto,
      abertura: origem.abertura,
      fechamento: origem.fechamento
    })));
  };

  const atualizarHorario = (index: number, campo: string, valor: string | boolean) => {
    const novos = [...horarios];
    novos[index] = { ...novos[index], [campo]: valor };
    setHorarios(novos);
  };

  const togglePagamento = (chave: keyof typeof pagamentos) => {
    setPagamentos(prev => ({ ...prev, [chave]: !prev[chave] }));
  };

  const pagamentosSelecionados = Object.entries(pagamentos)
    .filter(([, v]) => v)
    .map(([k]) => ({ dinheiro: 'Dinheiro', credito: 'Crédito', debito: 'Débito', pix: 'Pix', refeicao: 'Vale-refeição', alimentacao: 'Vale-alimentação' }[k]))
    .join(', ');

  return (
    <div className={estilos.container}>
      <div className={estilos.conteudo}>
        <div className={estilos.cabecalho}>
          <h1 className={estilos.titulo}>Crie sua conta</h1>
          <p className={estilos.subtitulo}>Junte-se ao Nhac e expanda suas vendas</p>
        </div>

        <IndicadorEtapas etapas={ETAPAS} etapaAtual={etapaAtual} />

        <Cartao className={estilos.cartao}>
          {/* ETAPA 0 — Dados Pessoais */}
          {etapaAtual === 0 && (
            <div className={estilos.grid}>
              <InputTexto
                rotulo="Nome Completo"
                valor={nomeCompleto}
                aoMudar={setNomeCompleto}
                icone={<User size={18} />}
                erro={erros.nomeCompleto}
                obrigatorio
              />
              <InputTexto
                rotulo="E-mail"
                tipo="email"
                valor={email}
                aoMudar={setEmail}
                icone={<Mail size={18} />}
                erro={erros.email}
                obrigatorio
              />
              <InputTexto
                rotulo="Telefone"
                valor={telefone}
                aoMudar={(v) => setTelefone(mascaraTelefone(v))}
                icone={<Phone size={18} />}
                erro={erros.telefone}
                obrigatorio
              />
              <div style={{ position: 'relative' }}>
                <InputTexto
                  rotulo="Senha"
                  tipo={mostrarSenha ? 'text' : 'password'}
                  valor={senha}
                  aoMudar={setSenha}
                  icone={<Lock size={18} />}
                  erro={erros.senha}
                  obrigatorio
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  style={{ position: 'absolute', right: '1rem', bottom: erros.senha ? '2rem' : '0.9rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nhac-texto-claro)' }}
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <InputTexto
                  rotulo="Confirmar Senha"
                  tipo={mostrarConfirmarSenha ? 'text' : 'password'}
                  valor={confirmarSenha}
                  aoMudar={setConfirmarSenha}
                  icone={<Lock size={18} />}
                  erro={erros.confirmarSenha}
                  obrigatorio
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  style={{ position: 'absolute', right: '1rem', bottom: erros.confirmarSenha ? '2rem' : '0.9rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nhac-texto-claro)' }}
                >
                  {mostrarConfirmarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 1 — Dados da Loja */}
          {etapaAtual === 1 && (
            <div className={estilos.grid}>
              <div>
                <span className={estilos.rotuloTextarea}>Logo da Loja</span>
                <div 
                  className={estilos.uploadArea} 
                  onClick={() => fileInputRef.current?.click()}
                >
                  {fotoUrl ? (
                    <img src={fotoUrl} alt="Logo" className={estilos.previewImagem} />
                  ) : (
                    <>
                      <UploadCloud size={40} className={estilos.uploadIcone} />
                      <span>Clique para fazer upload da logo</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef}
                    onChange={lidarComArquivo}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              
              <InputTexto
                rotulo="Nome da Loja"
                valor={nomeLoja}
                aoMudar={setNomeLoja}
                icone={<Store size={18} />}
                erro={erros.nomeLoja}
                obrigatorio
              />

              <Seletor
                rotulo="Categoria Principal"
                opcoes={CATEGORIAS_LOJA.map(c => ({ valor: c, rotulo: c }))}
                valor={categoriaLoja}
                aoMudar={setCategoriaLoja}
                erro={erros.categoriaLoja}
                obrigatorio
              />

              <div>
                <label className={estilos.rotuloTextarea}>Descrição da Loja</label>
                <textarea
                  className={estilos.textarea}
                  value={descricaoLoja}
                  onChange={(e) => setDescricaoLoja(e.target.value)}
                  placeholder="Fale um pouco sobre sua loja e o que você oferece..."
                />
              </div>
            </div>
          )}

          {/* ETAPA 2 — Endereço */}
          {etapaAtual === 2 && (
            <div className={estilos.grid}>
              <InputTexto
                rotulo="CEP"
                valor={cep}
                aoMudar={(v) => {
                  const valFormatado = mascaraCep(v);
                  setCep(valFormatado);
                  if (valFormatado.length === 9) buscarCep(valFormatado);
                }}
                icone={<MapPin size={18} />}
                erro={erros.cep}
                obrigatorio
              />
              {buscandoCep && <span style={{ fontSize: '0.8rem', color: 'var(--nhac-primaria)' }}>Buscando endereço...</span>}
              
              <div className={`${estilos.grid} ${estilos.grid2}`}>
                <InputTexto rotulo="Rua" valor={rua} aoMudar={setRua} erro={erros.rua} obrigatorio />
                <InputTexto rotulo="Número" valor={numero} aoMudar={setNumero} erro={erros.numero} obrigatorio />
              </div>

              <div className={`${estilos.grid} ${estilos.grid2}`}>
                <InputTexto rotulo="Complemento" valor={complemento} aoMudar={setComplemento} />
                <InputTexto rotulo="Bairro" valor={bairro} aoMudar={setBairro} erro={erros.bairro} obrigatorio />
              </div>

              <div className={`${estilos.grid} ${estilos.grid2}`}>
                <InputTexto rotulo="Cidade" valor={cidade} aoMudar={setCidade} erro={erros.cidade} obrigatorio />
                <Seletor
                  rotulo="Estado (UF)"
                  opcoes={ESTADOS_BRASILEIROS.map(uf => ({ valor: uf, rotulo: uf }))}
                  valor={uf}
                  aoMudar={setUf}
                  erro={erros.uf}
                  obrigatorio
                />
              </div>
            </div>
          )}

          {/* ETAPA 3 — Entrega */}
          {etapaAtual === 3 && (
            <div className={estilos.grid}>
              <Toggle
                rotulo="Oferece entrega própria?"
                ativo={entregaPropria}
                aoMudar={setEntregaPropria}
              />
              
              {entregaPropria && (
                <>
                  <InputTexto
                    rotulo="Raio de entrega (km)"
                    tipo="number"
                    valor={raioEntregaKm}
                    aoMudar={setRaioEntregaKm}
                  />
                  <InputTexto
                    rotulo="Taxa de entrega base (R$)"
                    valor={taxaEntregaReais}
                    aoMudar={setTaxaEntregaReais}
                  />
                </>
              )}

              <div className={`${estilos.grid} ${estilos.grid2}`}>
                <InputTexto
                  rotulo="Tempo mínimo de entrega (min)"
                  tipo="number"
                  valor={tempoEntregaMin}
                  aoMudar={setTempoEntregaMin}
                  erro={erros.tempoEntregaMin}
                  obrigatorio
                />
                <InputTexto
                  rotulo="Tempo máximo de entrega (min)"
                  tipo="number"
                  valor={tempoEntregaMax}
                  aoMudar={setTempoEntregaMax}
                  erro={erros.tempoEntregaMax}
                  obrigatorio
                />
              </div>

              <Toggle
                rotulo="Permite retirada no local?"
                ativo={retiradaNoLocal}
                aoMudar={setRetiradaNoLocal}
              />
            </div>
          )}

          {/* ETAPA 4 — Horários */}
          {etapaAtual === 4 && (
            <div className={estilos.listaHorarios}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--nhac-texto-claro)' }}>
                Configure os horários de funcionamento da sua loja.
              </p>
              
              {horarios.map((dia, index) => (
                <div key={dia.id} className={estilos.linhaHorario}>
                  <div className={estilos.diaInfo}>
                    <Toggle
                      rotulo={dia.nome}
                      ativo={dia.aberto}
                      aoMudar={(v) => atualizarHorario(index, 'aberto', v)}
                    />
                  </div>
                  
                  {dia.aberto ? (
                    <div className={estilos.inputsTempo}>
                      <input
                        type="time"
                        className={estilos.inputTempo}
                        value={dia.abertura}
                        onChange={(e) => atualizarHorario(index, 'abertura', e.target.value)}
                      />
                      <span>às</span>
                      <input
                        type="time"
                        className={estilos.inputTempo}
                        value={dia.fechamento}
                        onChange={(e) => atualizarHorario(index, 'fechamento', e.target.value)}
                      />
                    </div>
                  ) : (
                    <span style={{ color: 'var(--nhac-texto-claro)', fontSize: '0.875rem' }}>Fechado</span>
                  )}
                  
                  <Botao 
                    variante="secundario" 
                    tamanho="pequeno" 
                    onClick={() => copiarHorario(index)}
                  >
                    Copiar
                  </Botao>
                </div>
              ))}
            </div>
          )}

          {/* ETAPA 5 — Pagamento */}
          {etapaAtual === 5 && (
            <div className={estilos.grid}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--nhac-texto-claro)' }}>
                Quais formas de pagamento você aceita?
              </p>

              {erros.pagamentos && <div className={estilos.erro}>{erros.pagamentos}</div>}

              <div className={estilos.gridPagamentos}>
                <div 
                  className={`${estilos.cartaoPagamento} ${pagamentos.dinheiro ? estilos.selecionado : ''}`}
                  onClick={() => togglePagamento('dinheiro')}
                >
                  <Banknote className={estilos.iconePagamento} />
                  <span>Dinheiro</span>
                  <div style={{ marginLeft: 'auto' }}>
                    <Checkbox marcado={pagamentos.dinheiro} aoMudar={() => {}} rotulo="" />
                  </div>
                </div>

                <div 
                  className={`${estilos.cartaoPagamento} ${pagamentos.credito ? estilos.selecionado : ''}`}
                  onClick={() => togglePagamento('credito')}
                >
                  <CreditCard className={estilos.iconePagamento} />
                  <span>Cartão de Crédito</span>
                  <div style={{ marginLeft: 'auto' }}>
                    <Checkbox marcado={pagamentos.credito} aoMudar={() => {}} rotulo="" />
                  </div>
                </div>

                <div 
                  className={`${estilos.cartaoPagamento} ${pagamentos.debito ? estilos.selecionado : ''}`}
                  onClick={() => togglePagamento('debito')}
                >
                  <CreditCard className={estilos.iconePagamento} />
                  <span>Cartão de Débito</span>
                  <div style={{ marginLeft: 'auto' }}>
                    <Checkbox marcado={pagamentos.debito} aoMudar={() => {}} rotulo="" />
                  </div>
                </div>

                <div 
                  className={`${estilos.cartaoPagamento} ${pagamentos.pix ? estilos.selecionado : ''}`}
                  onClick={() => togglePagamento('pix')}
                >
                  <Smartphone className={estilos.iconePagamento} />
                  <span>Pix</span>
                  <div style={{ marginLeft: 'auto' }}>
                    <Checkbox marcado={pagamentos.pix} aoMudar={() => {}} rotulo="" />
                  </div>
                </div>

                <div 
                  className={`${estilos.cartaoPagamento} ${pagamentos.refeicao ? estilos.selecionado : ''}`}
                  onClick={() => togglePagamento('refeicao')}
                >
                  <Utensils className={estilos.iconePagamento} />
                  <span>Vale-refeição</span>
                  <div style={{ marginLeft: 'auto' }}>
                    <Checkbox marcado={pagamentos.refeicao} aoMudar={() => {}} rotulo="" />
                  </div>
                </div>

                <div 
                  className={`${estilos.cartaoPagamento} ${pagamentos.alimentacao ? estilos.selecionado : ''}`}
                  onClick={() => togglePagamento('alimentacao')}
                >
                  <ShoppingBag className={estilos.iconePagamento} />
                  <span>Vale-alimentação</span>
                  <div style={{ marginLeft: 'auto' }}>
                    <Checkbox marcado={pagamentos.alimentacao} aoMudar={() => {}} rotulo="" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 6 — Revisão */}
          {etapaAtual === 6 && (
            <div className={estilos.grid}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--nhac-texto-claro)' }}>
                Revise suas informações antes de finalizar o cadastro.
              </p>

              <div className={estilos.revisaoSecao}>
                <h4 className={estilos.revisaoTitulo}>Dados Pessoais</h4>
                <div className={estilos.revisaoItem}><span>Nome</span><strong>{nomeCompleto}</strong></div>
                <div className={estilos.revisaoItem}><span>E-mail</span><strong>{email}</strong></div>
                <div className={estilos.revisaoItem}><span>Telefone</span><strong>{telefone}</strong></div>
              </div>

              <div className={estilos.revisaoSecao}>
                <h4 className={estilos.revisaoTitulo}>Dados da Loja</h4>
                <div className={estilos.revisaoItem}><span>Nome</span><strong>{nomeLoja || '—'}</strong></div>
                <div className={estilos.revisaoItem}><span>Categoria</span><strong>{categoriaLoja || '—'}</strong></div>
                {descricaoLoja && <div className={estilos.revisaoItem}><span>Descrição</span><strong>{descricaoLoja}</strong></div>}
              </div>

              <div className={estilos.revisaoSecao}>
                <h4 className={estilos.revisaoTitulo}>Endereço</h4>
                <div className={estilos.revisaoItem}><span>CEP</span><strong>{cep || '—'}</strong></div>
                <div className={estilos.revisaoItem}><span>Endereço</span><strong>{rua}{numero ? `, ${numero}` : ''}{complemento ? ` - ${complemento}` : ''}</strong></div>
                <div className={estilos.revisaoItem}><span>Bairro/Cidade</span><strong>{bairro}{cidade ? ` — ${cidade}/${uf}` : ''}</strong></div>
              </div>

              <div className={estilos.revisaoSecao}>
                <h4 className={estilos.revisaoTitulo}>Entrega</h4>
                <div className={estilos.revisaoItem}><span>Entrega própria</span><strong>{entregaPropria ? `Sim (${raioEntregaKm} km, R$ ${taxaEntregaReais})` : 'Não'}</strong></div>
                <div className={estilos.revisaoItem}><span>Tempo de entrega</span><strong>{tempoEntregaMin}–{tempoEntregaMax} min</strong></div>
                <div className={estilos.revisaoItem}><span>Retirada no local</span><strong>{retiradaNoLocal ? 'Sim' : 'Não'}</strong></div>
              </div>

              <div className={estilos.revisaoSecao}>
                <h4 className={estilos.revisaoTitulo}>Horários</h4>
                {horarios.filter(d => d.aberto).map(d => (
                  <div key={d.id} className={estilos.revisaoItem}>
                    <span>{d.nome}</span>
                    <strong>{d.abertura} às {d.fechamento}</strong>
                  </div>
                ))}
                {horarios.filter(d => !d.aberto).length > 0 && (
                  <div className={estilos.revisaoItem}>
                    <span>Fechado</span>
                    <strong>{horarios.filter(d => !d.aberto).map(d => d.nome).join(', ')}</strong>
                  </div>
                )}
              </div>

              <div className={estilos.revisaoSecao}>
                <h4 className={estilos.revisaoTitulo}>Formas de Pagamento</h4>
                <div className={estilos.revisaoItem}>
                  <span>Aceitas</span>
                  <strong>{pagamentosSelecionados || '—'}</strong>
                </div>
              </div>
            </div>
          )}

          {/* NAVEGAÇÃO */}
          <div className={estilos.acoes}>
            {etapaAtual > 0 ? (
              <Botao type="button" variante="secundario" onClick={voltar}>
                Voltar
              </Botao>
            ) : (
              <div></div>
            )}
            
            {etapaAtual < ETAPAS.length - 1 ? (
              <Botao type="button" variante="primario" onClick={avancar}>
                Continuar
              </Botao>
            ) : (
              <Botao type="button" variante="primario" onClick={finalizar}>
                Confirmar e Finalizar
              </Botao>
            )}
          </div>
        </Cartao>

        <div className={estilos.rodape}>
          Já tem uma conta?{' '}
          <Link to="/login" className={estilos.link}>
            Faça login
          </Link>
        </div>
      </div>

      {/* MODAL SUCESSO */}
      {cadastroConcluido && (
        <div className={estilos.overlay}>
          <div className={estilos.modalSucesso}>
            <div className={estilos.circuloSucesso}>
              <CheckCircle size={40} />
            </div>
            <h2 className={estilos.titulo}>Cadastro realizado com sucesso!</h2>
            <p className={estilos.subtitulo}>Sua loja já está pronta para usar o painel Nhac.</p>
            <Botao 
              variante="primario" 
              larguraTotal 
              onClick={() => navigate('/login')}
            >
              Ir para o login
            </Botao>
          </div>
        </div>
      )}
    </div>
  );
}
