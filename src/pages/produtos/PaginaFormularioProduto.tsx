import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import InputTexto from '../../components/ui/InputTexto';
import Seletor from '../../components/ui/Seletor';
import Botao from '../../components/ui/Botao';
import Cartao from '../../components/ui/Cartao';
import Toggle from '../../components/ui/Toggle';
import ModalConfirmacao from '../../components/ui/ModalConfirmacao';
import { produtosMock } from '../../dados/produtos';
import { CATEGORIAS_PRODUTO } from '../../dados/categorias';
import { Upload, Trash2, Plus } from 'lucide-react';
import estilos from './PaginaFormularioProduto.module.css';

const PaginaFormularioProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ehEdicao = !!id && id !== 'novo';

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [adicionais, setAdicionais] = useState<any[]>([]);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

  useEffect(() => {
    if (ehEdicao) {
      const produto = produtosMock.find(p => p.id === id);
      if (produto) {
        setNome(produto.nome);
        setDescricao(produto.descricao || '');
        setPreco(produto.preco.toString());
        setCategoria(produto.categoria);
        setAtivo(produto.ativo);
      }
    }
  }, [ehEdicao, id]);

  const opcoesCategorias = [
    { valor: '', rotulo: 'Selecione uma categoria' },
    ...CATEGORIAS_PRODUTO.map(c => ({ valor: c, rotulo: c }))
  ];

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Produto salvo com sucesso!');
    navigate('/produtos');
  };

  const handleExcluir = () => {
    navigate('/produtos');
  };

  return (
    <LayoutPagina titulo={ehEdicao ? 'Editar Produto' : 'Novo Produto'}>
      <form onSubmit={handleSalvar} className={estilos.form}>
        <div className={estilos.container}>
          <Cartao className={estilos.secao}>
            <h3 className={estilos.tituloSecao}>Informações Básicas</h3>
            <div className={estilos.gridCampos}>
              <InputTexto rotulo="Nome do Produto" valor={nome} aoMudar={setNome} obrigatorio />
              <Seletor rotulo="Categoria" valor={categoria} aoMudar={setCategoria} opcoes={opcoesCategorias} obrigatorio />
              <InputTexto rotulo="Preço" tipo="number" valor={preco} aoMudar={setPreco} obrigatorio />
              <InputTexto rotulo="Descrição" valor={descricao} aoMudar={setDescricao} />
              
              <div className={estilos.uploadWrapper}>
                <span className={estilos.rotulo}>Foto do Produto</span>
                <div className={estilos.areaUpload}>
                  <Upload size={32} color="var(--nhac-primaria)" />
                  <p>Clique ou arraste uma imagem aqui</p>
                </div>
              </div>

              <div className={estilos.toggleWrapper}>
                <Toggle ativo={ativo} aoMudar={setAtivo} rotulo="Produto Ativo" />
              </div>
            </div>
          </Cartao>

          <Cartao className={estilos.secao}>
            <div className={estilos.cabecalhoSecao}>
              <h3 className={estilos.tituloSecao}>Adicionais</h3>
              <Botao type="button" variante="secundario" icone={<Plus size={16} />} onClick={() => setAdicionais([...adicionais, { nome: '', obrigatorio: false, itens: [] }])}>
                Novo Grupo
              </Botao>
            </div>
            
            {adicionais.length === 0 ? (
              <p className={estilos.vazio}>Nenhum grupo de adicional configurado.</p>
            ) : (
              <div className={estilos.listaAdicionais}>
                {adicionais.map((grupo, idx) => (
                  <div key={idx} className={estilos.grupoAdicional}>
                    <div className={estilos.linhaGrupo}>
                      <InputTexto rotulo="" valor={grupo.nome} aoMudar={(v) => {
                        const novos = [...adicionais];
                        novos[idx].nome = v;
                        setAdicionais(novos);
                      }} placeholder="Nome do grupo (ex: Escolha seu molho)" />
                      <Toggle ativo={grupo.obrigatorio} aoMudar={(v) => {
                        const novos = [...adicionais];
                        novos[idx].obrigatorio = v;
                        setAdicionais(novos);
                      }} rotulo="Obrigatório" />
                      <Botao type="button" variante="perigo" icone={<Trash2 size={16} />} onClick={() => {
                        const novos = [...adicionais];
                        novos.splice(idx, 1);
                        setAdicionais(novos);
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Cartao>
        </div>

        <div className={estilos.acoes}>
          {ehEdicao && (
            <Botao
              type="button"
              variante="perigo"
              icone={<Trash2 size={16} />}
              onClick={() => setModalExcluirAberto(true)}
            >
              Excluir produto
            </Botao>
          )}
          <div className={estilos.acoesDir}>
            <Botao type="button" variante="fantasma" onClick={() => navigate('/produtos')}>Cancelar</Botao>
            <Botao type="submit" variante="primario">Salvar Produto</Botao>
          </div>
        </div>
      </form>

      <ModalConfirmacao
        aberto={modalExcluirAberto}
        titulo="Excluir produto"
        mensagem={`Tem certeza que deseja excluir "${nome}"? Essa ação não pode ser desfeita.`}
        textoBotaoConfirmar="Excluir"
        varianteBotaoConfirmar="perigo"
        aoConfirmar={handleExcluir}
        aoCancelar={() => setModalExcluirAberto(false)}
      />
    </LayoutPagina>
  );
};

export default PaginaFormularioProduto;
