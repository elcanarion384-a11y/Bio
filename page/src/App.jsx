import { useState } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000'

function App() {
  const [idUser, setIdUser] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const calcular = async () => {
    if (idUser.trim() === '') {
      setError('Debes indicar un ID de usuario.')
      setResultado(null)
      return
    }

    const idNumerico = Number(idUser)
    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
      setError('El ID debe ser un número entero positivo.')
      setResultado(null)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/respuestas/${idNumerico}`)
      const data = await response.json()

      if (!response.ok) {
        setResultado(null)
        setError(data.error ?? 'No se pudo consultar la base de datos.')
        return
      }

      setResultado(data)
    } catch {
      setResultado(null)
      setError('No se pudo conectar con el backend de Python (puerto 8000).')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="calculator">
      <h1>Consulta de respuestas (SQLite)</h1>
      <p>
        Introduce un ID de usuario y pulsa en calcular para pedir los datos a la DB desde
        Python.
      </p>

      <label>
        ID de usuario
        <input
          type="number"
          value={idUser}
          onChange={(event) => setIdUser(event.target.value)}
          placeholder="Ej: 21"
          min="1"
        />
      </label>

      <button type="button" onClick={calcular} disabled={loading}>
        {loading ? 'Consultando...' : 'Calcular'}
      </button>

      {error && <p className="error">{error}</p>}

      {resultado && (
        <section className="result">
          <h2>Resultado</h2>
          <p>
            <strong>ID:</strong> {resultado.iduser}
          </p>
          <p>
            <strong>Marca temporal:</strong> {resultado.timestamp}
          </p>
          <p>
            <strong>Prueba:</strong> {resultado.prueba}
          </p>
        </section>
      )}
    </main>
  )
}

export default App
