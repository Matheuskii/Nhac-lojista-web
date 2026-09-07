import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import InputTexto from '../../components/ui/InputTexto';
import Botao from '../../components/ui/Botao';
import Cartao from '../../components/ui/Cartao';
import Emblema from '../../components/ui/Emblema';
import Toggle from '../../components/ui/Toggle';
import { produtosMock } from '../../dados/produtos';
import { CATEGORIAS_PRODUTO } from '../../dados/categorias';
import { formatarMoeda } from '../../utils/formatacao';
import { Plus, Search, Edit2 } from 'lucide-react';
import estilos from './PaginaListaProdutos.module.css';

const PaginaListaProdutos = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState(produtosMock);
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  const handleToggleAtivo = (id: string, novoEstado: boolean) => {
    setProdutos(produtos.map(p => p.id === id ? { ...p, ativo: novoEstado } : p));
  };

  const produtosFiltrados = produtos.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = categoriaFiltro ? p.categoria === categoriaFiltro : true;
    return matchBusca && matchCategoria;
  });

  return (
    <LayoutPagina titulo="Produtos">
      <div className={estilos.container}>
        <header className={estilos.cabecalho}>
          <h2 className={estilos.titulo}>Seus Produtos</h2>
          <Botao 
            onClick={() => navigate('/produtos/novo')} 
            icone={<Plus size={20} />}
          >
            Novo produto
          </Botao>
        </header>

        <div className={estilos.filtros}>
          <div className={estilos.buscaWrapper}>
            <InputTexto 
              rotulo=""
              valor={busca} 
              aoMudar={setBusca} 
              placeholder="Buscar produtos..." 
              icone={<Search size={20} />}
            />
          </div>
          <div className={estilos.categoriaWrapper}>
            <button
              type="button"
              className={`${estilos.chipCategoria} ${categoriaFiltro === '' ? estilos.chipSelecionado : ''}`}
              onClick={() => setCategoriaFiltro('')}
            >
              Todas
            </button>
            {CATEGORIAS_PRODUTO.map((cat) => (
              <button
                type="button"
                key={cat}
                className={`${estilos.chipCategoria} ${categoriaFiltro === cat ? estilos.chipSelecionado : ''}`}
                onClick={() => setCategoriaFiltro(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {produtosFiltrados.length === 0 ? (
          <div className={estilos.vazio}>
            <p>Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className={estilos.grid}>
            {produtosFiltrados.map(produto => {
              return (
                <Cartao key={produto.id} className={estilos.cartaoProduto}>
                  <div className={estilos.imagemWrapper}>
                    <img src={produto.fotoUrl || 'https://placehold.co/400x300/FF6961/FFFFFF?text=Sem+Imagem'} alt={produto.nome} className={estilos.imagem} />
                  </div>
                  <div className={estilos.info}>
                    <div className={estilos.linha1}>
                      <h3 className={estilos.nome}>{produto.nome}</h3>
                      <Emblema variante="info">{produto.categoria || 'Outros'}</Emblema>
                    </div>
                    <p className={estilos.preco}>{formatarMoeda(produto.preco)}</p>
                    <div className={estilos.acoes}>
                      <Toggle 
                        ativo={produto.ativo} 
                        aoMudar={(v) => handleToggleAtivo(produto.id, v)} 
                        rotulo={produto.ativo ? 'Ativo' : 'Inativo'}
                      />
                      <Botao 
                        variante="fantasma" 
                        icone={<Edit2 size={20} />} 
                        onClick={() => navigate(`/produtos/${produto.id}`)}
                      />
                    </div>
                  </div>
                </Cartao>
              );
            })}
          </div>
        )}
      </div>
    </LayoutPagina>
  );
};

export default PaginaListaProdutos;
