import { Navigate, useLocation } from 'react-router-dom'
import { getCrianca, getPlano } from '../services/dadosLocais'

// Protege rotas que precisam de login e onboarding
function ProtectedRoute({ children, semOnboarding }) {
  const token = localStorage.getItem('cognify_token')
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Rotas de onboarding não exigem criança/plano cadastrados
  if (!semOnboarding) {
    const crianca = getCrianca()
    const plano = getPlano()

    if (!crianca && location.pathname !== '/cadastro-crianca') {
      return <Navigate to="/cadastro-crianca" replace />
    }

    if (crianca && !plano && location.pathname !== '/planos') {
      return <Navigate to="/planos" replace />
    }
  }

  return children
}

export default ProtectedRoute
