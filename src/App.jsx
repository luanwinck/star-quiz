import logo from './logo.svg';
import './App.css';
import { AppRoutes } from './routes/routes';
import { BrowserRouter } from 'react-router-dom';

import { QuizGlobalProvider, UserGlobalProvider } from './context'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <UserGlobalProvider>
          <QuizGlobalProvider>
            <AppRoutes />
          </QuizGlobalProvider>
        </UserGlobalProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
