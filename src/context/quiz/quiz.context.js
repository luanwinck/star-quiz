import createGlobalState from "react-create-global-state";

const initialState = {
  status: "STARTED",
}

const [_useGlobalQuiz, QuizGlobalProvider] = createGlobalState(initialState)

function useGlobalQuiz() {
  const [globalUser, _setGlobalUser] = _useGlobalQuiz()

  function setState(value) {
    _setGlobalUser(value);
  }

  return [globalUser, setState];
}

export { useGlobalQuiz, QuizGlobalProvider }
