const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// @route   GET api/transactions
// @desc    Get all transactions for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/transactions
// @desc    Add a transaction
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    const newTransaction = new Transaction({
      user: req.user.id,
      amount,
      type,
      category,
      description,
      date: date || Date.now()
    });

    const transaction = await newTransaction.save();
    res.json(transaction);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    // Build transaction object
    const transactionFields = {};
    if (amount !== undefined) transactionFields.amount = amount;
    if (type !== undefined) transactionFields.type = type;
    if (category !== undefined) transactionFields.category = category;
    if (description !== undefined) transactionFields.description = description;
    if (date !== undefined) transactionFields.date = date;

    // Find transaction by id
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update transaction
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: transactionFields },
      { new: true }
    );

    res.json(transaction);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find transaction by id
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete transaction
    await Transaction.findByIdAndRemove(req.params.id);

    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/transactions/summary
// @desc    Get transaction summary (total income, expenses, balance)
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    
    let totalIncome = 0;
    let totalExpenses = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });
    
    const balance = totalIncome - totalExpenses;
    
    res.json({
      totalIncome,
      totalExpenses,
      balance
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/transactions/categories
// @desc    Get transaction summary by categories
// @access  Private
router.get('/categories', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    
    // Group transactions by category
    const categories = {};
    
    transactions.forEach(transaction => {
      const { category, amount, type } = transaction;
      
      if (!categories[category]) {
        categories[category] = {
          income: 0,
          expense: 0
        };
      }
      
      if (type === 'income') {
        categories[category].income += amount;
      } else {
        categories[category].expense += amount;
      }
    });
    
    res.json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;