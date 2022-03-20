import { Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { InitialScreen, QuestionScreen } from '../ui/screens'
import { useGlobalQuiz, useGlobalUser } from '../context'
import { QuizStatusEnum } from '../enum'

const redirectPaths = {
  [QuizStatusEnum.NOT_STARTED]: '/',
  [QuizStatusEnum.STARTED]: '/questions',
  [QuizStatusEnum.FINISHED]: '/result',
}

export function AppRoutes() {
  const [quiz] = useGlobalQuiz()
  const [{ user }] = useGlobalUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    const redirectTo = redirectPaths[quiz.status]

    if (redirectTo) navigate(redirectTo)
  }, [quiz.status, user])

  return (
    <Routes>
      <Route path="/" element={<InitialScreen />} />
      <Route path="/questions" element={<QuestionScreen />} />
    </Routes>
  )
}