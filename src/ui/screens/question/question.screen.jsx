import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { updateUserAnswers } from '../../../services'
import { db } from '../../../services/firebase/firebase.service'

import './question.css'

const OPTIONS = [
  "Volei",
  "Basquete",
  "Tenis",
  "Golf"
]

export function QuestionScreen() {
  const [selectedOption, setSelectedOption] = useState()
  const [questionIndex, setQuestionIndex] = useState(0)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "quiz", String(1)), (doc) => {
        const data = doc.data()

        setQuestionIndex(data.currentQuestionIndex)
    });

    return unsub
  }, [])

  async function handleUpdateAnswerList(answerIndex) {
      await updateUserAnswers("bruna", {
        answerIndex,
        questionIndex,
      })
      
      setSelectedOption(answerIndex)
  }

  const questionNumber = questionIndex + 1

  return (
    <div className="question">
      <header className="question_header borders">
      <p>{questionNumber}# Qual meu segundo esporte preferido, de jogar?</p>
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