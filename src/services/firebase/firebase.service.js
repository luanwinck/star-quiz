import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useCallback } from "react";
import { firebaseDb } from "../../App";
import { COLLECTION_NAME } from '../../constants';
import { useGlobalQuiz } from "../../context";

function getUpdatedAnswers(currentAnswers, newAnswer) {
  const hasAlreadyAnswered = currentAnswers.some((answer) => answer.questionIndex === newAnswer.questionIndex)

  if (!hasAlreadyAnswered) return [...currentAnswers, newAnswer]

  return currentAnswers.map((answer) => {
    if (answer.questionIndex === newAnswer.questionIndex) {
      return newAnswer
    }

    return answer
  })
}

export function useQuiz() {
  const [{ questions, questionIndex, quizNumber }] = useGlobalQuiz()

  const updateUserAnswers = useCallback(async (user, newAnswer) => {
    const quizRef = doc(firebaseDb, COLLECTION_NAME, quizNumber, "userAnswers", "bruna");
  
    const querySnapshot = await getDoc(quizRef);
  
    const currentAnswers = querySnapshot.data().answers || []
  
    await setDoc(quizRef, {
      answers: getUpdatedAnswers(currentAnswers, newAnswer)
    })
  }, [])

  const changeCurrentQuestionIndex = useCallback(async (newQuestionIndex) => {
    try {
      const quizRef = doc(firebaseDb, COLLECTION_NAME, quizNumber);

      await updateDoc(quizRef, {
        currentQuestionIndex: newQuestionIndex
      });
    } catch (error) {
      console.log(error)
    }
  }, [])

  const showQuestionResult = useCallback(async () => {
    try {
      console.log(questions)

      if (questions.length === 0) return

      const quizRef = doc(firebaseDb, COLLECTION_NAME, quizNumber);

      await updateDoc(quizRef, {
        questions: questions.map((question, index) => {
          if (index === questionIndex) {
            return {
              ...question,
              hasBeenShownResult: true,
            }
          }

          return question
        })
      });
    } catch (error) {
      console.log(error)
    }
  }, [questions])

  return {
    updateUserAnswers,
    changeCurrentQuestionIndex,
    showQuestionResult,
  }
}

async function createQuestions() {
  const questions = [
    {
      question: 'Qual foi a primeira faculdade que fiz?',
      answers: ["Eng. Eletrica", "Eng. Eletronica", "Eng. da computação", "Sistemas da Informação"],
      answerIndex: 1
    },
    {
      question: '- Quantas vezes bati de carro?',
      answers: ["1", "2", "3", "4"],
      answerIndex: 2
    },
  ]

  const quizRef = doc(firebaseDb, COLLECTION_NAME, "1");

  await updateDoc(quizRef, {
    questions
  });
}
