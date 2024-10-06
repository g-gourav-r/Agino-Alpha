import "../public/css/main.css"
import AppRouter from './Routes/Routes'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <AppRouter/>
    </>
  )
}

export default App
