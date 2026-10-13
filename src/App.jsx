import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import PainelLojista from './pages/PainelLojista'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'
import { produtoTemPrecoValido } from './utils/carrinho'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEsperas, setListaEsperas] = useState([])

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)

      const clienteNovo = dados.find((cliente) => Number(cliente.pedidosAnteriores) === 0)
      if (dados.length > 0) {
        setClienteAtualId(clienteNovo?.id ?? dados[0].id)
      }
    })
  }, [])

  function adicionarAoCarrinho(produto) {
    if (!produto || produto.estoque === 0 || !produtoTemPrecoValido(produto)) {
      return
    }

    setCarrinho((atual) => atual.concat(produto))
  }

  function adicionarNaListaDeEspera(produtoId, nome, email) {
    const nomeLimpo = nome.trim()
    const emailLimpo = email.trim()

    if (!produtoId || !nomeLimpo || !emailLimpo) {
      return
    }

    setListaEsperas((atual) => {
      const jaExiste = atual.some(
        (item) => item.produtoId === produtoId && item.email.toLowerCase() === emailLimpo.toLowerCase()
      )

      if (jaExiste) {
        return atual
      }

      return [
        ...atual,
        {
          id: Date.now() + Math.random(),
          produtoId,
          nome: nomeLimpo,
          email: emailLimpo,
        },
      ]
    })
  }

  function removerUmaUnidade(produtoId) {
    // Remove só a primeira unidade encontrada do produto
    let removido = false
    setCarrinho((atual) =>
      atual.filter((produto) => {
        if (!removido && produto.id === produtoId) {
          removido = true
          return false
        }
        return true
      })
    )
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  onAvisar={adicionarNaListaDeEspera}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route path="/estoque" element={<Estoque produtos={produtos} listaEsperas={listaEsperas} />} />
            <Route
              path="/painel"
              element={<PainelLojista produtos={produtos} listaEsperas={listaEsperas} />}
            />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
