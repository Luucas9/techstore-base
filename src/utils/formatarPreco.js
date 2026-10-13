export function normalizarPreco(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return null
  }

  const texto = String(valor).trim().replace(/[^\d,.-]/g, '')

  if (!texto) {
    return null
  }

  let valorFormatado = texto

  if (texto.includes(',') && texto.includes('.')) {
    valorFormatado = texto.replace(/\./g, '').replace(',', '.')
  } else if (texto.includes(',')) {
    valorFormatado = texto.replace(',', '.')
  }

  const numero = Number(valorFormatado)
  return Number.isFinite(numero) ? numero : null
}

export function formatarPreco(valor) {
  const valorNormalizado = normalizarPreco(valor)

  if (valorNormalizado === null) {
    return 'Preço indisponível'
  }

  return valorNormalizado.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
