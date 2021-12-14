import Routes from './routes/routes';
import { ToastContainer } from 'react-toastify'
import GeneralProvider from './contexts/general';

import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div className="App">
      <GeneralProvider>
          <ToastContainer autoClose={3000} />
          <Routes />
      </GeneralProvider>
    </div>
  );
}

export default App;
