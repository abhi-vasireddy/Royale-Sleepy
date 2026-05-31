// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { SITE_CONFIG, WHATSAPP_MESSAGES, WHY_CHOOSE_US, DEFAULT_PRODUCTS, DEFAULT_REVIEWS } from '../utils/constants'
import ProductCard from '../components/products/ProductCard'
import ProductModal from '../components/products/ProductModal'

// ---- Reveal animation wrapper ----
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ---- Hero Section ----
function HeroSection({ heroData }) {
  const waLink = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.inquiry)}`

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video / Image background */}
      {heroData?.videoUrl ? (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={heroData.videoUrl}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroData?.imageUrl || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=85'})`
          }}
        />
      )}

      {/* Luxury overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal/70 via-charcoal/50 to-charcoal/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gold text-sm tracking-[0.4em] uppercase font-body mb-4"
        >
          Berhampur's Finest Mattress Showroom
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-warm-white leading-[1.05] mb-6"
        >
          {heroData?.heading || 'Sleep Better.'}<br />
          <span className="text-gradient-gold italic">Live Better.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-body text-warm-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {heroData?.subheading || 'Premium mattresses designed for ultimate comfort. Experience the luxury of perfect sleep.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/mattresses" className="btn-gold text-base px-8 py-4">
            Explore Collection
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-base px-8 py-4"
          >
            <span>💬</span>
            <span>WhatsApp Inquiry</span>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <p className="text-warm-white/50 text-xs font-body tracking-widest uppercase">Scroll</p>
        <div className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent" />
      </motion.div>
    </section>
  )
}

// ---- Featured Products Section ----
function FeaturedSection({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const featured = products.filter(p => p.featured).slice(0, 3)

  return (
    <section className="py-20 px-4 bg-luxury">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-body mb-3">Our Collection</p>
          <h2 className="section-title mb-4">Featured Mattresses</h2>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle max-w-xl mx-auto">
            Handpicked for exceptional quality, comfort, and lasting craftsmanship.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {(featured.length > 0 ? featured : DEFAULT_PRODUCTS.slice(0, 3)).map((product, i) => (
            <Reveal key={product.id} delay={i * 0.1}>
              <ProductCard product={product} onClick={() => setSelectedProduct(product)} />
            </Reveal>
          ))}
        </div>

        <div className="text-center">
          <Link to="/mattresses" className="btn-outline text-base px-8 py-4">
            View All Mattresses →
          </Link>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  )
}

// ---- Why Choose Us ----
function WhyChooseUsSection() {
  return (
    <section className="py-20 px-4 bg-charcoal">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-body mb-3">Why Us</p>
          <h2 className="font-display text-4xl font-bold text-warm-white mb-4">
            The Royale Sleepy Promise
          </h2>
          <div className="gold-divider mb-4" />
          <p className="text-warm-white/60 font-body max-w-xl mx-auto">
            More than a mattress — it's a commitment to your best sleep, every night.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="p-6 bg-warm-white/5 border border-warm-white/10 rounded-2xl hover:border-gold/40 hover:bg-warm-white/8 transition-all duration-300 group">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-display text-lg font-semibold text-warm-white mb-2 group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-warm-white/55 font-body text-sm leading-relaxed">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---- Video Banner Section ----
function VideoBannerSection({ videoUrl }) {
  return (
    <section className="relative h-80 md:h-96 overflow-hidden">
      {videoUrl ? (
        <video autoPlay muted loop playsInline className="w-full h-full object-cover" src={videoUrl} />
      ) : (
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1560185009-5bf9f2849488?w=1200&q=80)` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 to-charcoal/20 flex items-center px-8 md:px-20">
        <div className="max-w-lg">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-white mb-4">
            Visit Our Showroom
          </h2>
          <p className="text-warm-white/75 font-body mb-6">
            Experience every mattress in person. Our sleep consultants guide you to your perfect choice.
          </p>
          <Link to="/contact" className="btn-gold">
            Get Directions →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ---- Testimonials Section ----
function TestimonialsSection({ reviews }) {
  const displayReviews = reviews.length > 0 ? reviews : DEFAULT_REVIEWS

  return (
    <section className="py-20 px-4 bg-beige">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-body mb-3">Testimonials</p>
          <h2 className="section-title mb-4">What Our Customers Say</h2>
          <div className="gold-divider" />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayReviews.map((review, i) => (
            <Reveal key={review.id} delay={i * 0.1}>
              <div className="luxury-card p-6 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <span key={j} className="text-gold text-sm">★</span>
                  ))}
                </div>
                <p className="text-charcoal/75 font-body text-sm leading-relaxed flex-1 italic mb-4">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gold/20 rounded-full flex items-center justify-center text-gold font-body font-semibold text-xs">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-charcoal text-sm">{review.name}</p>
                    <p className="font-body text-mink/60 text-xs">{review.location}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/reviews" className="btn-outline">Read More Reviews →</Link>
        </div>
      </div>
    </section>
  )
}

// ---- Main HomePage ----
export default function HomePage() {
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [heroData, setHeroData] = useState(null)
  const [bannerVideoUrl, setBannerVideoUrl] = useState(null)

  useEffect(() => {
    // Fetch products
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setProducts(data)
      } catch { setProducts(DEFAULT_PRODUCTS) }
    }

    // Fetch reviews
    const fetchReviews = async () => {
      try {
        const snap = await getDocs(collection(db, 'reviews'))
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setReviews(data.slice(0, 4))
      } catch { setReviews(DEFAULT_REVIEWS) }
    }

    // Fetch homepage config
    const fetchHomepage = async () => {
      try {
        const snap = await getDoc(doc(db, 'homepage', 'config'))
        if (snap.exists()) {
          const data = snap.data()
          setHeroData(data.hero)
          setBannerVideoUrl(data.bannerVideoUrl)
        }
      } catch {}
    }

    fetchProducts()
    fetchReviews()
    fetchHomepage()
  }, [])

  return (
    <div>
      <HeroSection heroData={heroData} />
      <FeaturedSection products={products.length > 0 ? products : DEFAULT_PRODUCTS} />
      <WhyChooseUsSection />
      <VideoBannerSection videoUrl={bannerVideoUrl} />
      <TestimonialsSection reviews={reviews} />
    </div>
  )
}
