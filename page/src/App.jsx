import { useState } from 'react'
import './App.css'

function App() {
  const [valor1, setValor1] = useState('')
  const [valor2, setValor2] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')

  const calcular = () => {
    const numero1 = Number(valor1)
    const numero2 = Number(valor2)

    if (valor1.trim() === '' || valor2.trim() === '') {
      setError('Debes completar ambos valores antes de calcular.')
      setResultado(null)
      return
    }

    if (Number.isNaN(numero1) || Number.isNaN(numero2)) {
      setError('Los valores deben ser numéricos.')
      setResultado(null)
      return
    }

    setError('')
    setResultado(numero1 + numero2)
  }

  return (
    <main className="calculator">
      <h1>Calculadora simple</h1>
      <p>Ingresa dos valores y pulsa en calcular para obtener la suma.</p>

      <div className="inputs">
        <label>
          Valor 1
          <input
            type="number"
            value={valor1}
            onChange={(event) => setValor1(event.target.value)}
            placeholder="Ej: 10"
          />
        </label>

        <label>
          Valor 2
          <input
            type="number"
            value={valor2}
            onChange={(event) => setValor2(event.target.value)}
            placeholder="Ej: 5"
          />
        </label>
      </div>

      <button type="button" onClick={calcular}>
        Calcular
      </button>

      {error && <p className="error">{error}</p>}
      {resultado !== null && <p className="result">Resultado: {resultado}</p>}
    </main>
  )
}

export default App
