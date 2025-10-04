import React, { useState, useEffect } from 'react';

// --- Styles ---
// This component injects all the necessary CSS into the page.
const GlobalStyles = () => (
  <style>{`
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f0f2f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1, h2 { color: #1c2b33; }
    form { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    input, select { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em; }
    button { padding: 10px 15px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1em; font-weight: bold; }
    button:hover { background: #0056b3; }
    .expense-list { list-style: none; padding: 0; }
    .expense-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee; }
    .expense-item:last-child { border-bottom: none; }
    .expense-details { display: flex; flex-direction: column; }
    .expense-details .description { font-weight: bold; }
    .expense-details .category { font-size: 0.8em; color: #666; }
    .expense-item .amount { font-weight: bold; font-size: 1.1em; color: #dc3545; }
  `}</style>
);

// Read the backend API URL from the environment variable set in Vercel.
// It falls back to the local URL for development.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  // Function to fetch the list of expenses from the backend
  const fetchExpenses = async () => {
    try {
      // THE FIX: "Cache Busting"
      // We add a unique timestamp to the end of the GET request URL.
      // This makes the URL different every time, forcing the browser and Vercel
      // to bypass any cached (old) data and get the freshest list from our server.
      const response = await fetch(`${API_BASE_URL}/api/expenses?_=${new Date().getTime()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  // useEffect hook runs once when the component first loads
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Function to handle the form submission when adding a new expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExpense = {
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString()
    };

    try {
      // The POST request to add a new expense.
      // POST requests are not cached, so they don't need the cache-busting trick.
      const response = await fetch(`${API_BASE_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        // Clear the form and re-fetch the expenses to update the list
        setDescription('');
        setAmount('');
        fetchExpenses();
      } else {
        console.error("Failed to add expense, server responded with:", response.status);
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
          <input 
            type="text" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="e.g., Coffee with team" 
            required 
          />
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            placeholder="Amount" 
            min="0.01" 
            step="0.01" 
            required 
          />
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
              <div className="expense-details">
                <span className="description">{exp.description}</span>
                <span className="category">{exp.category}</span>
              </div>
              <span className="amount">₹{exp.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;

