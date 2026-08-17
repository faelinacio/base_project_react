import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section>
      <h1>Página não encontrada</h1>
      <p>
        Volte para a <Link to="/">página inicial</Link>.
      </p>
    </section>
  )
}
