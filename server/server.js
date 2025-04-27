const express = require('express');
const app = express();
app.use(express.json());

const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'transactions.db');
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create transactions table if not exists (inside backend itself, no API needed)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL,
        date TEXT,
        description TEXT,
        category TEXT
      );
    `);

    console.log('Database and Table Initialized Successfully');

    app.listen(4000, () => {
      console.log('Server Started at http://localhost:4000/');
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// API-1 GET ALL TRANSACTIONS
app.get('/transactions', async (req, res) => {
    const getTransactionsQuery = `
      SELECT *
      FROM transactions
      ORDER BY date DESC;
    `;
    const transactions = await db.all(getTransactionsQuery);
    res.send(transactions);
  });

  // API-2 CREATE NEW TRANSACTION
  app.post('/transactions', async (req, res) => {
    const { amount, date, description, category } = req.body;
    const addTransactionQuery = `
      INSERT INTO transactions (amount, date, description, category)
      VALUES (${amount}, '${date}', '${description}', '${category}');
    `;
    await db.run(addTransactionQuery);
    res.send('Transaction Successfully Added');
  });

  // API-3 UPDATE A TRANSACTION
  app.put('/transactions/:transactionId', async (req, res) => {
    const { transactionId } = req.params;
    const { amount, date, description, category } = req.body;
    const updateTransactionQuery = `
      UPDATE transactions
      SET 
        amount = ${amount},
        date = '${date}',
        description = '${description}',
        category = '${category}'
      WHERE transaction_id = ${transactionId};
    `;
    await db.run(updateTransactionQuery);
    res.send('Transaction Successfully Updated');
  });

  // API-4 DELETE A TRANSACTION
  app.delete('/transactions/:transactionId', async (req, res) => {
    const { transactionId } = req.params;
    const deleteTransactionQuery = `
      DELETE FROM transactions
      WHERE transaction_id = ${transactionId};
    `;
    await db.run(deleteTransactionQuery);
    res.send('Transaction Successfully Deleted');
  });
  