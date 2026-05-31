import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/common/ProductCard'
import ProductModal from '../components/products/ProductModal'
import { CATEGORIES } from '../utils/constants'

export default function Mattresses() {
  const { products, loading } = useProducts()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = products.filter(p => {
    const matchCat = category === 'All' || p.category === category
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQuery
  })

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-beige/40 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-gold text-sm tracking-[0.4em] uppercase font-medium mb-4">Our Range</p>
            <h1 className="font-serif text-5xl sm:text-6xl text-charcoal">Our Mattresses</h1>
            <p className="text-warm-gray text-lg mt-4 max-w-xl mx-auto">
              Explore our curated collection of premium mattresses, crafted for every sleep style.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 bg-warm-white/95 backdrop-blur-sm border-b border-beige py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
            <input
              type="text"
              placeholder="Search mattresses..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-beige rounded-full text-sm focus:outline-none focus:border-gold transition-colors bg-beige/30"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat ? 'bg-charcoal text-white' : 'bg-beige text-warm-gray hover:bg-charcoal/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-beige rounded-2xl aspect-[4/3] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-charcoal mb-2">No mattresses found</p>
              <p className="text-warm-gray">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  <ProductCard product={product} onClick={setSelected} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
