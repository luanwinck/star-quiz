import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalQuiz, useGlobalUser } from '../../../context';
import { QuizStatusEnum } from '../../../enum';
import { useQuiz, useResult } from '../../../hooks'
import users from '../../../users';
import { Button } from '../../components';

import './question.css'

const USERS_PLAYING_QUANTITY = users.length - 1

function getOptionButtonClassName(index, selectedOption, answerIndex, hasBeenShownResult) {
  if (!hasBeenShownResult) return ''

  if (index === selectedOption) {
    if (selectedOption === answerIndex) {
      return 'question_option-button-right'
    }

    return 'question_option-button-wrong'
  } else if (index === answerIndex) {
    return 'question_option-button-right'
  }
}

export function QuestionScreen() {
  const [selectedOption, setSelectedOption] = useState(null)
  const [{
    questions,
    questionIndex,
  }] = useGlobalQuiz()
  const [user] = useGlobalUser()

  const {
    updateUserAnswers,
    changeCurrentQuestionIndex,
    showQuestionResult,
    changeStatus,
    onSnapshotUserAnswers,
  } = useQuiz()
  const { updateRanking } = useResult()

  const [answersCount, setAnswerCount] = useState(0)

  const navigate = useNavigate()

  const isLastQuestion = questions.length - 1 === questionIndex

  useEffect(() => {
    setSelectedOption(null)
  }, [questionIndex])

  useEffect(() => {
    return onSnapshotUserAnswers(setAnswerCount)
  }, [onSnapshotUserAnswers])

  useEffect(() => {
    setAnswerCount(0)
  }, [questionIndex])

  async function handleUpdateAnswerList(answerIndex) {
      setSelectedOption(answerIndex)

      await updateUserAnswers(user, {
        answerIndex,
        questionIndex,
      })
  }

  function handleNextQuestion() {
    if (isLastQuestion) {
      navigate('/results')
      changeStatus(QuizStatusEnum.FINISHED)
      updateRanking()
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
  const { question, answers, answerIndex, hasBeenShownResult } = questions[questionIndex] || {}

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
            key={`${option}${index}`}
            className={`
              question_option-button 
              ${selectedOption === index ? 'question_option-button-selected' : ''}
              ${getOptionButtonClassName(index, selectedOption, answerIndex, hasBeenShownResult)}
            `} // TODO: pegar a opção selecionado caso o host volte na pergunta anterior
            onClick={() => handleUpdateAnswerList(index)}
            disabled={hasBeenShownResult || user.isHost}

          >
            {option}
          </button>
        ))}
      </div>

      {user.isHost && (
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
            {isLastQuestion ? "Resultado" : "Próxima"}
          </Button>
        </div>
      )}

      <span className="question_answers-count-container">
        {answersCount} / {USERS_PLAYING_QUANTITY}
      </span>
    </div>
  )
}