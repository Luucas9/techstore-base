import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { formatarPreco, normalizarPreco } from '../utils/formatarPreco'

export default function PaginaProduto({ produtos, onAdicionar, onAvisar }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nomeAviso, setNomeAviso] = useState('')
  const [emailAviso, setEmailAviso] = useState('')
  const [mensagemAviso, setMensagemAviso] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const precoValido = normalizarPreco(produto.price) !== null
  const relacionadoDisponivel = (item) => item.estoque > 0 && normalizarPreco(item.price) !== null
  const relacionados = produtos
    .filter((item) => item.category === produto.category && item.id !== produto.id && relacionadoDisponivel(item))
    .slice(0, 4)

  function enviarAviso(evento) {
    evento.preventDefault()

    if (!nomeAviso.trim() || !emailAviso.trim()) {
      setMensagemAviso('Preencha nome e e-mail para receber o aviso.')
      return
    }

    onAvisar(produto.id, nomeAviso, emailAviso)
    setNomeAviso('')
    setEmailAviso('')
    setMensagemAviso('Você será avisado assim que o produto voltar.')
  }

  if (produto.estoque === 0) {
    return (
      <section>
        <nav className="trilha" aria-label="Você está em">
          <Link to="/">Loja</Link>
          <span aria-hidden="true">/</span>
          <span>{produto.title}</span>
        </nav>

        <div className="estado-vazio">
          <h1>{produto.title}</h1>
          <p>Este produto está esgotado no momento.</p>
          <p>Receba um aviso por e-mail assim que ele voltar ao estoque.</p>

          <form onSubmit={enviarAviso} className="cupom">
            <label htmlFor="nome-aviso" className="rotulo">
              Nome
            </label>
            <input
              id="nome-aviso"
              value={nomeAviso}
              onChange={(evento) => setNomeAviso(evento.target.value)}
              placeholder="Seu nome"
            />

            <label htmlFor="email-aviso" className="rotulo">
              E-mail
            </label>
            <input
              id="email-aviso"
              type="email"
              value={emailAviso}
              onChange={(evento) => setEmailAviso(evento.target.value)}
              placeholder="seu@email.com"
            />

            <button className="botao botao-grande" type="submit">
              Quero ser avisado
            </button>
            {mensagemAviso && <p className="mensagem-cupom">{mensagemAviso}</p>}
          </form>
        </div>
      </section>
    )
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">{formatarPreco(produto.price)}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={produto.estoque === 0 || !precoValido}
          >
            {precoValido ? 'Adicionar ao carrinho' : 'Preço indisponível'}
          </button>

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">{formatarPreco(item.price)}</p>
            <button className="botao" onClick={() => onAdicionar(item)} disabled={!normalizarPreco(item.price)}>
              {normalizarPreco(item.price) ? 'Adicionar ao carrinho' : 'Indisponível'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
