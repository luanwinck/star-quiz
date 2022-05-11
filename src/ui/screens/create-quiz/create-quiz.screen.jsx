import React, { useState } from 'react'
import { useQuiz } from '../../../hooks'
import { Button } from '../../components'

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
  const [questions, setQuestions] = useState([])
  const [host, setHost] = useState('')
  const [code, setCode] = useState('')

  function handleUploadQuestions(event) {
    const result = event.target.result
    const data = JSON.parse(result)

    if (validateQuestions(data)) {
      const mappedQuestions = mapQuestions(data)

      setQuestions(mappedQuestions)
    }
  }

  function handleFileChange(e) {
    const [file] = e.target.files

    const reader = new FileReader()

    reader.onload = (e) => handleUploadQuestions(e)

    reader.readAsText(file)
  }

  function handleHostChange(e) {
    setHost(e.target.value)
  }

  function handleCodeChange(e) {
    setCode(e.target.value)
  }

  function handleCreateQuiz() {
    if (!questions.length || !host || !code) {
      alert('Estão faltando algumas informações!')
      return;
    }

    try {
      createNewQuiz(questions, host, code)

      setQuestions([])
      setHost('')
      setCode('')
      
      alert('Quiz criado com sucesso!')
    } catch (error) {
      alert('Ocorreu algum problema na criação no quiz')
    }
  }

  return (
    <div className="create-quiz">
      <h1>
        Criar novo quiz
      </h1>
      <span>O quiz deve conter entre 10 e 15 perguntas, cada pergunta pode conter de 2 a 4 respostas</span>
      
      <input
        placeholder="Host"
        value={host}
        onChange={handleHostChange}
        className="create-quiz_input"
      />
      <input
        placeholder="Código de acesso"
        value={code}
        onChange={handleCodeChange}
        className="create-quiz_input"
      />

      <label>
        Importar JSON com perguntas
      </label>
      <input
        type="file"
        placeholder="Importar JSON"
        accept=".JSON"
        onChange={handleFileChange}
      />
      <a href="/questions-example.json" download>
        Baixar exemplo de JSON
      </a>

      <Button onClick={handleCreateQuiz}>
        Criar quiz
      </Button>
    </div>
  )
}
