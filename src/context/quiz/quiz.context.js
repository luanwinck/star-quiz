import createGlobalState from "react-create-global-state";

const initialState = {
  status: '',
  quizNumber: '1',
  questions: [],
  questionIndex: 0,
}

const [_useGlobalQuiz, QuizGlobalProvider] = createGlobalState(initialState)

function useGlobalQuiz() {
  const [globalUser, _setGlobalUser] = _useGlobalQuiz()

  function setState(value) {
    _setGlobalUser({ ...globalUser, ...value });
  }

  return [globalUser, setState];
}

export { useGlobalQuiz, QuizGlobalProvider }
