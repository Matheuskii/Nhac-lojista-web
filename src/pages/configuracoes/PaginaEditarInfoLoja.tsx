import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import InputTexto from '../../components/ui/InputTexto';
import Botao from '../../components/ui/Botao';
import Cartao from '../../components/ui/Cartao';
import Avatar from '../../components/ui/Avatar';
import { CATEGORIAS_LOJA } from '../../dados/categorias';
import { useLoja } from '../../contexts/LojaContext';
import { atualizarLoja } from '../../services/api';
import { tratarErroApi } from '../../utils/errosApi';
import { useToast } from '../../contexts/ToastContext';
import estilos from './PaginaEditarInfoLoja.module.css';

const PaginaEditarInfoLoja = () => {
  const navigate = useNavigate();
  const { loja, recarregar } = useLoja();
  const { mostrarToast } = useToast();
  const [nome, setNome] = useState(loja?.nome ?? '');
  const [descricao, setDescricao] = useState(loja?.descricao ?? '');
  const [categoria, setCategoria] = useState(loja?.categoria ?? '');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loja?.id) return;

    setSalvando(true);
    setErro('');
    try {
      await atualizarLoja(loja.id, { nome, descricao, categoria });
      await recarregar();
      navigate('/configuracoes');
    } catch (err) {
      const tratado = tratarErroApi(err);
      if (tratado.toastGenerico) {
        mostrarToast(tratado.mensagemGeral ?? 'Erro interno.');
      } else {
        setErro(tratado.mensagemGeral ?? 'Erro ao salvar informações.');
      }
    } finally {
      setSalvando(false);
    }
  };

  if (!loja) {
    return (
      <LayoutPagina titulo="Editar informações">
        <p>Carregando dados da loja...</p>
      </LayoutPagina>
    );
  }

  return (
    <LayoutPagina titulo="Editar informações">
      <form onSubmit={handleSalvar} className={estilos.form}>
        {erro && (
          <div style={{ color: 'var(--nhac-erro, #e53935)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {erro}
          </div>
        )}

        <Cartao className={estilos.secao}>
          <div className={estilos.linhaFoto}>
            <Avatar nome={nome || loja.nome} tamanho="medio" />
            <div className={estilos.infoFoto}>
              <span className={estilos.tituloFoto}>Foto ou logo da loja</span>
              <button type="button" className={estilos.linkAlterarFoto}>Alterar foto</button>
            </div>
          </div>

          <InputTexto rotulo="Nome da loja" valor={nome} aoMudar={setNome} obrigatorio />

          <div className={estilos.categorias}>
            <span className={estilos.rotuloCategorias}>Categoria</span>
            <div className={estilos.tagsWrapper}>
              {CATEGORIAS_LOJA.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`${estilos.tag} ${categoria === cat ? estilos.tagSelecionada : ''}`}
                  onClick={() => setCategoria(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <InputTexto rotulo="Descrição" valor={descricao} aoMudar={setDescricao} />
        </Cartao>

        <div className={estilos.acoes}>
          <Botao type="button" variante="fantasma" onClick={() => navigate('/configuracoes')}>Cancelar</Botao>
          <Botao type="submit" variante="primario" carregando={salvando}>Salvar</Botao>
        </div>
      </form>
    </LayoutPagina>
  );
};

export default PaginaEditarInfoLoja;
