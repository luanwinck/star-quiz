import { Route, Routes } from 'react-router-dom'
import { InitialScreen, QuestionScreen } from '../ui/screens'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<InitialScreen />} />
      <Route path="/questions" element={<QuestionScreen />} />
      {/* <Route path="*" element={<NoMatch />} /> */}
    </Routes>
  )
}