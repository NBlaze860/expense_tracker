import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'

function SignUp() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate(); 
  
  async function addNewUser() {
    const {data} = await axios.post("/api/signup", {name, email, password})
    if(data.error) {
      toast.error(data.error)
    }
    else {
      setName("")
      setEmail("")
      setPassword("") 
      navigate('/')
    }
  }
  
   
  return (
    <div className='flex flex-col w-full h-screen  items-center'>
      <h1 className='text-4xl mt-36 mb-3 tracking-wide'>Create Account📝</h1>
      <div className='mr-16 mb-1'>Already registered? <Link to='/login' className='text-blue-700'>Login</Link></div>
      <form action="/signup" method="post" onSubmit={(ev)=>{ev.preventDefault() ; addNewUser()} } className='flex flex-col w-1/3 items-center'>
        <input type="text" placeholder='name' value={name} onChange={(ev)=>setName(ev.target.value)} className='border-2 w-1/2 border-slate-600 rounded-md m-2 py-1 px-2 focus:outline-none' />
        <input type="email" placeholder='email' value={email} onChange={(ev)=>setEmail(ev.target.value)} className='border-2 w-1/2 border-slate-600 rounded-md m-2 py-1 px-2 focus:outline-none' />
        <input type="password" placeholder='password' value={password} onChange={(ev)=>setPassword(ev.target.value)} className='border-2 w-1/2 border-slate-600 rounded-md m-2 py-1 px-2 focus:outline-none' />
        <button type='submit' className='text-2xl bg-zinc-200 text-black pb-1 rounded-md mt-4 w-1/2'>Register</button>
      </form>
    </div>
  )
}

export default SignUp