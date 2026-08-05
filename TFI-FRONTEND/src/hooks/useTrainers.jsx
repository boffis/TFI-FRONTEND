import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../services/authContext/AuthContext'
import { getApiUrl } from '../utils/apiUrl'

/**
 * Fetches the list of active trainers from GET /user/activeTrainers.
 * Returns { trainers, isLoadingTrainers, trainerError }.
 */
const useTrainers = () => {
  const { user } = useContext(AuthContext)
  const [trainers, setTrainers] = useState([])
  const [isLoadingTrainers, setIsLoadingTrainers] = useState(false)
  const [trainerError, setTrainerError] = useState(null)

  useEffect(() => {
    setIsLoadingTrainers(true)
    fetch(getApiUrl('user/activeTrainers'), {
      method: 'GET',
      headers: { Authorization: `Bearer ${user?.token}` },
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.message || 'Failed to load trainers.')
        }
        return res.json()
      })
      .then(data => setTrainers(Array.isArray(data) ? data : []))
      .catch(err => setTrainerError(err.message ?? 'Failed to load trainers.'))
      .finally(() => setIsLoadingTrainers(false))
  }, [])

  return { trainers, isLoadingTrainers, trainerError }
}

export default useTrainers
