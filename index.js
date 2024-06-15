require('dotenv').config();
const express = require('express');
const expressListRoutes = require('express-list-routes');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
require('./src/db/mongo');
require('./src/auth/passport');
const path = require('path');

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
app.use(express.static(path.join(__dirname, 'public')));

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
      <li><strong>DELETE /users/:id</strong>: Menghapus pengguna berdasarkan ID.</li>
      <li><strong>GET /users</strong>: Mendapatkan semua daftar pengguna.</li>
      <br>
      <li><strong>GET /fundraisers</strong>: Mendapatkan daftar penggalangan dana.</li>
      <li><strong>POST /fundraisers</strong>: Membuat penggalangan dana baru.</li>
      <li><strong>GET /fundraisers/:id</strong>: Mendapatkan detail penggalangan dana berdasarkan ID.</li>
      <li><strong>PUT /fundraisers/:id</strong>: Memperbarui informasi penggalangan dana berdasarkan ID.</li>
      <li><strong>DELETE /fundraisers/:id</strong>: Menghapus penggalangan dana berdasarkan ID.</li>
      <br>
      <li><strong>GET /auth/google</strong>: Memulai proses autentikasi menggunakan Google OAuth2.</li>
      <li><strong>GET /auth/google/callback</strong>: Callback URL setelah autentikasi Google berhasil atau gagal.</li>
      <li><strong>GET /auth/login/success</strong>: Mengecek status autentikasi pengguna dan mengembalikan informasi pengguna yang telah diautentikasi.</li>
      <li><strong>GET /auth/logout</strong>: Mengeluarkan pengguna dari sesi dan mengarahkan ke halaman utama.</li>
      <br>
      <li><strong>POST /donations</strong>: Membuat donasi baru.</li>
      <li><strong>POST /donations/notification</strong>: Menerima notifikasi dari Midtrans setelah transaksi donasi berhasil.</li>
      <br>
      <li><strong>POST /mitra</strong>: Membuat mitra baru.</li>
      <li><strong>GET /mitra</strong>: Mendapatkan daftar mitra.</li>
      <li><strong>GET /mitra/:id</strong>: Mendapatkan detail mitra berdasarkan ID.</li>
      <li><strong>PUT /mitra/:id</strong>: Memperbarui informasi mitra berdasarkan ID.</li>
      <li><strong>DELETE /mitra/:id</strong>: Menghapus mitra berdasarkan ID.</li>
    </ul>

    <h2>Contoh Penggunaan</h2>
    <p>Contoh penggunaan API Penggalangan Dana:</p>
    <pre>
      <code>
      <h2>registrasi pengguna</h2>
      POST /users/register
      {
        "displayName": "John Doe",
        "email": "email@example.com",
        "password": "password"
      }

      <h2>login pengguna</h2>
      POST /users/login
      {
        "email": "email@example.com",
        "password": "password"
      }

      <h2>update pengguna</h2>
      PUT /users/:id
      {
        "displayName": "John Doe",
        "email": "example@gmail.com",
        "password": "password"
      }

      <h2>detail pengguna by ID</h2>
      GET /users/:id

      <h2>profile pengguna yang sedang login</h2>
      GET /users/profile

      <h2>hapus pengguna</h2>
      DELETE /users/:id

      <h2>daftar semua pengguna</h2>
      GET /users

      <h2>daftar penggalangan dana</h2>
      GET /fundraisers

      <h2>detail penggalangan dana by ID</h2>
      GET /fundraisers/:id

      <h2>buat penggalangan dana</h2>
      POST /fundraisers
      {
        "title": "Your fundraiser title",
        "description": "Describe your fundraiser in detail",
        "goal": 1000000,
        "image": "https://i.pinimg.com/564x/3c/a3/f0/3ca3f02e1ec3a6d2d30a6558b97add06.jpg",
        "isClosed": false,
        "endDate": "2024-12-31T23:59:59.000Z"
      }

      <h2>update penggalangan dana</h2>
      PUT /fundraisers/:id
      {
        "title": "Your fundraiser title",
        "description": "Describe your fundraiser in detail",
        "goal": 1000000,
        "image": "https://i.pinimg.com/564x/3c/a3/f0/3ca3f02e1ec3a6d2d30a6558b97add06.jpg",
        "isClosed": false,
        "endDate": "2024-12-31T23:59:59.000Z"
      }

      <h2>hapus penggalangan dana</h2>
      DELETE /fundraisers/:id
      </code>
    </pre>
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
