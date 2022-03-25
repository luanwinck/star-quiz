const { firebaseDb } = require('./firebase')
const { updateDoc, doc, collection, setDoc } = require("firebase/firestore");

const QUIZ_COLLECTION_NAME = 'quiz'
const RANKING_DOC_TEST = 'ranking'

const pontuations = [
  {
    name: 'Léo',
    user: 'leonardo.marcos',
    pontuation: 31,
    timesWon: 2,
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
    timesWon: 1,
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

  const mappedPontuations = pontuations.map(pont => ({
    ...pont,
    prevPontuation: pont.pontuation,
    timesWon: pont.timesWon || 0,
  }))

  console.log(mappedPontuations)

  await setDoc(doc(quizRef, RANKING_DOC_TEST), 
    {
      pontuations: mappedPontuations,
    }
  );

  console.log('Success')
}

createRanking()