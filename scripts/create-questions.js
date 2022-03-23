const { firebaseDb } = require('./firebase')
const { updateDoc, doc, collection, setDoc } = require("firebase/firestore");

const QUIZ_COLLECTION_NAME = 'quiz'

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

function getQuestion(v, i) {
  const answers = ["Errado", "Errado", "Errado", "Errado"]
  const randomAnswerIndex = Math.floor(Math.random() * 4)

  answers[randomAnswerIndex] = "Certo"

  return {
    question: `Pergunta de teste número ${i}`,
    answers: answers,
    answerIndex: randomAnswerIndex,
    hasBeenShownResult: false,
  }
}

const fakeQuestions = Array.from({ length: 10 }, getQuestion)

async function createQuestions() {
  const quizRef = collection(firebaseDb, QUIZ_COLLECTION_NAME);

  console.log(fakeQuestions)

  await setDoc(doc(quizRef, "teste_01"), 
    {
      currentQuestionIndex: 0,
      questions: fakeQuestions,
      status: 'NOT_STARTED',
    }
  );

  console.log('Success')
}

async function update() {
  const quizRef = doc(firebaseDb, QUIZ_COLLECTION_NAME, "teste_01");

  await updateDoc(quizRef, {
    questions: fakeQuestions
  });
}

createQuestions()