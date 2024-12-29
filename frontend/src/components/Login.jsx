import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate(); 
  
  async function loginUser() {
    const {data} = await axios.post("/api/login", {email, password})
    if(data.error) {
      toast.error(data.error)
    }
    else {
      setEmail("")
      setPassword("")
      navigate('/')
    }
  }

  return (
    <div className='flex flex-col w-full h-screen  items-center'>
      <h1 className='text-4xl mt-36 ml-8 mb-3 tracking-wide'>Welcome back👋</h1>
      <div className='mr-14 mb-1'>Don't have account? <Link to='/signup' className='text-blue-700'>Register</Link></div>
      <form action="/login" method="post" onSubmit={(ev)=>{ev.preventDefault() ; loginUser()}} className='flex flex-col w-1/3 items-center'> 
        <input type="email" placeholder='email' value={email} onChange={(ev)=>{setEmail(ev.target.value)}} className='border-2 w-1/2 border-slate-600 rounded-md m-2 py-1 px-2 focus:outline-none' />
        <input type="password" placeholder='password' value={password} onChange={(ev)=>{setPassword(ev.target.value)}} className='border-2 w-1/2 border-slate-600 rounded-md m-2 py-1 px-2 focus:outline-none' />
        <button type='submit' className='text-2xl bg-zinc-200 text-black pb-1 rounded-md mt-4 w-1/2'>Login</button>
      </form>
    </div>
  )
}

export default Login