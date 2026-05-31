import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import WhatsAppFloat from './components/common/WhatsAppFloat'
import AIChatbot from './components/common/AIChatbot'
import Home from './pages/Home'
import Mattresses from './pages/Mattresses'
import About from './pages/About'
import Reviews from './pages/Reviews'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

// Protected route for admin
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/admin" replace />
}

// Main layout with navbar/footer
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
      <AIChatbot />
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/mattresses" element={<PublicLayout><Mattresses /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/reviews" element={<PublicLayout><Reviews /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'Poppins, sans-serif', fontSize: '14px', borderRadius: '12px' }
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}
