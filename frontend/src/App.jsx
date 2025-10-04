import React, { useState, useEffect } from 'react';

// --- STYLES (This component injects all CSS into the page) ---
// By keeping styles in the component, we make it self-contained and easy to manage.
const GlobalStyles = () => (
  <style>{`
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      background: #f0f2f5; 
      margin: 0; 
      padding: 20px; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #fff; 
      padding: 20px 30px; 
      border-radius: 8px; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
    }
    h1, h2 { 
      color: #1c1e21; 
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
    }
    form { 
      display: flex; 
      flex-direction: column; 
      gap: 15px; 
      margin-bottom: 30px; 
    }
    input, select { 
      padding: 12px; 
      border: 1px solid #ccc; 
      border-radius: 6px; 
      font-size: 1em;
    }
    button { 
      padding: 12px 15px; 
      background: #007bff; 
      color: white; 
      border: none; 
      border-radius: 6px; 
      cursor: pointer; 
      font-size: 1.1em;
      font-weight: bold;
      transition: background-color 0.2s;
    }
    button:hover { 
      background: #0056b3; 
    }
    .expense-list { 
      list-style: none; 
      padding: 0; 
    }
    .expense-item { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding: 15px; 
      border-bottom: 1px solid #eee; 
    }
    .expense-item:last-child {
      border-bottom: none;
    }
    .expense-details {
      display: flex;
      flex-direction: column;
    }
    .expense-description {
      font-size: 1.1em;
      font-weight: 500;
    }
    .expense-category {
      font-size: 0.8em;
      color: #666;
    }
    .expense-amount { 
      font-weight: bold; 
      font-size: 1.2em;
      color: #d9534f;
    }
  `}</style>
);

// This is the URL of your Flask backend. When you deploy, this will change.
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api/expenses';

// The main App component that holds the entire application
function App() {
  // State variables to store the list of expenses and the current form inputs
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food'); // Default category

  // This function fetches all expenses from the backend API
  const fetchExpenses = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  // The useEffect hook runs the fetchExpenses function once when the app first loads
  useEffect(() => {
    fetchExpenses();
  }, []);

  // This function is called when the user submits the form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default browser action of reloading the page
    
    // Create the new expense object to send to the backend
    const newExpense = {
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString() // Add the current date
    };

    try {
      // Send the new expense to the backend using a POST request
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        // If successful, clear the form and refresh the expense list
        setDescription('');
        setAmount('');
        setCategory('Food');
        fetchExpenses(); 
      }
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

  // This is the JSX that defines the HTML structure of your application
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
            placeholder="Expense Description" 
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
                <span className="expense-description">{exp.description}</span>
                <span className="expense-category">{exp.category}</span>
              </div>
              <span className="expense-amount">₹{exp.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;

