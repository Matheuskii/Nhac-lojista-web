import React, { useState } from 'react';
import LayoutPagina from '../../components/layout/LayoutPagina';
import Cartao from '../../components/ui/Cartao';
import InputTexto from '../../components/ui/InputTexto';
import Seletor from '../../components/ui/Seletor';
import Botao from '../../components/ui/Botao';
import { MapPin } from 'lucide-react';
import { mascaraCep, ESTADOS_BRASILEIROS } from '../../utils/formatacao';
import { lojaMock } from '../../dados/loja';
import estilos from './PaginaEnderecoLoja.module.css';

const PaginaEnderecoLoja = () => {
  const [cep, setCep] = useState(lojaMock.endereco?.cep || '');
  const [rua, setRua] = useState(lojaMock.endereco?.rua || '');
  const [numero, setNumero] = useState(lojaMock.endereco?.numero || '');
  const [complemento, setComplemento] = useState(lojaMock.endereco?.complemento || '');
  const [bairro, setBairro] = useState(lojaMock.endereco?.bairro || '');
  const [cidade, setCidade] = useState(lojaMock.endereco?.cidade || '');
  const [uf, setUf] = useState(lojaMock.endereco?.uf || '');
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [salvo, setSalvo] = useState(false);

  const buscarCep = (valorCep: string) => {
    const cepLimpo = valorCep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      setBuscandoCep(true);
      setTimeout(() => {
        setRua('Rua das Flores');
        setBairro('Bairro Centro');
        setCidade('São Paulo');
        setUf('SP');
        setBuscandoCep(false);
      }, 600);
    }
  };

  const handleSalvar = () => {
    const novosErros: Record<string, string> = {};
    if (!cep) novosErros.cep = 'CEP é obrigatório';
    if (!rua) novosErros.rua = 'Rua é obrigatória';
    if (!numero) novosErros.numero = 'Número é obrigatório';
    if (!bairro) novosErros.bairro = 'Bairro é obrigatório';
    if (!cidade) novosErros.cidade = 'Cidade é obrigatória';
    if (!uf) novosErros.uf = 'UF é obrigatório';

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({});
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  return (
    <LayoutPagina titulo="Endereço da loja">
      <div className={estilos.container}>
        <Cartao className={estilos.cartao}>
          <div className={estilos.grid}>
            <InputTexto
              rotulo="CEP"
              valor={cep}
              aoMudar={(v) => {
                const val = mascaraCep(v);
                setCep(val);
                if (val.length === 9) buscarCep(val);
              }}
              icone={<MapPin size={18} />}
              erro={erros.cep}
              obrigatorio
            />
            {buscandoCep && <span className={estilos.buscando}>Buscando endereço...</span>}

            <div className={estilos.grid2}>
              <InputTexto rotulo="Rua" valor={rua} aoMudar={setRua} erro={erros.rua} obrigatorio />
              <InputTexto rotulo="Número" valor={numero} aoMudar={setNumero} erro={erros.numero} obrigatorio />
            </div>

            <div className={estilos.grid2}>
              <InputTexto rotulo="Complemento" valor={complemento} aoMudar={setComplemento} />
              <InputTexto rotulo="Bairro" valor={bairro} aoMudar={setBairro} erro={erros.bairro} obrigatorio />
            </div>

            <div className={estilos.grid2}>
              <InputTexto rotulo="Cidade" valor={cidade} aoMudar={setCidade} erro={erros.cidade} obrigatorio />
              <Seletor
                rotulo="Estado (UF)"
                opcoes={ESTADOS_BRASILEIROS.map(u => ({ valor: u, rotulo: u }))}
                valor={uf}
                aoMudar={setUf}
                erro={erros.uf}
                obrigatorio
              />
            </div>
          </div>
        </Cartao>

        <div className={estilos.acoes}>
          {salvo && <span className={estilos.sucessoMsg}>✓ Endereço salvo com sucesso!</span>}
          <Botao variante="primario" onClick={handleSalvar}>
            Salvar endereço
          </Botao>
        </div>
      </div>
    </LayoutPagina>
  );
};

export default PaginaEnderecoLoja;
