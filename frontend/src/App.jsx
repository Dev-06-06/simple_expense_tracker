import React, { useState, useEffect } from 'react';

// --- Styles ---
const GlobalStyles = () => (
  <style>{`
    body { font-family: sans-serif; background: #f0f2f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1, h2 { color: #333; }
    form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    input, select { padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 10px 15px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #0056b3; }
    .expense-list { list-style: none; padding: 0; }
    .expense-item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; }
    .expense-item span { font-size: 1.1em; }
    .expense-item .amount { font-weight: bold; }
  `}</style>
);

// This is the base URL for our backend, read from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  const fetchExpenses = async () => {
    try {
      // CORRECTED: The full path to the endpoint is now used
      const response = await fetch(`${API_BASE_URL}/api/expenses`);
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExpense = {
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString()
    };

    try {
      // CORRECTED: The full path to the endpoint is now used
      const response = await fetch(`${API_BASE_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        setDescription('');
        setAmount('');
        fetchExpenses();
      }
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  return (
    <>
      <GlobalStyles />
      <div className="container">
        <h1>Simple Expense Tracker</h1>
        <form onSubmit={handleSubmit}>
          <h2>Add New Expense</h2>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" min="0.01" step="0.01" required />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Transport</option>
            <option>Utilities</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>
          <button type="submit">Add Expense</button>
        </form>

        <h2>Recent Expenses</h2>
        <ul className="expense-list">
          {expenses.map(exp => (
            <li key={exp._id} className="expense-item">
              <span>{exp.description} ({exp.category})</span>
              <span className="amount">₹{exp.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;

