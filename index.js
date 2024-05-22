require('dotenv').config();
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const expressListRoutes = require('express-list-routes');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./src/db/mongo');
require('./src/auth/passport');

const userRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/auth');
const fundraiserRoutes = require('./src/routes/fundraiser');

const app = express();
const PORT = process.env.PORT || 6005;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);
app.use(express.json());

app.use(
  session({ secret: 'secret234563', resave: false, saveUninitialized: true }),
);
app.use(passport.initialize());
app.use(passport.session());

// endpoint dokumentasi API
app.get('/', (req, res) => {
  res.send(`
    <h1>API PENGGALANGAN DANA</h1>
    <p>Berikut adalah dokumentasi sederhana untuk API yang telah dibuat:</p>
    <h2>Endpoint</h2>
    <ul>
      <li><strong>GET /</strong>: Menampilkan dokumentasi API.</li>
      <li><strong>POST /users/register</strong>: Mendaftarkan pengguna baru.</li>
      <li><strong>POST /users/login</strong>: Login pengguna.</li>
      <li><strong>PUT /users/:id</strong>: Memperbarui informasi pengguna berdasarkan ID.</li>
      <li><strong>GET /users/:id</strong>: Mendapatkan detail pengguna berdasarkan ID.</li>
      <li><strong>GET /users/profile</strong>: Mendapatkan profile pengguna yang sedang login</li>
      <br>
      <li><strong>GET /fundraisers</strong>: Mendapatkan daftar penggalangan dana.</li>
      <li><strong>POST /fundraisers</strong>: Membuat penggalangan dana baru.</li>
      <li><strong>GET /fundraisers/:id</strong>: Mendapatkan detail penggalangan dana berdasarkan ID.</li>
      <br>
      <li><strong>GET /auth/google</strong>: Memulai proses autentikasi menggunakan Google OAuth2.</li>
      <li><strong>GET /auth/google/callback</strong>: Callback URL setelah autentikasi Google berhasil atau gagal.</li>
      <li><strong>GET /auth/login/success</strong>: Mengecek status autentikasi pengguna dan mengembalikan informasi pengguna yang telah diautentikasi.</li>
      <li><strong>GET /auth/logout</strong>: Mengeluarkan pengguna dari sesi dan mengarahkan ke halaman utama.</li>
    </ul>

    <h2>Contoh Penggunaan</h2>
    <p>Contoh penggunaan API Penggalangan Dana:</p>
    <pre>
      <code>
      // Mendaftarkan pengguna baru
      POST /users/register
      {
        "displayName": "John Doe",
        "email": "email@example.com",
        "password": "password"
      }

      // Login pengguna
      POST /users/login
      {
        "email": "email@example.com",
        "password": "password"
      }

      // Memperbarui informasi pengguna
      PUT /users/:id
      {
        "displayName": "John Doe",
        "email": "example@gmail.com",
        "password": "password"
      }

      // Mendapatkan detail pengguna
      GET /users/:id

      // Mendapatkan profile pengguna yang sedang login
      GET /users/profile

      // Mendapatkan daftar penggalangan dana
      GET /fundraisers

      // Mendapatkan detail penggalangan dana
      GET /fundraisers/:id

      // Membuat penggalangan dana baru
      POST /fundraisers
      {
        "title": "Your fundraiser title",
        "description": "Describe your fundraiser in detail",
        "goal": 1000000,
        "image": "https://i.pinimg.com/564x/3c/a3/f0/3ca3f02e1ec3a6d2d30a6558b97add06.jpg",
        "isClosed": false,
        "endDate": "2024-12-31T23:59:59.000Z"
      }
      </code>
    </pre>
  `);
});

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/fundraisers', fundraiserRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  expressListRoutes(app);
});
