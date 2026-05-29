import { Navigate } from 'react-router-dom'

// Protege rotas que precisam de login
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('cognify_token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
