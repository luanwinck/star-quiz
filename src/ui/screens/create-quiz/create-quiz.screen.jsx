import React, { useState } from 'react'
import { useQuiz } from '../../../hooks'

import './create-quiz.css'

function validateQuestions(questions) {
  const filteredQuestions = questions.filter((q) => q.question)

  if (filteredQuestions.length > 15 || filteredQuestions.length < 10) {
    alert('O quiz deve conter entre 10 e 15 questões')

    return false
  }

  const messages = filteredQuestions.reduce((acc, question, index) => {
    const answers  = question.answers.filter((answer) => answer.answer)

    if (answers.length > 4 || answers.length < 2) {
      return [...acc, `A questão ${index + 1} deve possuir entre 2 e 4 respostas`]
    }

    const correctAnswer = answers.filter((a) => a.isCorrect)

    if (correctAnswer.length !== 1) {
      return [...acc, `A questão ${index + 1} deve conter uma resposta certa`]
    }

    return acc
  }, [])

  if (messages.length) {
    alert(messages.join('\n'))

    return false
  }

  return  true
}

function mapQuestions(questions) {
  return questions.map((question) => {
    const answerIndex = question.answers.findIndex((q) => q.isCorrect)
    const answers = question.answers.map((a) => a.answer)

    return {
      answerIndex,
      answers,
      question: question.question,
    }
  })
}

export function CreateQuizScreen() {
  const { createNewQuiz } = useQuiz()

  function handleUploadQuestions(event) {
    const result = event.target.result
    const data = JSON.parse(result)

    if (validateQuestions(data)) {
      const mappedQuestions = mapQuestions(data)

      try {
        createNewQuiz(mappedQuestions)
        
        alert('Quiz criado com sucesso!')
      } catch (error) {
        alert('Ocorreu algum problema na criação no quiz')
      }
    }
  }

  function handleChange(e) {
    const [file] = e.target.files

    const reader = new FileReader()

    reader.onload = handleUploadQuestions

    reader.readAsText(file)
  }

  return (
    <div className="create-quiz">
      <h1>
        Criar novo quiz
      </h1>
      <span>O quiz deve conter entre 10 e 15 perguntas, cada pergunta pode conter de 2 a 4 respostas</span>
      <label>
        Importar JSON com perguntas
      </label>
      <input
        type="file"
        placeholder="Importar JSON"
        accept=".JSON"
        onChange={handleChange}
      />
      <a href="/questions-example.json" download>
        Baixar exemplo de JSON
      </a>
    </div>
  )
}
