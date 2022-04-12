import { doc, getDoc, getDocs, setDoc, collection, query } from 'firebase/firestore';
import { useCallback } from "react";
import { firebaseDb } from "../App";
import { QUIZ_COLLECTION_NAME, RANKING_DOC_NAME } from '../constants';
import { useGlobalQuiz } from "../context";
import { getRankingWithChangedPositions, getWinners } from '../core';

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

    return getRankingWithChangedPositions(pontuations)
  }, [])

  function handleUpdateRanking(currentPontuation, newPontuations) {
    const winners = getWinners(newPontuations)

    return currentPontuation.map((currentUser) => {
      const user = newPontuations.find(({ user }) => user === currentUser.user)
      const isWinner = winners.some(({ user }) => user === currentUser.user)

      if (!user) return currentUser

      return {
        ...currentUser,
        prevPontuation: currentUser.pontuation,
        pontuation: user.pontuation ? currentUser.pontuation + user.pontuation : currentUser.pontuation,
        timesWon: isWinner ? currentUser.timesWon + 1 : currentUser.timesWon,
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
