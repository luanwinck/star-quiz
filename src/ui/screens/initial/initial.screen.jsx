import { useNavigate } from 'react-router-dom';
import { STAR_WARS_LOGO } from '../../../assets/images';

import './initial.css'

export function InitialScreen() {
  const navigate = useNavigate()

  function handleGoToQuestions() {
    navigate('/questions')
  }

  return (
    <div className="initial">
      <span className="initial_title">Quiz #1</span>

      <img src={STAR_WARS_LOGO} className="initial_star-wars-logo" />

      <button className="initial_start-button" onClick={handleGoToQuestions}>
        Iniciar
      </button>
    </div>
  )
}