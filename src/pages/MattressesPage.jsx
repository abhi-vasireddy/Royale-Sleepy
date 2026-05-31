// src/pages/MattressesPage.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../config/firebase'
import { PRODUCT_CATEGORIES, DEFAULT_PRODUCTS } from '../utils/constants'
import ProductCard from '../components/products/ProductCard'
import ProductModal from '../components/products/ProductModal'

export default function MattressesPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setProducts(data.length > 0 ? data : DEFAULT_PRODUCTS)
      } catch {
        setProducts(DEFAULT_PRODUCTS)
      }
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === 'All' || p.category === activeCategory
      return matchSearch && matchCategory
    })
  }, [products, search, activeCategory])

  return (
    <div className="min-h-screen pt-24 pb-20 bg-luxury">
      {/* Hero header */}
      <div className="bg-charcoal py-16 px-4 text-center mb-12">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-gold text-xs tracking-[0.4em] uppercase font-body mb-3"
        >
          Our Collection
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl font-bold text-warm-white mb-4"
        >
          Premium Mattresses
        </motion.h1>
        <div className="gold-divider mb-4" />
        <p className="text-warm-white/60 font-body max-w-lg mx-auto">
          Every mattress crafted for exceptional comfort. Find yours.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search + Filter bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mink/50">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search mattresses..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gold-light bg-warm-white text-charcoal font-body text-sm placeholder-mink/40 outline-none focus:border-gold transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PRODUCT_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-body transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gold text-white shadow-sm'
                    : 'border border-gold-light text-mink hover:border-gold bg-warm-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-mink/60 font-body mb-6">
          {filtered.length} {filtered.length === 1 ? 'mattress' : 'mattresses'} found
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="luxury-card h-80 bg-beige animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🛏️</span>
            <h3 className="font-display text-xl text-charcoal mb-2">No mattresses found</h3>
            <p className="text-mink font-body text-sm">Try a different search or category</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All') }} className="btn-gold mt-4">
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  )
}
