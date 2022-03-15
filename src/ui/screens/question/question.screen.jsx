import { useEffect, useState } from 'react';

import { updateUserAnswers } from '../../../services'

import './question.css'

const OPTIONS = [
  "Volei",
  "Basquete",
  "Tenis",
  "Golf"
]

export function QuestionScreen() {
  const [selectedOption, setSelectedOption] = useState()
  const [questionIndex, setQuestionIndex] = useState(1)

  useEffect(() => {
    // Observar quando alterar o currentQuestionIndex no firebase
    // setQuestionIndex
  }, [])

  async function handleUpdateAnswerList(answerIndex) {
      await updateUserAnswers("bruna", {
        answerIndex,
        questionIndex,
      })
      
      setSelectedOption(answerIndex)
  }

  return (
    <div className="question">
      <header className="question_header borders">
        <p>1# Qual meu segundo esporte preferido, de jogar? (sim, copiei do Pedro)</p>
      </header>

      <div className="question_options-container">
        {OPTIONS.map((option, index) => (
          <button
            key={option}
            className={`question_option-button ${selectedOption === index ? 'question_option-button-selected' : ''}`}
            onClick={() => handleUpdateAnswerList(index)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}