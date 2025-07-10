const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const pool = require('./config/db');
const MySQLStore = require('express-mysql-session')(session);

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const sessionStore = new MySQLStore({}, pool);


const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://www.waqasabidwork.online',
  credentials: true
}));

app.set('trust proxy', 1);

app.use(session({
  key: process.env.KEY,
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.get('/', (req, res) => {
  res.json({ message: "Backend server is running!" });
});

// routes
app.use(userRoutes);
app.use(projectRoutes);
app.use(contactRoutes);
app.use(adminRoutes);
app.use(portfolioRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred'
  });
});

process.on('beforeExit', async () => {
  await pool.end();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

