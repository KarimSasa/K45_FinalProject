import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { RowDataPacket } from 'mysql2';
import crypto from 'crypto';

dotenv.config();

const app = express();
const port = process.env['PORT'] || 3000;

// Generate a strong secret key using crypto
const generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Store the generated key
const secretKey = process.env['JWT_SECRET'] || generateSecretKey();

app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env['DB_HOST'],
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_NAME'],
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Add these interfaces at the top of the file
interface MarketData extends RowDataPacket {
  label: string;
  value: number;
  year: number;
  market_type: string;
  color: string;
}

interface AdoptionData extends RowDataPacket {
  year: number;
  percentage: number;
}

// Routes
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username.toLowerCase() === 'karim' && password.toLowerCase() === 'karim') {
    const token = jwt.sign(
      { 
        id: 1, // Add a user ID
        username: username.toLowerCase(),
        timestamp: Date.now() // Add timestamp for additional security
      },
      secretKey,
      { 
        expiresIn: '1h',
        algorithm: 'HS256'
      }
    );
    res.json({
      success: true,
      err: null,
      token
    });
  } else {
    res.status(401).json({
      success: false,
      token: null,
      err: 'Username or password is incorrect'
    });
  }
});

// JWT middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      err: 'No token provided'
    });
  }

  jwt.verify(token, secretKey, { algorithms: ['HS256'] }, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        officialError: err,
        err: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
}

app.get('/api/ai-innovations', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query<MarketData[]>('SELECT * FROM market_data ORDER BY year');
    const data = {
      labels: rows.map((row: any) => row.label),
      datasets: [{
        data: rows.map((row: any) => row.value),
        backgroundColor: rows.map((row: any) => row.color),
        borderWidth: 1
      }]
    };
    res.json(data);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/ai-adoption', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query<AdoptionData[]>('SELECT * FROM adoption_data ORDER BY year');
    const data = {
      labels: rows.map((row: any) => row.year.toString()),
      datasets: [{
        label: 'Multimodal Generative AI Solutions (%)',
        data: rows.map((row: any) => row.percentage),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
    res.json(data);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/ai-innovations', authenticateToken, async (req, res) => {
  try {
    const { label, value, year, market_type, color } = req.body;
    const [result] = await pool.query(
      'INSERT INTO market_data (label, value, year, market_type, color) VALUES (?, ?, ?, ?, ?)',
      [label, value, year, market_type, color]
    );
    res.status(201).json({ message: 'Data added successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/ai-adoption', authenticateToken, async (req, res) => {
  try {
    const { year, percentage } = req.body;
    const [result] = await pool.query(
      'INSERT INTO adoption_data (year, percentage) VALUES (?, ?)',
      [year, percentage]
    );
    res.status(201).json({ message: 'Data added successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/dashboard-content', authenticateToken, async (req, res) => {
  const content = {
    summary: `The convergence of edge AI and generative AI represents a transformative shift in how we process and utilize artificial intelligence. Edge AI brings computation closer to data sources, while generative AI creates new content and insights. This synergy enables real-time processing, enhanced privacy, and personalized experiences without constant cloud connectivity. Recent breakthroughs in AI model optimization have made it possible to run sophisticated language models on edge devices, opening new possibilities for industries ranging from healthcare to manufacturing.
  
    The integration of these technologies addresses critical challenges in modern computing: latency reduction, bandwidth optimization, and data privacy. By processing data locally on edge devices, organizations can ensure faster response times and better security for sensitive information. This approach is particularly valuable in scenarios requiring real-time decision-making, such as autonomous vehicles, industrial automation, and healthcare monitoring systems.

    Furthermore, the market for edge AI and generative AI solutions is experiencing remarkable growth. Current projections indicate that the global edge AI market, valued at approximately USD 21 billion today, is expected to exceed USD 140 billion by 2034. Similarly, the generative AI market is anticipated to reach USD 356 billion by 2030, marking a significant increase from its current USD 36 billion valuation. This growth is driven by increasing demand for real-time AI capabilities and the development of more efficient, edge-optimized AI models.`,
    sourceUrl: 'https://www.wevolver.com/article/chapter-ii-innovations-and-advancements-in-generative-ai-at-the-edge',
    techStack: `This application is built using Angular 19 with standalone components and a Node.js/Express backend. The architecture leverages TypeScript throughout, MySQL for data persistence, Chart.js for data visualization, and implements JWT with crypto-based encryption for secure authentication. The frontend follows WCAG accessibility guidelines and features responsive design with SCSS styling.`
  };
  res.json(content);
});
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

// Add global error handler
app.use((err: any, req: any, res: any, next: any) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      success: false,
      officialError: err,
      err: 'Authentication failed'
    });
  } else {
    next(err);
  }
});