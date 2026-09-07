import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutPagina from '../../components/layout/LayoutPagina';
import Checkbox from '../../components/ui/Checkbox';
import Botao from '../../components/ui/Botao';
import { Banknote, CreditCard, Smartphone, Utensils, ShoppingBag } from 'lucide-react';
import estilos from './PaginaFormasPagamento.module.css';

const PaginaFormasPagamento = () => {
  const navigate = useNavigate();
  const [pagamentos, setPagamentos] = useState({
    dinheiro: true,
    credito: true,
    debito: true,
    pix: true,
    refeicao: false,
    alimentacao: false,
  });

  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState('');

  const toggle = (chave: keyof typeof pagamentos) => {
    setPagamentos(prev => ({ ...prev, [chave]: !prev[chave] }));
  };

  const handleSalvar = () => {
    const selecionado = Object.values(pagamentos).some(v => v);
    if (!selecionado) {
      setErro('Selecione pelo menos uma forma de pagamento');
      return;
    }
    setErro('');
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  const opcoes = [
    { chave: 'dinheiro' as const, icone: Banknote, rotulo: 'Dinheiro' },
    { chave: 'credito' as const, icone: CreditCard, rotulo: 'Cartão de Crédito' },
    { chave: 'debito' as const, icone: CreditCard, rotulo: 'Cartão de Débito' },
    { chave: 'pix' as const, icone: Smartphone, rotulo: 'Pix' },
    { chave: 'refeicao' as const, icone: Utensils, rotulo: 'Vale-refeição' },
    { chave: 'alimentacao' as const, icone: ShoppingBag, rotulo: 'Vale-alimentação' },
  ];

  return (
    <LayoutPagina titulo="Formas de pagamento">
      <div className={estilos.container}>
        <p className={estilos.descricao}>
          Selecione as formas de pagamento que sua loja aceita.
        </p>

        {erro && <span className={estilos.erro}>{erro}</span>}

        <div className={estilos.gridPagamentos}>
          {opcoes.map(({ chave, icone: Icone, rotulo }) => (
            <div
              key={chave}
              className={`${estilos.cartaoPagamento} ${pagamentos[chave] ? estilos.selecionado : ''}`}
              onClick={() => toggle(chave)}
            >
              <Icone size={24} className={estilos.iconePagamento} />
              <span className={estilos.rotuloPagamento}>{rotulo}</span>
              <div style={{ marginLeft: 'auto' }}>
                <Checkbox marcado={pagamentos[chave]} aoMudar={() => {}} rotulo="" />
              </div>
            </div>
          ))}
        </div>

        <div className={estilos.acoes}>
          {salvo && <span className={estilos.sucessoMsg}>✓ Formas de pagamento salvas!</span>}
          <Botao variante="fantasma" onClick={() => navigate('/configuracoes')}>
            Cancelar
          </Botao>
          <Botao variante="primario" onClick={handleSalvar}>
            Salvar
          </Botao>
        </div>
      </div>
    </LayoutPagina>
  );
};

export default PaginaFormasPagamento;
