import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../common/ProductCard'
import ProductModal from '../products/ProductModal'

export default function FeaturedCollection() {
  const { products, loading } = useProducts(true)
  const [selected, setSelected] = React.useState(null)

  return (
    <section className="py-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold text-sm tracking-[0.4em] uppercase font-medium mb-4">Featured</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-charcoal">Our Finest Collection</h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-6" />
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-beige rounded-2xl aspect-[4/3] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 6).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <ProductCard product={product} onClick={setSelected} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/mattresses"
            className="inline-flex items-center gap-2 border-2 border-gold text-gold hover:bg-gold hover:text-white px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105"
          >
            View All Mattresses
          </Link>
        </div>
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
