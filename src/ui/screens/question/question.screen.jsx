import { useState } from 'react';

import { useQuiz } from '../../../services'
import { Button } from '../../components';

import './question.css'

export function QuestionScreen() {
  const [selectedOption, setSelectedOption] = useState()
  const {
    questions,
    questionIndex,
    updateUserAnswers,
    changeCurrentQuestionIndex,
    showQuestionResult,
  } = useQuiz()

  async function handleUpdateAnswerList(answerIndex) {
      await updateUserAnswers("bruna", { // TODO: get user name
        answerIndex,
        questionIndex,
      })
      
      setSelectedOption(answerIndex)
  }

  const questionNumber = questionIndex + 1
  const { question, answers, hasBeenShownResult } = questions[questionIndex] || {}

  function handleNextQuestion() {
    // TODO: validar se chegou na ultima pergunta
    changeCurrentQuestionIndex(questionIndex + 1)
  }

  function handlePrevQuestion() {
    changeCurrentQuestionIndex(questionIndex - 1)
  }

  function handleShowResult() {
    showQuestionResult()
  }

  return (
    <div className="question">
      <header className="question_header borders">
      <p>{questionNumber}# {question}</p>
      </header>

      <div className="question_options-container">
        {answers?.map((option, index) => (
          <button
            key={option}
            className={`question_option-button ${selectedOption === index ? 'question_option-button-selected' : ''}`}
            onClick={() => handleUpdateAnswerList(index)}
          >
            {option}
          </button>
        ))}
      </div>

      {hasBeenShownResult && <span>Vai mostrar os botões com certo ou errado!!!</span>}

      <div className="question_action-buttons-container">
        <Button
          className="question_action-button"
          onClick={handlePrevQuestion}
          disabled={questionIndex === 0}
        >
          Anterior
        </Button>
        <Button
          className="question_action-button"
          onClick={handleShowResult}
        >
          Mostrar resultado
        </Button>
        <Button
          className="question_action-button"
          onClick={handleNextQuestion}
          disabled={!hasBeenShownResult}
        >
          Próxima
        </Button>
      </div>
      
    </div>
  )
}