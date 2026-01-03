import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AppLayout from '../layout/AppLayout'

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <p>Loading...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default ProtectedRoute
