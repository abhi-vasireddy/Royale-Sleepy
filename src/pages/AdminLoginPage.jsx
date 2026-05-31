// src/pages/AdminLoginPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Invalid credentials. Please check your email and password.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-warm-white rounded-3xl shadow-2xl p-10 w-full max-w-sm"
      >
        {/* Top gold line */}
        <div className="h-1 bg-gradient-to-r from-gold-light via-gold to-gold-dark rounded-full mb-8 -mt-10 mx-6" />

        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-charcoal">Royale Sleepy</h1>
          <p className="text-xs tracking-[0.3em] text-gold font-body uppercase mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-body font-semibold text-charcoal/60 uppercase tracking-wider block mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@royalesleepy.in"
              className="w-full border border-gold-light rounded-xl px-4 py-3 text-sm font-body text-charcoal outline-none focus:border-gold bg-beige/40"
            />
          </div>
          <div>
            <label className="text-xs font-body font-semibold text-charcoal/60 uppercase tracking-wider block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gold-light rounded-xl px-4 py-3 text-sm font-body text-charcoal outline-none focus:border-gold bg-beige/40"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-body bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full justify-center py-3 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center text-xs text-mink/40 font-body mt-6">
          Secured access · Royale Sleepy Admin
        </p>
      </motion.div>
    </div>
  )
}
