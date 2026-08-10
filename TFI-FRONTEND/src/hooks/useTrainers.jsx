import { useEffect, useState } from 'react'
import useFetch from './useFetch'

/**
 * Fetches the list of active trainers from GET /user/activeTrainers.
 * Returns { trainers, isLoadingTrainers, trainerError }.
 */
const useTrainers = () => {
  const { get, isLoading: isLoadingTrainers } = useFetch()
  const [trainers, setTrainers] = useState([])
  const [trainerError, setTrainerError] = useState(null)

  useEffect(() => {
    get(
      'user/activeTrainers',
      true,
      (data) => setTrainers(Array.isArray(data) ? data : []),
      (err) => setTrainerError(err?.message ?? 'Failed to load trainers.')
    )
  }, [])

  return { trainers, isLoadingTrainers, trainerError }
}

export default useTrainers
