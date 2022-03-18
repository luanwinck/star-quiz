import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, getDocs, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { useCallback, useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyB6vQS34WztK7_Jvn6p0GnDznhhzJBQ9gw",
  authDomain: "star-quiz-92519.firebaseapp.com",
  projectId: "star-quiz-92519",
  storageBucket: "star-quiz-92519.appspot.com",
  messagingSenderId: "972511423407",
  appId: "1:972511423407:web:f598caecf4f41448de9d5a"
};

export const initializeFirebaseApp = () => {
  initializeApp(firebaseConfig);
}

initializeFirebaseApp()

// ajustar isso daqui
export const db = getFirestore();

const COLLECTION_NAME = 'quiz'
const QUIZ_NUMBER = "1" // TODO: tornar dinamico

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
  const [quizNumber, setQuizNumber] = useState(QUIZ_NUMBER)
  const [questions, setQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)

  // async function getQuiz() {
  //   try {
  //     const quizRef = doc(db, COLLECTION_NAME, quizNumber);

  //     const querySnapshot = await getDoc(quizRef);

  //     const queryData = querySnapshot.data()

  //     setQuestions(queryData.questions)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //   getQuiz()
  // }, [])

  useEffect(() => {
    const unsub = onSnapshot(doc(db, COLLECTION_NAME, quizNumber), (doc) => {
        const data = doc.data()

        setQuestionIndex(data.currentQuestionIndex)
        setQuestions(data.questions)
    });

    return unsub
  }, [])

  const updateUserAnswers = useCallback(async (user, newAnswer) => {
    const quizRef = doc(db, "quiz", QUIZ_NUMBER, "userAnswers", "bruna");
  
    const querySnapshot = await getDoc(quizRef);
  
    const currentAnswers = querySnapshot.data().answers || []
  
    await setDoc(quizRef, {
      answers: getUpdatedAnswers(currentAnswers, newAnswer)
    })
  }, [])

  const changeCurrentQuestionIndex = useCallback(async (newQuestionIndex) => {
    try {
      const quizRef = doc(db, COLLECTION_NAME, quizNumber);

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

      const quizRef = doc(db, COLLECTION_NAME, quizNumber);

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
    questions,
    questionIndex,
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

  const quizRef = doc(db, COLLECTION_NAME, "1");

  await updateDoc(quizRef, {
    questions
  });
}
