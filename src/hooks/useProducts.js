import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { DEMO_PRODUCTS } from '../utils/constants'

export const useProducts = (featured = false) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
        if (featured) {
          q = query(collection(db, 'products'), where('featured', '==', true))
        }
        const snap = await getDocs(q)
        if (snap.empty) {
          // Use demo data if Firestore is empty
          setProducts(featured ? DEMO_PRODUCTS.filter(p => p.featured) : DEMO_PRODUCTS)
        } else {
          setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        }
      } catch (err) {
        console.warn('Firestore error, using demo data:', err.message)
        setProducts(featured ? DEMO_PRODUCTS.filter(p => p.featured) : DEMO_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [featured])

  return { products, loading }
}
