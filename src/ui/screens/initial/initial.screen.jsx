import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STAR_WARS_LOGO } from '../../../assets/images';
import { useGlobalQuiz, useGlobalUser } from '../../../context';
import { QuizStatusEnum } from '../../../enum';
import { useQuiz } from '../../../hooks';
import USERS from '../../../users'

import './initial.css'

export function InitialScreen() {
  const navigate = useNavigate()
  const [user, setUser] = useGlobalUser()
  const [{ quizNumber, host }] = useGlobalQuiz()
  const { changeStatus } = useQuiz()
  const [code, setCode] = useState('')

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

  function handleCodeChange(e) {
    setCode(e.target.value)
  }

  useEffect(() => {
    setUser({})
  }, [])

  const hasSelectedUser = !!user?.user
  const isHost = hasSelectedUser && host?.user === user?.user
  const isHostAuthenticated = code === host?.code

  return (
    <div className="initial">
      <span className="initial_title">Quiz #{quizNumber}</span>

      <img src={STAR_WARS_LOGO} className="initial_star-wars-logo" />

      {isHostAuthenticated ? (
        <button className="initial_start-button" onClick={handleGoToQuestions}>
          Iniciar
        </button>
      ) : (
        <select name="select-user" className="initial_select-button" onChange={handleSelectUser} defaultValue="defaultValue">
          <option disabled value="defaultValue"> -- Escolha seu Jedi -- </option>
          {USERS.map((user) => (
            <option value={user.user} key={user.user}>{user.name}</option>
          ))}
        </select>
      )}

      {isHost && !isHostAuthenticated && (
        <input
          placeholder="Código de acesso"
          value={code}
          type="password"
          onChange={handleCodeChange}
          className="initial_input"
        />
      )}

      {hasSelectedUser && !isHost && (
        <span className="initial_wait-message">Aguarde o host iniciar o quiz</span>
      )}
    </div>
  )
}