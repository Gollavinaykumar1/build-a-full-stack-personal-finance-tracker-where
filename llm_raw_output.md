# LLM Output

=== FILE: src/App.jsx ===
import React, { useState, useEffect } from 'react'
import { BrowserRouter as HashRouter, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import { FiPlus, FiTrash2, FiEdit } from 'react-icons/fi'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { clsx } from 'clsx'
import 'react-toastify/dist/ReactToastify.css'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

function App() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [important, setImportant] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTransaction, setEditedTransaction] = useState({})

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    axios.get(`${BASE_URL}/transactions`)
      .then(response => {
        setTransactions(response.data)
      })
      .catch(error => {
        toast.error('Failed to fetch transactions')
      })

    axios.get(`${BASE_URL}/categories`)
      .then(response => {
        setCategories(response.data)
      })
      .catch(error => {
        toast.error('Failed to fetch categories')
      })
  }, [])

  const addTransaction = (data) => {
    axios.post(`${BASE_URL}/transactions`, data)
      .then(response => {
        setTransactions([...transactions, response.data])
        toast.success('Transaction added successfully')
        reset()
      })
      .catch(error => {
        toast.error('Failed to add transaction')
      })
  }

  const deleteTransaction = (id) => {
    axios.delete(`${BASE_URL}/transactions/${id}`)
      .then(response => {
        setTransactions(transactions.filter(transaction => transaction.id !== id))
        toast.success('Transaction deleted successfully')
      })
      .catch(error => {
        toast.error('Failed to delete transaction')
      })
  }

  const editTransaction = (id) => {
    const transaction = transactions.find(t => t.id === id)
    setEditedTransaction(transaction)
    setIsEditing(true)
  }

  const updateTransaction = (data) => {
    axios.put(`${BASE_URL}/transactions/${editedTransaction.id}`, data)
      .then(response => {
        setTransactions(transactions.map(transaction => transaction.id === editedTransaction.id ? response.data : transaction))
        toast.success('Transaction updated successfully')
        setIsEditing(false)
        setEditedTransaction({})
      })
      .catch(error => {
        toast.error('Failed to update transaction')
      })
  }

  const markAsImportant = (id) => {
    axios.patch(`${BASE_URL}/transactions/${id}/important`)
      .then(response => {
        setTransactions(transactions.map(transaction => transaction.id === id ? { ...transaction, important: !transaction.important } : transaction))
        toast.success('Transaction marked as important')
      })
      .catch(error => {
        toast.error('Failed to mark transaction as important')
      })
  }

  return (
    <HashRouter>
      <ToastContainer />
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Personal Finance Tracker</h1>
        <form onSubmit={handleSubmit(isEditing ? updateTransaction : addTransaction)}>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="category">
                Category
              </label>
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="category"
                {...register('category')}
                defaultValue={isEditing ? editedTransaction.category : ''}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="amount">
                Amount
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="amount"
                type="number"
                {...register('amount')}
                defaultValue={isEditing ? editedTransaction.amount : ''}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="date">
                Date
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="date"
                type="date"
                {...register('date')}
                defaultValue={isEditing ? format(new Date(editedTransaction.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="important">
                Important
              </label>
              <input
                className="mr-2 leading-tight"
                id="important"
                type="checkbox"
                {...register('important')}
                defaultChecked={isEditing ? editedTransaction.important : false}
              />
            </div>
          </div>
          <button
            className={clsx('bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded', isEditing ? 'bg-green-500 hover:bg-green-700' : '')}
            type="submit"
          >
            {isEditing ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </form>
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Important</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td className="border px-4 py-2">{transaction.category.name}</td>
                <td className="border px-4 py-2">{transaction.amount}</td>
                <td className="border px-4 py-2">{format(new Date(transaction.date), 'yyyy-MM-dd')}</td>
                <td className="border px-4 py-2">{transaction.important ? <FiPlus className="text-green-500" /> : <FiPlus className="text-gray-500" />}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => editTransaction(transaction.id)}
                  >
                    <FiEdit className="mr-2" />
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    <FiTrash2 className="mr-2" />
                    Delete
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => markAsImportant(transaction.id)}
                  >
                    Mark as Important
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HashRouter>
  )
}

export default App
=== END ===

=== FILE: src/main.jsx ===
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
=== END ===

=== FILE: src/index.css ===
@tailwind base;
@tailwind components;
@tailwind utilities;
=== END ===

=== FILE: src/api.js ===
import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export const getTransactions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/transactions`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const addTransaction = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/transactions`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteTransaction = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/transactions/${id}`)
  } catch (error) {
    throw error
  }
}

export const editTransaction = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/transactions/${id}`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const markAsImportant = async (id) => {
  try {
    await axios.patch(`${BASE_URL}/transactions/${id}/important`)
  } catch (error) {
    throw error
  }
}
=== END ===