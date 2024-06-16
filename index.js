require('dotenv').config();
const express = require('express');
const expressListRoutes = require('express-list-routes');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('./src/db/mongo');
require('./src/auth/passport');

const userRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/auth');
const fundraiserRoutes = require('./src/routes/fundraiser');
const donationRoutes = require('./src/routes/donation');
const mitraRoutes = require('./src/routes/mitra');

const app = express();
const PORT = process.env.PORT || 6005;

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin
        || [
          'http://localhost:5173',
          'http://localhost:6005',
          'https://crowdfunding-backend-drab.vercel.app',
          'https://bersama-palestina.vercel.app',
        ].includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Origin',
      'X-Requested-With',
      'Accept',
    ],
  }),
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret234563',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Penggalangan Dana untuk Palestina</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f4;
          }
          .container {
            text-align: center;
            background-color: #fff;
            padding: 2em;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
          }
          p {
            color: #666;
          }
          .button {
            display: inline-block;
            margin-top: 1em;
            padding: 0.5em 1em;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 4px;
            text-decoration: none;
            font-size: 1em;
          }
          .button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Selamat datang di API Penggalangan dana untuk Palestina</h1>
          <p>Terima kasih telah mengunjungi API kami. Kami berkomitmen untuk mendukung Palestina.</p>
          <a href="https://bersama-palestina.vercel.app" class="button">Kunjungi Situs Kami</a>
        </div>
      </body>
    </html>
  `);
});

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/fundraisers', fundraiserRoutes);
app.use('/donations', donationRoutes);
app.use('/mitra', mitraRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  expressListRoutes(app);
});
