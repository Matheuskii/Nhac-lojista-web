import React, { useState } from 'react';
import LayoutPagina from '../../components/layout/LayoutPagina';
import Avatar from '../../components/ui/Avatar';
import Botao from '../../components/ui/Botao';
import { conversasMock } from '../../dados/conversas';
import { pedidosMock } from '../../dados/pedidos';
import { formatarData, formatarMoeda } from '../../utils/formatacao';
import { Send, ArrowLeft, MessageSquare, Receipt } from 'lucide-react';
import estilos from './PaginaChat.module.css';

const MENSAGENS_PRE_PRONTAS = [
  "Pedido confirmado! ✅",
  "Seu pedido está sendo preparado 🍳",
  "Seu pedido saiu para entrega 🚗",
  "Infelizmente não temos esse item disponível",
  "Obrigado pela preferência! ⭐"
];

const PaginaChat = () => {
  const [conversas, setConversas] = useState(conversasMock);
  const [conversaAtivaId, setConversaAtivaId] = useState<string | null>(null);
  const [novaMensagem, setNovaMensagem] = useState('');

  const conversaAtiva = conversas.find(c => c.id === conversaAtivaId);
  const pedidoAtivo = conversaAtiva ? pedidosMock.find(p => p.id === conversaAtiva.pedidoId) : null;

  const handleSelecionarConversa = (id: string) => {
    setConversaAtivaId(id);
    setConversas(conversas.map(c => c.id === id ? { ...c, naoLidas: 0 } : c));
  };

  const handleEnviar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!novaMensagem.trim() || !conversaAtiva) return;

    const nova = {
      id: Date.now().toString(),
      remetenteId: 'loja-001',
      remetenteNome: 'Burguer Mania',
      ehLoja: true,
      conteudo: novaMensagem,
      dataEnvio: new Date().toISOString(),
      lida: true
    };

    setConversas(conversas.map(c => 
      c.id === conversaAtiva.id 
        ? { ...c, mensagens: [...c.mensagens, nova], ultimaMensagem: novaMensagem, dataUltimaMensagem: new Date().toISOString() }
        : c
    ));
    setNovaMensagem('');
  };

  const usarMensagemRapida = (texto: string) => {
    setNovaMensagem(texto);
  };

  return (
    <LayoutPagina titulo="Chat">
      <div className={estilos.container}>
        <div className={`${estilos.listaConversas} ${conversaAtivaId ? estilos.esconderMobile : ''}`}>
          {conversas.map(conversa => (
            <div 
              key={conversa.id} 
              className={`${estilos.itemConversa} ${conversaAtivaId === conversa.id ? estilos.ativo : ''}`}
              onClick={() => handleSelecionarConversa(conversa.id)}
            >
              <Avatar nome={conversa.clienteNome} fotoUrl={conversa.clienteFotoUrl} tamanho="medio" />
              <div className={estilos.infoConversa}>
                <div className={estilos.linhaTopo}>
                  <span className={estilos.nomeCliente}>{conversa.clienteNome}</span>
                  <span className={estilos.tempo}>{formatarData(conversa.dataUltimaMensagem).split(' ')[0]}</span>
                </div>
                <div className={estilos.linhaBase}>
                  <span className={estilos.pedido}>#{conversa.numeroPedido}</span>
                  <span className={estilos.previa}>{conversa.ultimaMensagem}</span>
                </div>
              </div>
              {conversa.naoLidas > 0 && (
                <div className={estilos.badge}>{conversa.naoLidas}</div>
              )}
            </div>
          ))}
        </div>

        <div className={`${estilos.areaChat} ${!conversaAtivaId ? estilos.esconderMobile : ''}`}>
          {conversaAtiva ? (
            <>
              <header className={estilos.cabecalhoChat}>
                <button className={estilos.voltarMobile} onClick={() => setConversaAtivaId(null)}>
                  <ArrowLeft size={24} />
                </button>
                <Avatar nome={conversaAtiva.clienteNome} fotoUrl={conversaAtiva.clienteFotoUrl} tamanho="pequeno" />
                <div className={estilos.cabecalhoInfo}>
                  <h3 className={estilos.chatNome}>{conversaAtiva.clienteNome}</h3>
                  <span className={estilos.chatPedido}>Pedido #{conversaAtiva.numeroPedido}</span>
                </div>
              </header>

              <div className={estilos.mensagensContainer}>
                <div className={estilos.mensagens}>
                  {pedidoAtivo && (
                    <div className={estilos.cardPedidoWrapper}>
                      <div className={estilos.cardPedido}>
                        <div className={estilos.cardPedidoHeader}>
                          <Receipt size={16} />
                          <span>Referência do Pedido</span>
                        </div>
                        <div className={estilos.cardPedidoContent}>
                          <div className={estilos.cardPedidoRow}>
                            <span className={estilos.cardPedidoLabel}>Pedido:</span>
                            <span className={estilos.cardPedidoValue}>#{pedidoAtivo.numeroPedido}</span>
                          </div>
                          <div className={estilos.cardPedidoRow}>
                            <span className={estilos.cardPedidoLabel}>Status:</span>
                            <span className={estilos.cardPedidoValue} style={{textTransform: 'capitalize'}}>{pedidoAtivo.status.replace('_', ' ')}</span>
                          </div>
                          <div className={estilos.cardPedidoRow}>
                            <span className={estilos.cardPedidoLabel}>Total:</span>
                            <span className={estilos.cardPedidoValue}>{formatarMoeda(pedidoAtivo.valorTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {conversaAtiva.mensagens.map(msg => (
                    <div key={msg.id} className={`${estilos.mensagemWrapper} ${msg.ehLoja ? estilos.minhaMensagem : estilos.mensagemCliente}`}>
                      <div className={estilos.balao}>
                        {msg.conteudo}
                      </div>
                      <span className={estilos.hora}>{formatarData(msg.dataEnvio)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={estilos.areaEnvio}>
                <div className={estilos.mensagensRapidas}>
                  {MENSAGENS_PRE_PRONTAS.map((msg, idx) => (
                    <button 
                      key={idx} 
                      className={estilos.btnMensagemRapida}
                      onClick={() => usarMensagemRapida(msg)}
                    >
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
