import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import InputTexto from '../../components/ui/InputTexto';
import Botao from '../../components/ui/Botao';
import Cartao from '../../components/ui/Cartao';
import Avatar from '../../components/ui/Avatar';
import { lojaMock } from '../../dados/loja';
import { CATEGORIAS_LOJA } from '../../dados/categorias';
import estilos from './PaginaEditarInfoLoja.module.css';

const PaginaEditarInfoLoja = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState(lojaMock.nome);
  const [descricao, setDescricao] = useState(lojaMock.descricao);
  const [categoria, setCategoria] = useState(lojaMock.categoria);

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Informações da loja salvas com sucesso!');
    navigate('/configuracoes');
  };

  return (
    <LayoutPagina titulo="Editar informações">
      <form onSubmit={handleSalvar} className={estilos.form}>
        <Cartao className={estilos.secao}>
          <div className={estilos.linhaFoto}>
            <Avatar nome={nome || lojaMock.nome} tamanho="medio" />
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
          <Botao type="submit" variante="primario">Salvar</Botao>
        </div>
      </form>
    </LayoutPagina>
  );
};

export default PaginaEditarInfoLoja;
