import './App.css';
import { AppRoutes } from './routes/routes';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { useGlobalQuiz } from './context';
import { QUIZ_COLLECTION_NAME } from './constants';
import { useQuiz } from './hooks';

const firebaseConfig = {
  apiKey: "AIzaSyB6vQS34WztK7_Jvn6p0GnDznhhzJBQ9gw",
  authDomain: "star-quiz-92519.firebaseapp.com",
  projectId: "star-quiz-92519",
  storageBucket: "star-quiz-92519.appspot.com",
  messagingSenderId: "972511423407",
  appId: "1:972511423407:web:f598caecf4f41448de9d5a"
};

const initializeFirebaseApp = () => {
  initializeApp(firebaseConfig);
}

initializeFirebaseApp()

export const firebaseDb = getFirestore();

function App() {
  const [, setGlobalQuiz] = useGlobalQuiz()
  const { getLastQuiz } = useQuiz()

  useEffect(() => {
    async function handleStartQuiz() {
      const { quizNumber } = await getLastQuiz()

      const unsub = onSnapshot(doc(firebaseDb, QUIZ_COLLECTION_NAME, String(quizNumber)), (doc) => {
          const { questions, currentQuestionIndex, status } = doc.data()
  
          setGlobalQuiz({
            questions,
            questionIndex: currentQuestionIndex,
            status,
            quizNumber: String(quizNumber),
          })
      });
  
      return unsub
    }
    
    handleStartQuiz()
  }, [])

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
