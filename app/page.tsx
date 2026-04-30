'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'

interface Expense {
  id: number
  description: string
  amount: number
  date: string
  paid: boolean
}

export default function Page() {
  const [budget, setBudget] = useState(0)
  const [expenses, setExpenses] = useState<Expense[]>([])

  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: '',
    paid: false,
  })

  const addExpense = () => {
    if (!form.description || !form.amount) return

    const newExpense: Expense = {
      id: Date.now(),
      description: form.description,
      amount: parseFloat(form.amount),
      date: form.date,
      paid: form.paid,
    }

    setExpenses(prev => [...prev, newExpense])
    setForm({ description: '', amount: '', date: '', paid: false })
  }

  const totalExpenses = expenses
    .filter(e => !e.paid)
    .reduce((acc, e) => acc + e.amount, 0)

  const paidExpenses = expenses
    .filter(e => e.paid)
    .reduce((acc, e) => acc + e.amount, 0)

  const remaining = budget - totalExpenses

  const exportPDF = () => {
    const doc = new jsPDF()
    let y = 20

    doc.setFontSize(18)
    doc.text('Expense Report', 14, y)
    y += 10

    doc.setFontSize(12)
    doc.text(`Total Budget: ₱${budget.toFixed(2)}`, 14, y)
    y += 8
    doc.text(`Total Expenses (Unpaid): ₱${totalExpenses.toFixed(2)}`, 14, y)
    y += 8
    doc.text(`Paid Expenses: ₱${paidExpenses.toFixed(2)}`, 14, y)
    y += 8
    doc.text(`Remaining Budget: ₱${remaining.toFixed(2)}`, 14, y)
    y += 12

    expenses.forEach((e, i) => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }

      doc.text(
        `${i + 1}. ${e.description} - ₱${e.amount} (${e.paid ? 'Paid' : 'Unpaid'})`,
        14,
        y
      )
      y += 8
    })

    doc.save('expenses.pdf')
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Expense Tracker</h1>

      <button onClick={exportPDF}>Export PDF</button>

      <h3>Budget</h3>
      <input
        type="number"
        value={budget}
        onChange={e => setBudget(parseFloat(e.target.value) || 0)}
      />

      <h3>Add Expense</h3>

      <input
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={e => setForm({ ...form, amount: e.target.value })}
      />

      <input
        type="date"
        value={form.date}
        onChange={e => setForm({ ...form, date: e.target.value })}
      />

      <div>
        <button onClick={() => setForm({ ...form, paid: false })}>
          Unpaid
        </button>
        <button onClick={() => setForm({ ...form, paid: true })}>
          Paid
        </button>
      </div>

      <button onClick={addExpense}>Add Expense</button>

      <h3>Summary</h3>
      <p>Total Expenses: ₱{totalExpenses.toFixed(2)}</p>
      <p>Paid Expenses: ₱{paidExpenses.toFixed(2)}</p>
      <p>Remaining Budget: ₱{remaining.toFixed(2)}</p>

      <h3>Expense List</h3>
      {expenses.map(e => (
        <div key={e.id}>
          {e.description} - ₱{e.amount} ({e.paid ? 'Paid' : 'Unpaid'})
        </div>
      ))}
    </div>
  )
}
