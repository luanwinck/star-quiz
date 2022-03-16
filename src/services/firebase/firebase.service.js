import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyB6vQS34WztK7_Jvn6p0GnDznhhzJBQ9gw",
  authDomain: "star-quiz-92519.firebaseapp.com",
  projectId: "star-quiz-92519",
  storageBucket: "star-quiz-92519.appspot.com",
  messagingSenderId: "972511423407",
  appId: "1:972511423407:web:f598caecf4f41448de9d5a"
};

export const initializeFirebaseApp = () => {
  console.log('initializeFirebaseApp')
  initializeApp(firebaseConfig);
}

initializeFirebaseApp()

// ajustar isso daqui
// criar uma service como classe ou hook?

export const db = getFirestore();

const QUIZ_NUMBER = 1 // ???

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

export async function updateUserAnswers(user, newAnswer) {
  const quizRef = doc(db, "quiz", String(QUIZ_NUMBER), "userAnswers", "bruna");

  const querySnapshot = await getDoc(quizRef);

  const currentAnswers = querySnapshot.data().answers || []

  console.log(currentAnswers)

  await setDoc(quizRef, {
    answers: getUpdatedAnswers(currentAnswers, newAnswer)
  })
}
