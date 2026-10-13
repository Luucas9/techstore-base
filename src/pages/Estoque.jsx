// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos, listaEsperas = [] }) {
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  const esperasPorProduto = listaEsperas.reduce((acumulador, item) => {
    const produto = produtos.find((produtoAtual) => produtoAtual.id === item.produtoId)

    if (!produto) {
      return acumulador
    }

    if (!acumulador[produto.id]) {
      acumulador[produto.id] = { produto, pessoas: [] }
    }

    acumulador[produto.id].pessoas.push({ nome: item.nome, email: item.email })
    return acumulador
  }, {})

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {produto.estoque > 0 && produto.estoque < 5 && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="resumo" style={{ marginTop: '2rem' }}>
        <h2 className="resumo-titulo">Lista de espera</h2>
        {Object.values(esperasPorProduto).length === 0 ? (
          <p className="aviso">Nenhum cliente aguardando retorno no momento.</p>
        ) : (
          <ul className="lista-carrinho">
            {Object.values(esperasPorProduto).map(({ produto, pessoas }) => (
              <li key={produto.id} className="item-carrinho" style={{ display: 'block' }}>
                <p className="item-titulo">{produto.title}</p>
                <ul>
                  {pessoas.map((pessoa, index) => (
                    <li key={`${produto.id}-${pessoa.email}-${index}`}>
                      {pessoa.nome} — {pessoa.email}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
