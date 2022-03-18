import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate()

  async function handleUpdateAnswerList(answerIndex) {
      await updateUserAnswers("bruna", { // TODO: get user name
        answerIndex,
        questionIndex,
      })
      
      setSelectedOption(answerIndex)
  }

  function handleNextQuestion() {
    if (questions.length - 1 === questionIndex) {
      navigate('/result')
    } else {
      changeCurrentQuestionIndex(questionIndex + 1)
    }
  }

  function handlePrevQuestion() {
    changeCurrentQuestionIndex(questionIndex - 1)
  }

  function handleShowResult() {
    showQuestionResult()
  }

  const questionNumber = questionIndex + 1
  const { question, answers, hasBeenShownResult } = questions[questionIndex] || {}

  if (!question) {
    return <div className="question" />
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
            disabled={hasBeenShownResult}

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
          disabled={hasBeenShownResult}
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