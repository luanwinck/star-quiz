import { useState } from 'react';

import './question.css'

const OPTIONS = [
  "Volei",
  "Basquete",
  "Tenis",
  "Golf"
]

export function QuestionScreen() {
  const [selectedOption, setSelectedOption] = useState()

  return (
    <div className="question">
      <header className="question_header borders">
        <p>1# Qual meu segundo esporte preferido, de jogar? (sim, copiei do Pedro)</p>
      </header>

      <div className="question_options-container">
        {OPTIONS.map((option) => (
          <button
            className={`question_option-button ${selectedOption === option ? 'question_option-button-selected' : ''}`}
            onClick={() => setSelectedOption(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}