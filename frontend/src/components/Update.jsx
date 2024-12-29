import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

function Update({id,onClose}) {
  const [amount, setAmount] = useState('');
  const [update, setUpdate] = useState(false);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

    useEffect(() => {
    getTransaction()
  }, [])

  function getTransaction() {
    axios.get(`/api/transaction/${id}`)
    .then((res)=>{
      setDescription(res.data.description)
      setAmount(Math.abs(res.data.amount))
      setDate(res.data.date.slice(0,10))
      setTime(res.data.time)
    })
  }

  function updateTransaction(amt) {
    axios.post(`/api/transaction/${id}`, {description,amount: amt,date,time}) //amt because the issue was caused by React's setState being asynchronous, so the updated amount was not immediately available when calling updateTransaction. The solution is to calculate and pass the updated value directly within the onClick handler
  .catch(err => {
      console.error('Error updating transaction:', err);
  });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-30">
      <div className="bg-slate-900 p-6 w-96 rounded-md shadow-lg">
        <h1 className="text-center bg-slate-900 mb-6 text-yellow-400 text-3xl font-semibold">Update</h1>
        <form
          className="bg-slate-900 flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            onClose()
          }}
        >
          <div className="flex bg-slate-900 flex-col gap-3">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="p-2 border border-gray-600 rounded-md bg-gray-900 text-gray-200 focus:outline-none"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="p-2 border border-gray-600 rounded-md bg-gray-900 text-gray-200 focus:outline-none"
            />
          </div>

          <div className="flex bg-slate-900 flex-col gap-3">
            <input
              type="text"
              value={date}
              placeholder="Date"
              onChange={(e) => setDate(e.target.value)}
              ref={dateInputRef}
              onFocus={() => {
                dateInputRef.current.type = 'date';
                dateInputRef.current.showPicker();
              }}
              onBlur={() => {
                dateInputRef.current.type = 'text';
              }}
              className="p-2 border border-gray-600 rounded-md bg-gray-900 text-gray-200 focus:outline-none"
            />
            <input
              type="text"
              value={time}
              placeholder="Time"
              onChange={(e) => setTime(e.target.value)}
              ref={timeInputRef}
              onFocus={() => {
                timeInputRef.current.type = 'time';
                timeInputRef.current.showPicker();
              }}
              onBlur={() => {
                timeInputRef.current.type = 'text';
              }}
              className="p-2 border border-gray-600 rounded-md bg-gray-900 text-gray-200 focus:outline-none"
            />
          </div>

          <div className="flex bg-slate-900 gap-4 mt-4">
            <button
              type="submit"
              onClick={()=>{
                const updatedAmount = -1*amount
                setAmount(updatedAmount)
              updateTransaction(updatedAmount)}}
              className="w-full py-1.5 bg-red-800 hover:bg-red-900 text-slate-300 font-semibold rounded-md focus:outline-none"
            >
              You Paid
            </button>
            <button
              type="submit"
              onClick={()=>updateTransaction(amount)}
              className="w-full py-1.5 bg-green-800 hover:bg-green-900 text-slate-300 font-semibold rounded-md focus:outline-none"
            >
              You Received
            </button>
          </div>
              <button type='submit' className='w-full py-1.5 bg-slate-700 hover:bg-slate-800 text-slate-300 font-semibold rounded-md focus:outline-none'>
                Cancel
              </button>
        </form>
      </div>
    </div>
  );
}

export default Update;