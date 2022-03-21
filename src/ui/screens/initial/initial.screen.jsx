import { useNavigate } from 'react-router-dom';
import { STAR_WARS_LOGO } from '../../../assets/images';
import { useGlobalUser } from '../../../context';
import { QuizStatusEnum } from '../../../enum';
import { useQuiz } from '../../../services';
import USERS from '../../../users'

import './initial.css'

export function InitialScreen() {
  const navigate = useNavigate()
  const [user, setUser] = useGlobalUser()
  const { changeStatus } = useQuiz()

  function handleGoToQuestions() {
    navigate('/questions')
    changeStatus(QuizStatusEnum.STARTED)
  }

  function handleSelectUser(event) {
    const user = USERS.find((user) => user.user === event.target.value)

    setUser({
      ...user,
    })
  }

  return (
    <div className="initial">
      <span className="initial_title">Quiz #1</span>

      <img src={STAR_WARS_LOGO} className="initial_star-wars-logo" />

      {user.isHost ? (
        <button className="initial_start-button" onClick={handleGoToQuestions}>
          Iniciar
        </button>
      ) : (
        <select name="select-user" className="initial_select-button" onChange={handleSelectUser}>
          <option disabled defaultValue value> -- Escolha seu Jedi -- </option>
          {USERS.map((user) => (
            <option value={user.user} key={user.user}>{user.name}</option>
          ))}
        </select>
      )}
    </div>
  )
}