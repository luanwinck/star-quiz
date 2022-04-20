import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { CreateQuizScreen, InitialScreen, QuestionScreen, RankingScreen, ResultsScreen } from '../ui/screens'
import { useGlobalQuiz, useGlobalUser } from '../context'
import { QuizStatusEnum } from '../enum'
import { Loader } from '../ui/components'

const redirectPaths = {
  [QuizStatusEnum.NOT_STARTED]: '/initial',
  [QuizStatusEnum.STARTED]: '/questions',
  [QuizStatusEnum.FINISHED]: '/results',
}

const publicPaths = ['/create-quiz']

export function AppRoutes() {
  const [quiz] = useGlobalQuiz()
  const [{ user }] = useGlobalUser()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (publicPaths.includes(location.pathname)) {
      return
    }

    if (!user && !quiz.status) {
      navigate('/')
      return
    }

    if (!user) {
      navigate('/initial')
      return
    }

    const redirectTo = redirectPaths[quiz.status]

    if (redirectTo) navigate(redirectTo)
  }, [quiz.status, user])

  return (
    <Routes>
      <Route path="/" element={<Loader />} />
      <Route path="/initial" element={<InitialScreen />} />
      <Route path="/questions" element={<QuestionScreen />} />
      <Route path="/results" element={<ResultsScreen />} />
      <Route path="/ranking" element={<RankingScreen />} />
      <Route path="/create-quiz" element={<CreateQuizScreen />} />
      <Route path="/*" element={<Loader />} />
    </Routes>
  )
}