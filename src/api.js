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

// Auto-generated missing exports by VIA
export const createItem = async (d) => { const r = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/items`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}); if (!r.ok) throw new Error("createItem failed"); return r.json(); };
export const deleteItem = async (id) => { const r = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/items/${id}`, {method:"DELETE"}); if (!r.ok) throw new Error("deleteItem failed"); return r.json(); };
export const getItems = async (p) => { const q = p ? "?" + new URLSearchParams(p) : ""; const r = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/items${q}`); if (!r.ok) throw new Error("getItems failed"); return r.json(); };
export const getStats = async () => { const r = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/v1/stats`); if (!r.ok) throw new Error("getStats failed"); return r.json(); };
