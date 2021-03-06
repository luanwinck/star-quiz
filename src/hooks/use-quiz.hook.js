import { doc, getDoc, setDoc, updateDoc, collection, query, onSnapshot, orderBy, limit, getDocs } from 'firebase/firestore';
import { useCallback } from "react";
import { firebaseDb } from "../App";
import { QUIZ_COLLECTION_NAME } from '../constants';
import { useGlobalQuiz } from "../context";
import { getUpdatedAnswers } from '../core';

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
  }, [quizNumber])

  const changeCurrentQuestionIndex = useCallback(async (newQuestionIndex) => {
    try {
      const quizRef = doc(firebaseDb, QUIZ_COLLECTION_NAME, quizNumber);

      await updateDoc(quizRef, {
        currentQuestionIndex: newQuestionIndex
      });
    } catch (error) {
      console.log(error)
    }
  }, [quizNumber])

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
  }, [questions, quizNumber])

  const changeStatus = useCallback(async (status) => {
    try {
      const quizRef = doc(firebaseDb, QUIZ_COLLECTION_NAME, quizNumber);

      await updateDoc(quizRef, {
        status
      });
    } catch (error) {
      console.log(error)
    }
  }, [quizNumber])

  const onSnapshotUserAnswers = useCallback((setAnswerCount) => {
    const unsubscribe = onSnapshot(query(collection(firebaseDb, QUIZ_COLLECTION_NAME, quizNumber, "userAnswers")), (userAnswers) => {
      const allDocs = userAnswers.docs

      const count = allDocs.reduce((acc, cur) => {
        const data = cur.data()

        const hasBeenAnswered = data?.answers?.some((answer) => answer.questionIndex === questionIndex)

        if (hasBeenAnswered) return acc + 1

        return acc
      }, 0)

      if (count > 0) {
        setAnswerCount(count)
      }
    });

    return unsubscribe
  }, [quizNumber, questionIndex])

  const getLastQuiz = useCallback(async () => {
    const q = query(collection(firebaseDb, QUIZ_COLLECTION_NAME), orderBy("quizNumber", "desc"), limit(1));

    const querySnapshot = await getDocs(q);

    const [lastDoc] = querySnapshot.docs

    return lastDoc?.data()
  }, [])

  const createNewQuiz = useCallback(async (questions, host, code) => {
    const quizRef = collection(firebaseDb, QUIZ_COLLECTION_NAME);

    const lastQuiz = await getLastQuiz();

    const newQuizNumber = lastQuiz.quizNumber + 1;

    await setDoc(doc(quizRef, String(newQuizNumber)), 
      {
        currentQuestionIndex: 0,
        questions,
        status: 'NOT_STARTED',
        quizNumber: newQuizNumber,
        host,
        code,
      }
    );
  }, [])

  return {
    updateUserAnswers,
    changeCurrentQuestionIndex,
    showQuestionResult,
    changeStatus,
    onSnapshotUserAnswers,
    getLastQuiz,
    createNewQuiz,
  }
}
