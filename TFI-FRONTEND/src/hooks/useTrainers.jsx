import { useEffect, useState } from 'react'
import useFetch from './useFetch'

/** Active trainers from GET /user/activeTrainers. */
const useTrainers = () => {
  const { get, isLoading: isLoadingTrainers } = useFetch()
  const [trainers, setTrainers] = useState([])
  const [trainerError, setTrainerError] = useState(null)

  useEffect(() => {
    get(
      'user/activeTrainers',
      true,
      (data) => setTrainers(Array.isArray(data) ? data : []),
      (err) => setTrainerError(err?.message ?? 'No se pudieron cargar los entrenadores.')
    )
  }, [])

  return { trainers, isLoadingTrainers, trainerError }
}

export default useTrainers
