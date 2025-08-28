import express from 'express';
import postgres from 'postgres';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

import dotenv from 'dotenv';
dotenv.config();


const port = process.env.PORT || 3009;

// Connect to Postgres using Postgres.js
// Make sure your DATABASE_URL includes sslmode=require or enable SSL in options
const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false }
});

// API endpoint to get total count
app.get('/api/total', async (req, res) => {
  try {
    const result = await sql`SELECT total FROM dhikr_total LIMIT 1`;
    const total = (result.length > 0) ? result[0].total : 0;
    res.json({ total });
  } catch (error) {
    console.error('Error fetching total:', error);
    res.status(500).json({ error: 'Failed to fetch total' });
  }
});

// API endpoint to increment total count
app.post('/api/increment', async (req, res) => {
  try {
    await sql`UPDATE dhikr_total SET total = total + 1`;
    const result = await sql`SELECT total FROM dhikr_total LIMIT 1`;
    const total = (result.length > 0) ? result[0].total : 0;
    res.json({ total });
  } catch (error) {
    console.error('Error updating total:', error);
    res.status(500).json({ error: 'Failed to update total' });
  }
});

// Serve static files from current folder
app.use(express.static('.'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
