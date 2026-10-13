import { formatarPreco } from '../utils/formatarPreco'
import { produtoTemPrecoValido } from '../utils/carrinho'

export default function PainelLojista({ produtos = [], listaEsperas = [] }) {
    const categorias = ['roupas', 'eletronicos', 'acessorios', 'casa']

    const resumoPorCategoria = categorias.map((categoria) => {
        const itens = produtos.filter((produto) => produto.category === categoria)

        const valorEmEstoque = itens.reduce((total, produto) => {
            if (!produtoTemPrecoValido(produto)) {
                return total
            }

            return total + Number(produto.price) * Number(produto.estoque || 0)
        }, 0)

        const lucroEstimado = itens.reduce((total, produto) => {
            const precoAtual = Number(produto.price)
            const precoOriginal = Number(produto.precoOriginal ?? produto.price)

            if (!Number.isFinite(precoAtual) || !Number.isFinite(precoOriginal)) {
                return total
            }

            const margem = Math.max(precoOriginal - precoAtual, 0)
            return total + margem * Number(produto.estoque || 0)
        }, 0)

        return {
            categoria,
            itens,
            valorEmEstoque,
            lucroEstimado,
            semPreco: itens.filter((produto) => !produtoTemPrecoValido(produto)).length,
            esgotados: itens.filter((produto) => Number(produto.estoque) === 0).length,
            esperandoRetorno: itens.filter((produto) => Number(produto.estoque) === 0).length,
        }
    })

    const produtosSemPreco = produtos.filter((produto) => !produtoTemPrecoValido(produto))

    const clientesEsperando = listaEsperas.length

    return (
        <section>
            <p className="sobretitulo">Painel do lojista</p>
            <h1>Visão geral da loja</h1>

            <div className="grade" style={{ marginBottom: '2rem' }}>
                <div className="resumo">
                    <h2 className="resumo-titulo">Capital em estoque</h2>
                    <p className="detalhe-preco" style={{ fontSize: '1.8rem' }}>
                        {formatarPreco(
                            resumoPorCategoria.reduce((total, categoria) => total + categoria.valorEmEstoque, 0)
                        )}
                    </p>
                </div>

                <div className="resumo">
                    <h2 className="resumo-titulo">Produtos sem preço</h2>
                    <p className="detalhe-preco" style={{ fontSize: '1.8rem' }}>
                        {produtosSemPreco.length}
                    </p>
                </div>

                <div className="resumo">
                    <h2 className="resumo-titulo">Clientes na lista de espera</h2>
                    <p className="detalhe-preco" style={{ fontSize: '1.8rem' }}>
                        {clientesEsperando}
                    </p>
                </div>
            </div>

            <div className="tabela-moldura" style={{ marginBottom: '2rem' }}>
                <table className="tabela">
                    <thead>
                        <tr>
                            <th>Categoria</th>
                            <th>Valor em estoque</th>
                            <th>Lucro estimado</th>
                            <th>Sem preço</th>
                            <th>Esgotados</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resumoPorCategoria.map((categoria) => (
                            <tr key={categoria.categoria}>
                                <td>{categoria.categoria}</td>
                                <td>{formatarPreco(categoria.valorEmEstoque)}</td>
                                <td>{formatarPreco(categoria.lucroEstimado)}</td>
                                <td>{categoria.semPreco}</td>
                                <td>{categoria.esgotados}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="carrinho-layout">
                <div className="resumo">
                    <h2 className="resumo-titulo">Produtos esperando preço</h2>
                    {produtosSemPreco.length === 0 ? (
                        <p className="aviso">Nenhum item está parado esperando definição de preço.</p>
                    ) : (
                        <ul className="lista-carrinho">
                            {produtosSemPreco.map((produto) => (
                                <li key={produto.id} className="item-carrinho" style={{ display: 'block' }}>
                                    <p className="item-titulo">{produto.title}</p>
                                    <p className="item-preco">{produto.category}</p>
                                    <p className="item-preco">Estoque: {produto.estoque}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="resumo">
                    <h2 className="resumo-titulo">Clientes esperando retorno</h2>
                    {clientesEsperando === 0 ? (
                        <p className="aviso">Nenhum cliente aguardando produto esgotado no momento.</p>
                    ) : (
                        <ul className="lista-carrinho">
                            {listaEsperas.map((item) => {
                                const produto = produtos.find((produtoAtual) => produtoAtual.id === item.produtoId)

                                return (
                                    <li key={item.id} className="item-carrinho" style={{ display: 'block' }}>
                                        <p className="item-titulo">{produto ? produto.title : 'Produto removido'}</p>
                                        <p className="item-preco">{item.nome}</p>
                                        <p className="item-preco">{item.email}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    )
}
