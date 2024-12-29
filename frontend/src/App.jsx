import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios'
import Update from './components/Update'
import { useNavigate } from 'react-router-dom'

function App() {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date,setDate] = useState('')
  const [time,setTime] = useState('')
  const [toUpdate, setToUpdate] = useState(-1)
  const [total,setTotal] = useState(0)
  const dateInputRef = useRef(null)
  const timeInputRef = useRef(null)
  const [transactions,setTransactions] = useState([])
  const [userName, setUserName] = useState("")
  const navigate = useNavigate(); 

useEffect(()=>{ 
  getTransactions()
  let sum = 0;
  transactions.map((transaction,index)=>{
    sum+=transaction.amount
  })
  setTotal(sum)
},[transactions])

  function getTransactions() {
    axios.get('/api/transactions', {withCredentials: true}) // fetches prev transactions by sending request to backend so they get it from db
    .then((res)=>{  //vite.config.js acts as middleman and adds proxy to the request for backend so that browser thinks frontend is sending request to same origin.
      if(res.data.error && res.data.error!=="") {
        navigate('/login')
      }
      else {  
        setUserName(res.data.name)
        const transactions = res.data.transactions.reverse()
        setTransactions(transactions)
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }
  
  function addNewTransaction() {  //Axios is a JavaScript library that helps make HTTP requests (like fetching or sending data) from the frontend to the backend.
    //const url = import.meta.env.VITE_API_URL
    axios.post('/api/transactions', {description,amount,date,time}, {withCredentials: true}) //sends data to backend so they can modify db
    .then((res)=>{  //If withCredentials is set to true, Axios will include cookies or other credentials in the request
      if(res.data.error && res.data.error!=="") {
         navigate('/login')
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }

  function deleteTransaction(id) {
    axios.delete('/api/delete',{data: {id}}) //Without the data field, Axios doesn't send the id in the body FOR A DELETE REQUEST.
    .then((res)=>{
      if(res.data.error && res.data.error!=="") {
         navigate('/login')
      }
    })
    .catch((err) => {
      console.log(err)
    })
  } 

  function logOut() {
    axios.get('/api/logout', {withCredentials: true})
  }

  return (
    <div className=''>
      <div className='w-full flex relative'>
      <h1 className='text-center flex-1 font-semibold text-4xl tracking-wide mt-5 ml-10'>Hello {userName}💸</h1>
      <button onClick={(ev)=>{ev.preventDefault() ; logOut()}} className='bg-red-800 hover:bg-red-900 absolute right-0 top-2.5 text-slate-300  tracking-wide px-1.5 py-1 rounded-md'>Log Out</button>
      </div>
      <h1 className='text-center font-semibold text-4xl tracking-wide m-8'>{total>=0 ? "$"+total+".00" : "-$"+Math.abs(total)+".00"}</h1>
      <form className='flex flex-col w-full items-center gap-2' onSubmit={(event)=>{
          event.preventDefault()
          addNewTransaction()
          setAmount("");
          setDescription("");
          setDate("");
          setTime(""); 
        }
        }>
        <div className="inp1 w-1/3 flex gap-3">
        <input 
        type="text" 
        value={amount}
        onChange={
          ev=>{setAmount(ev.target.value)
          }
        }
        placeholder='amount' 
        className='p-0.5 flex-1 w-1/2 border-2 px-2 border-slate-600 rounded-md focus:outline-none' 
        />
        <input 
        type="text"
        value={description}
        onChange={
          ev=>{setDescription(ev.target.value)
          }
        }
        placeholder='description' 
        className='p-0.5 flex-1 w-1/2 border-2 px-2 border-slate-600 rounded-md focus:outline-none' 
        />
        </div>
        <div className="inp2 w-1/3 flex gap-3 ">
        <input 
        type="text" 
        value={date}
        placeholder='date' 
        onChange={(ev)=>{
          setDate(ev.target.value)
        }}
        ref={dateInputRef}
        onFocus={()=>{
          dateInputRef.current.type="date"
            dateInputRef.current.showPicker()
        }}
        onBlur={()=>{dateInputRef.current.type="text"}}
        className='p-0.5 flex-1 w-1/2 px-2 border-2 border-slate-600 rounded-md appearance-none focus:outline-none' 
        />   
        <input
        type="text"
        value={time}
        placeholder='time' 
        className='p-0.5 flex-1 w-1/2 px-2 border-2 border-slate-600 rounded-md appearance-none focus:outline-none'
        onChange={(ev)=>{
          setTime(ev.target.value)
        }}
        ref={timeInputRef}
        onFocus={()=>{
          timeInputRef.current.type="time"
            timeInputRef.current.showPicker()
        }}
        onBlur={()=>{timeInputRef.current.type="text"}}
        />
        </div>
        <div className='w-1/3 flex gap-3'>
        <button 
        type='submit'
        onClick={()=>{setAmount((a)=>(
          (-1)*a))}}
        className='bg-red-800 hover:bg-red-900 text-slate-300 font-medium tracking-wide w-1/2 rounded-md p-0.5 '>
          You Paid
          </button>     
          <button         
          type='submit'
          className='bg-green-800 hover:bg-green-900 text-slate-300 font-medium tracking-wide w-1/2 rounded-md p-0.5 '>
          You Received
          </button>  
          </div>
      </form>
      <div className='text-xl transactions gap-4 mt-4 w-full flex flex-col items-center'>
      {
        transactions.map((transaction,index)=>(
          <div key={index} className={`transaction text-left flex w-1/3 justify-between ${index!=0 ? `border-t-2 border-slate-800 pt-3` : ``}`}>
            <div className="name">
              <div>{transaction.description}</div>
              <div className='mt-1.5 btns flex gap-x-2.5 text-lg'>
              <button onClick={()=>{setToUpdate(transaction._id)}} className='text-blue-900'>edit</button>
              <button onClick={()=>{deleteTransaction(transaction._id)}} className='text-red-800'>remove</button>
              </div>
            </div>
            <div className="details  text-right">
              <div className={transaction.amount>=0 ? `text-green-700` : `text-red-800` }>{transaction.amount>=0 ? `+$`+transaction.amount:`-$`+  Math.abs(transaction.amount)}</div>
              <div className='belowamnt mt-1 flex gap-4'><div>{transaction.time}</div> <div>{transaction.date.slice(0,10)}</div></div>
            </div>
          </div>
        ))
      }
      </div>
      {toUpdate!==-1 && <Update id={toUpdate} onClose={()=>setToUpdate(-1)}/>}
    </div>
  )
}

export default App
