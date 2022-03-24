import { doc, getDoc, getDocs, setDoc, updateDoc, collection, query } from 'firebase/firestore';
import { useCallback } from "react";
import { firebaseDb } from "../../App";
import { QUIZ_COLLECTION_NAME, RANKING_DOC_NAME } from '../../constants';
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

// TODO: criar um hook pra função do usuário (observar e pegar as respostar dele)

export function useQuiz() {
  const [{ questions, questionIndex, quizNumber }] = useGlobalQuiz()

  const updateUserAnswers = useCallback(async (user, newAnswer) => {
    const quizRef = doc(firebaseDb, QUIZ_COLLECTION_NAME, quizNumber, "userAnswers", user.user);

    const querySnapshot = await getDoc(quizRef);
  
    const currentAnswers = querySnapshot.data()?.answers || []
  
    await setDoc(quizRef, {
      answers: getUpdatedAnswers(currentAnswers, newAnswer),
      name: user.name ?? user.user,
    })
  }, [])

  const changeCurrentQuestionIndex = useCallback(async (newQuestionIndex) => {
    try {
      const quizRef = doc(firebaseDb, QUIZ_COLLECTION_NAME, quizNumber);

      await updateDoc(quizRef, {
        currentQuestionIndex: newQuestionIndex
      });
    } catch (error) {
      console.log(error)
    }
  }, [])

  const showQuestionResult = useCallback(async () => {
    try {
      if (questions.length === 0) return

      const quizRef = doc(firebaseDb, QUIZ_COLLECTION_NAME, quizNumber);

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

  const changeStatus = useCallback(async (status) => {
    try {
      const quizRef = doc(firebaseDb, QUIZ_COLLECTION_NAME, quizNumber);

      await updateDoc(quizRef, {
        status
      });
    } catch (error) {
      console.log(error)
    }
  }, [])

  return {
    updateUserAnswers,
    changeCurrentQuestionIndex,
    showQuestionResult,
    changeStatus,
  }
}

export function useResult() {
  const [{ quizNumber, questions }] = useGlobalQuiz()

  function countUserPontuation(user, { answers, name }) {
    if (!answers) return 0

    const pontuation = answers.reduce((acc, answer) => {
      const { questionIndex, answerIndex } = answer

      const question = questions[questionIndex]

      if (!question) return acc

      const isRight = question.answerIndex === answerIndex

      return isRight ? acc + 1 : acc
    }, 0)

    return {
      user,
      name,
      pontuation,
    }
  }

  const getUserPontuations = useCallback(async () => {
    if (questions.length === 0) return []

    const q = query(collection(firebaseDb, QUIZ_COLLECTION_NAME, quizNumber, "userAnswers"));

    const querySnapshot = await getDocs(q);

    let usersPontuations = []

    querySnapshot.forEach((doc) => {
      usersPontuations = [
        ...usersPontuations,
        countUserPontuation(doc.id, doc.data()),
      ]
    })

    const sorttedPontuations = usersPontuations.sort((a, b) => b.pontuation - a.pontuation)

    return sorttedPontuations
  }, [questions])

  const getRanking = useCallback(async () => {
    const quizRef = doc(firebaseDb, QUIZ_COLLECTION_NAME, RANKING_DOC_NAME);
  
    const querySnapshot = await getDoc(quizRef);
  
    const pontuations = querySnapshot.data()?.pontuations || []

    return pontuations.sort((a, b) => b.pontuation - a.pontuation)
  }, [])

  function handleUpdateRanking(currentPontuation, newPontuations) {
    return currentPontuation.map((currentUser) => {
      const user = newPontuations.find(({ user }) => user === currentUser.user)

      if (!user) return currentUser

      return {
        ...currentUser,
        prevPontuation: currentUser.pontuation,
        pontuation: user.pontuation ? currentUser.pontuation + user.pontuation : currentUser.pontuation,
      }
    })
  }

  const updateRanking = useCallback(async () => {
    const quizRef = doc(firebaseDb, QUIZ_COLLECTION_NAME, RANKING_DOC_NAME);

    const currentPontuations = await getRanking()
    const newPontuations = await getUserPontuations()
  
    await setDoc(quizRef, {
      pontuations: handleUpdateRanking(currentPontuations, newPontuations)
    })
  }, [questions])

  return {
    getUserPontuations,
    getRanking,
    updateRanking,
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

  const quizRef = doc(firebaseDb, QUIZ_COLLECTION_NAME, "1");

  await updateDoc(quizRef, {
    questions
  });
}
