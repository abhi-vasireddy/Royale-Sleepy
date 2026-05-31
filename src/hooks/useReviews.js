import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { DEMO_REVIEWS } from '../utils/constants'

export const useReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'reviews'), orderBy('createdAt', 'desc')))
        if (snap.empty) {
          setReviews(DEMO_REVIEWS)
        } else {
          setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        }
      } catch {
        setReviews(DEMO_REVIEWS)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { reviews, loading }
}
