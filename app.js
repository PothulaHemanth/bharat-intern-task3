const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://0.0.0.0:27017/expenseTracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', function(callback) {
  console.log("connection succeeded");
});

// Create Expense model
const Expense = mongoose.model('Expense', {
  name: String,
  amount: Number,
});

app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Serve static files (like style.css and script.js)
    app.use(express.static('public'));
    
    // Set up routes
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/expense.html');
    });
    
    app.get('/expenses', async (req, res) => {
      try {
        console.log('Fetching expenses...');
        const expenses = await Expense.find();
        console.log('Expenses:', expenses);
        res.json(expenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
    
    app.post('/expenses', async (req, res) => {
      const { name, amount } = req.body;
      try {
        const newExpense = new Expense({ name, amount });
        await newExpense.save();
        res.json(newExpense);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });