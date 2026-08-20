import { useEffect, useState } from 'react'
import useFetch from './useFetch'
import { explainApiError } from '../utils/errorMessages'

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
      (err) => setTrainerError(explainApiError(err, 'No se pudieron cargar los entrenadores.'))
    )
  }, [])

  return { trainers, isLoadingTrainers, trainerError }
}

export default useTrainers
