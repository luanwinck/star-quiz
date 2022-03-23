const { firebaseDb } = require('./firebase')
const { updateDoc, doc, collection, setDoc } = require("firebase/firestore");

const QUIZ_COLLECTION_NAME = 'quiz'

const pontuations = [
  {
    name: 'Léo',
    user: 'leonardo.marcos',
    pontuation: 31,
  },
  {
    name: 'Luan',
    user: 'luan.winck',
    pontuation: 29,
  },
  {
    name: 'André',
    user: 'andre.dorneles',
    pontuation: 27,
  },
  {
    name: 'Bruno',
    user: 'bruno.cechinel',
    pontuation: 27,
  },
  {
    name: 'Caio',
    user: 'caio.amaral',
    pontuation: 24,
  },
  {
    name: 'Betina',
    user: 'betina.ozorio',
    pontuation: 21,
  },
  {
    name: 'Fumegalli',
    user: 'rafael.fumegalli',
    pontuation: 20,
  },
  {
    name: 'Pedro',
    user: 'pedro.fleck',
    pontuation: 20,
  },
  {
    name: 'Mario',
    user: 'mario.ferreira',
    pontuation: 17,
  },
  {
    name: 'Bruna',
    user: 'bruna.kunzler',
    pontuation: 16,
  },
  {
    name: 'João',
    user: 'joao.sobrinho',
    pontuation: 15,
  },
]

async function createRanking() {
  const quizRef = collection(firebaseDb, QUIZ_COLLECTION_NAME);

  const pontuationWithPrev = pontuations.map(pont => ({ ...pont, prevPontuation: 0 }))

  console.log(pontuations)

  await setDoc(doc(quizRef, "ranking_teste_01"), 
    {
      pontuations: pontuationWithPrev,
    }
  );

  console.log('Success')
}

async function reset() {
  const quizRef = doc(firebaseDb, QUIZ_COLLECTION_NAME, "ranking_teste_01");

  await updateDoc(quizRef, {
    questions: fakeQuestions
  });
}

createRanking()