import React, { useState, useEffect, useRef, useCallback } from 'react';
import LayoutPagina from '../../components/layout/LayoutPagina';
import Avatar from '../../components/ui/Avatar';
import Botao from '../../components/ui/Botao';
import {
  listarConversas,
  listarMensagens,
  marcarConversaComoLida,
  ConversaResumoDTO,
  MensagemDTO,
} from '../../services/api';
import { conectarChatSocket, ChatSocket } from '../../services/chatSocket';
import { tratarErroApi } from '../../utils/errosApi';
import { useToast } from '../../contexts/ToastContext';
import { formatarData, formatarHora } from '../../utils/formatacao';
import { Send, ArrowLeft, MessageSquare } from 'lucide-react';
import estilos from './PaginaChat.module.css';

const MENSAGENS_PRE_PRONTAS = [
  'Pedido confirmado! ✅',
  'Seu pedido está sendo preparado 🍳',
  'Seu pedido saiu para entrega 🚗',
  'Infelizmente não temos esse item disponível',
  'Obrigado pela preferência! ⭐',
];

const PaginaChat = () => {
  const { mostrarToast } = useToast();
  const [conversas, setConversas] = useState<ConversaResumoDTO[]>([]);
  const [conversaAtivaId, setConversaAtivaId] = useState<string | null>(null);
  const [mensagens, setMensagens] = useState<MensagemDTO[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [carregandoConversas, setCarregandoConversas] = useState(true);
  const [carregandoMensagens, setCarregandoMensagens] = useState(false);

  const socketRef = useRef<ChatSocket | null>(null);
  const desinscreverRef = useRef<(() => void) | null>(null);

  const conversaAtiva = conversas.find((c) => c.id === conversaAtivaId) ?? null;

  const carregarConversas = useCallback(async () => {
    try {
      setCarregandoConversas(true);
      const dados = await listarConversas();
      setConversas(dados);
    } catch (err) {
      const tratado = tratarErroApi(err);
      mostrarToast(tratado.mensagemGeral ?? 'Não foi possível carregar as conversas.');
    } finally {
      setCarregandoConversas(false);
    }
  }, [mostrarToast]);

  useEffect(() => {
    const socket = conectarChatSocket();
    socket.aoErro((mensagem) => mostrarToast(mensagem));
    socketRef.current = socket;

    carregarConversas();

    return () => {
      desinscreverRef.current?.();
      socket.desconectar();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelecionarConversa = async (id: string) => {
    desinscreverRef.current?.();
    setConversaAtivaId(id);
    setMensagens([]);

    try {
      setCarregandoMensagens(true);
      const historico = await listarMensagens(id);
      // backend devolve mais recente primeiro — inverte pra renderizar antiga -> nova
      setMensagens([...historico].reverse());
    } catch (err) {
      const tratado = tratarErroApi(err);
      mostrarToast(tratado.mensagemGeral ?? 'Não foi possível carregar o histórico.');
    } finally {
      setCarregandoMensagens(false);
    }

    marcarConversaComoLida(id).catch(() => {
      /* melhor esforço — não bloqueia a experiência se falhar */
    });
    setConversas((atual) => atual.map((c) => (c.id === id ? { ...c, naoLidas: 0 } : c)));

    if (socketRef.current) {
      desinscreverRef.current = socketRef.current.assinarConversa(id, (mensagem) => {
        setMensagens((atual) => [...atual, mensagem]);
        setConversas((atual) =>
          atual.map((c) =>
            c.id === mensagem.conversaId
              ? { ...c, ultimaMensagemPreview: mensagem.conteudo, ultimaMensagemEm: mensagem.enviadaEm }
              : c
          )
        );
      });
    }
  };

  const handleEnviar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!novaMensagem.trim() || !conversaAtiva || !socketRef.current) return;

    // Não adiciona a mensagem localmente aqui — o backend faz o broadcast de
    // volta pro remetente também (a assinatura em /topic/conversas/{id} já
    // está ativa pra essa conversa), então ela chega pelo mesmo caminho que
    // a mensagem do cliente chegaria.
    socketRef.current.enviarMensagem(conversaAtiva.id, novaMensagem.trim());
    setNovaMensagem('');
  };

  const usarMensagemRapida = (texto: string) => {
    setNovaMensagem(texto);
  };

  return (
    <LayoutPagina titulo="Chat">
      <div className={estilos.container}>
        <div className={`${estilos.listaConversas} ${conversaAtivaId ? estilos.esconderMobile : ''}`}>
          {carregandoConversas ? (
            <p style={{ padding: '1rem', color: 'var(--nhac-texto-claro)' }}>Carregando conversas...</p>
          ) : conversas.length === 0 ? (
            <p style={{ padding: '1rem', color: 'var(--nhac-texto-claro)' }}>Nenhuma conversa ainda.</p>
          ) : (
            conversas.map((conversa) => (
              <div
                key={conversa.id}
                className={`${estilos.itemConversa} ${conversaAtivaId === conversa.id ? estilos.ativo : ''}`}
                onClick={() => handleSelecionarConversa(conversa.id)}
              >
                <Avatar nome={conversa.clienteNome} tamanho="medio" />
                <div className={estilos.infoConversa}>
                  <div className={estilos.linhaTopo}>
                    <span className={estilos.nomeCliente}>{conversa.clienteNome}</span>
                    <span className={estilos.tempo}>{formatarData(conversa.ultimaMensagemEm).split(' ')[0]}</span>
                  </div>
                  <div className={estilos.linhaBase}>
                    <span className={estilos.previa}>{conversa.ultimaMensagemPreview ?? 'Sem mensagens ainda'}</span>
                  </div>
                </div>
                {conversa.naoLidas > 0 && <div className={estilos.badge}>{conversa.naoLidas}</div>}
              </div>
            ))
          )}
        </div>

        <div className={`${estilos.areaChat} ${!conversaAtivaId ? estilos.esconderMobile : ''}`}>
          {conversaAtiva ? (
            <>
              <header className={estilos.cabecalhoChat}>
                <button className={estilos.voltarMobile} onClick={() => setConversaAtivaId(null)}>
                  <ArrowLeft size={24} />
                </button>
                <Avatar nome={conversaAtiva.clienteNome} tamanho="pequeno" />
                <div className={estilos.cabecalhoInfo}>
                  <h3 className={estilos.chatNome}>{conversaAtiva.clienteNome}</h3>
                </div>
              </header>

              <div className={estilos.mensagensContainer}>
                <div className={estilos.mensagens}>
                  {carregandoMensagens ? (
                    <p style={{ color: 'var(--nhac-texto-claro)', textAlign: 'center' }}>Carregando mensagens...</p>
                  ) : (
                    mensagens.map((msg) => (
                      <div
                        key={msg.id}
                        className={`${estilos.mensagemWrapper} ${msg.remetenteTipo === 'LOJA' ? estilos.minhaMensagem : estilos.mensagemCliente}`}
                      >
                        <div className={estilos.balao}>{msg.conteudo}</div>
                        <span className={estilos.hora}>{formatarHora(msg.enviadaEm)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={estilos.areaEnvio}>
                <div className={estilos.mensagensRapidas}>
                  {MENSAGENS_PRE_PRONTAS.map((msg, idx) => (
                    <button key={idx} className={estilos.btnMensagemRapida} onClick={() => usarMensagemRapida(msg)}>
                      {msg}
                    </button>
                  ))}
                </div>
                <form className={estilos.formEnvio} onSubmit={handleEnviar}>
                  <input
                    type="text"
                    className={estilos.inputMensagem}
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    placeholder="Digite sua mensagem..."
                  />
                  <Botao type="submit" icone={<Send size={20} />} disabled={!novaMensagem.trim()} />
                </form>
              </div>
            </>
          ) : (
            <div className={estilos.estadoVazio}>
              <MessageSquare size={48} color="var(--nhac-borda)" />
              <p>Selecione uma conversa para começar a falar</p>
            </div>
          )}
        </div>
      </div>
    </LayoutPagina>
  );
};

export default PaginaChat;
