import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter, createRoutesFromElements,Route} from 'react-router-dom' 
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx'
import SignUp from './components/SignUp.jsx'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element={<App />} />
    <Route path='/login' element={<Login />} />
    <Route path='/signup' element={<SignUp />} />
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
    <div>
  <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    
  />
</div>
  </StrictMode>,
)
