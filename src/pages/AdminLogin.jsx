import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/admin/dashboard')
    } catch {
      toast.error('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 gold-gradient rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl">🛏️</div>
          <h1 className="font-serif text-3xl text-charcoal">Admin Panel</h1>
          <p className="text-warm-gray text-sm mt-2">Royale Sleepy Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-wider text-charcoal uppercase mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="admin@royalesleepy.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-wider text-charcoal uppercase mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-beige rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-white py-4 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
