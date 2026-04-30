// Next.js 14 App Router - ready for Vercel
// File: app/page.tsx
'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'

interface Expense {
  id: number
  description: string
  amount: number
  type: string
  date: string
  paid: boolean
}

export default function Page() {
  const [budget, setBudget] = useState(0)
  const [expenses, setExpenses] = useState<Expense[]>([])

  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'Food',
    date: '',
    paid: false,
  })

  const addExpense = () => {
    if (!form.description || !form.amount) return

    const newExpense: Expense = {
      id: Date.now(),
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      date: form.date,
      paid: form.paid,
    }

    setExpenses(prev => [...prev, newExpense])
    setForm({ description: '', amount: '', type: 'Food', date: '', paid: false })
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
    <div className="min-h-screen bg-[#0b1220] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
          <button
            onClick={exportPDF}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            Export PDF
          </button>
        </div>

        {/* Budget Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card title="Total Budget" value={budget} editable setBudget={setBudget} />
          <Card title="Total Expenses" value={totalExpenses} />
          <Card title="Paid Expenses" value={paidExpenses} />
          <Card title="Remaining Budget" value={remaining} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Add Expense */}
          <div className="bg-[#111827] p-4 rounded-xl space-y-3">
            <h2 className="font-semibold">Add Expense</h2>

            <input
              placeholder="Description"
              className="w-full p-2 bg-[#0b1220] rounded"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            <input
              type="number"
              placeholder="Amount"
              className="w-full p-2 bg-[#0b1220] rounded"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />

            <input
              type="date"
              className="w-full p-2 bg-[#0b1220] rounded"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />

            <select
              className="w-full p-2 bg-[#0b1220] rounded"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Utilities</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setForm({ ...form, paid: false })}
                className={`flex-1 p-2 rounded ${!form.paid ? 'bg-orange-500' : 'bg-gray-600'}`}
              >
                Unpaid
              </button>
              <button
                onClick={() => setForm({ ...form, paid: true })}
                className={`flex-1 p-2 rounded ${form.paid ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                Paid
              </button>
            </div>

            <button
              onClick={addExpense}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded"
            >
              Add
            </button>
          </div>

          {/* Expense List */}
          <div className="bg-[#111827] p-4 rounded-xl">
            <h2 className="font-semibold mb-3">Expense History</h2>

            {expenses.length === 0 ? (
              <p className="text-gray-400">No expenses yet.</p>
            ) : (
              <ul className="space-y-2">
                {expenses.map(e => (
                  <li key={e.id} className="flex justify-between">
                    <span>{e.description}</span>
                    <span>
                      ₱{e.amount} - {e.paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, editable = false, setBudget }: any) {
  return (
    <div className="bg-[#111827] p-4 rounded-xl">
      <p className="text-sm text-gray-400">{title}</p>
      {editable ? (
        <input
          type="number"
          className="bg-transparent text-xl mt-2 w-full"
          value={value}
          onChange={e => setBudget(parseFloat(e.target.value) || 0)}
        />
      ) : (
        <h2 className="text-xl mt-2">₱{value.toFixed(2)}</h2>
      )}
    </div>
  )
}

// Install dependencies:
// npm install jspdf

// Deploy to Vercel:
// 1. npx create-next-app@latest
// 2. Replace app/page.tsx with this file
// 3. npm install jspdf
// 4. vercel deploy
