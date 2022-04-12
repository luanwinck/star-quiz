const { firebaseDb } = require('./firebase')
const { updateDoc, doc, collection, setDoc } = require("firebase/firestore");

const QUIZ_COLLECTION_NAME = 'quiz'
const QUIZ_DOC_TEST = '1'

const questions = [ // TODO: criar função pra pegar o answerIndex
  {
    question: 'Em que mês faço aniversário?',
    answers: ["Agosto", "Setembro", "Outubro", "Novembro"],
    answerIndex: 1
  },
  {
    question: 'Onde eu morei a maior parte da minha vida?',
    answers: ["Taquara", "Parobé", "Igrejinha", "Sapiranga"],
    answerIndex: 0
  },
  {
    question: 'Qual foi a primeira faculdade que fiz?',
    answers: ["Eng. Eletrica", "Eng. Eletronica", "Eng. da computação", "Sistemas da Informação"],
    answerIndex: 1
  },
  {
    question: 'Quantas vezes bati de carro?',
    answers: ["1", "2", "3", "4"],
    answerIndex: 2
  },
  {
    question: 'Quantas tatuagens eu tenho?',
    answers: ["3", "4", "5", "6"],
    answerIndex: 2
  },
  {
    question: 'Qual era minha matéria preferida na escola?',
    answers: ["Matemática", "Física", "Química", "Biologia"],
    answerIndex: 0
  },
  {
    question: 'Qual alimento eu odeio?',
    answers: ["Moranga", "Batata Doce", "Abóbora", "Aipim"],
    answerIndex: 1
  },
  {
    question: 'Quantas empresas eu já trabalhei?',
    answers: ["1", "2", "3", "4"],
    answerIndex: 3
  },
  {
    question: 'Qual meu segundo esporte preferido de jogar?',
    answers: ["Basquete", "Volei", "Tênis", "Golf"],
    answerIndex: 1
  },
  {
    question: 'Qual uma das minhas series preferidas?',
    answers: ["Lupin", "Sex Education", "Modern Family", "How I Met Your Mother"],
    answerIndex: 1
  },
  {
    question: 'Qual a raça da minha cachorra?',
    answers: ["Lhasa Apso", "Yorkshire", "Shih-tzu", "Poodle"],
    answerIndex: 2
  },
  {
    question: 'Qual foi o primeiro cliente que trabalhei na CWI?',
    answers: ["Unimed", "GPA", "Arezzo", "Renner"],
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

const fakeQuestions = Array.from({ length: 5 }, getQuestion)

async function createQuestions() {
  const quizRef = collection(firebaseDb, QUIZ_COLLECTION_NAME);

  console.log(questions)

  await setDoc(doc(quizRef, QUIZ_DOC_TEST), 
    {
      currentQuestionIndex: 0,
      questions,
      status: 'NOT_STARTED',
    }
  );

  console.log('Success')
}

async function resetQuestions() {
  const quizRef = doc(firebaseDb, QUIZ_COLLECTION_NAME, QUIZ_DOC_TEST);

  console.log(fakeQuestions)

  await updateDoc(quizRef, {
    currentQuestionIndex: 0,
    questions,
    status: 'NOT_STARTED',
  });

  // Apagar userAnswers

  console.log('Success')
}

// resetQuestions() 
createQuestions()