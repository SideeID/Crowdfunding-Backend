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
      <li><strong>GET /auth/google</strong>: Memulai proses autentikasi menggunakan Google OAuth2.</li>
      <li><strong>GET /auth/google/callback</strong>: Callback URL setelah autentikasi Google berhasil atau gagal.</li>
      <li><strong>GET /auth/login/success</strong>: Mengecek status autentikasi pengguna dan mengembalikan informasi pengguna yang telah diautentikasi.</li>
      <li><strong>GET /auth/logout</strong>: Mengeluarkan pengguna dari sesi dan mengarahkan ke halaman utama.</li>
    </ul>

    <h2>Request</h2>
    <h3>/register</h3>
    <p>Request untuk mendaftarkan pengguna baru:</p>
    <pre>
    {
      "displayName": "Nama Pengguna",
      "email": "email@example.com",
      "password": "password"
    }
    </pre>
    <p>Request harus berupa metode HTTP POST dan berisi data pengguna yang ingin didaftarkan.</p>

    <h3>/login</h3>
    <p>Request untuk login pengguna:</p>
    <pre>
    {
      "email": "email@example.com",
      "password": "password"
    }
    </pre>
    <p>Request harus berupa metode HTTP POST dan berisi data pengguna yang ingin login.</p>

    <h3>/user/:id</h3>
    <p>Request untuk mendapatkan informasi pengguna berdasarkan ID:</p>
    <pre>
    {
      "id": "user_id"
    }
    </pre>
    <p>Request harus berupa metode HTTP GET dan berisi ID pengguna yang ingin dicari.</p>

    <h3>/user/:id</h3>
    <p>Request untuk memperbarui informasi pengguna berdasarkan ID:</p>
    <pre>
    {
      "displayName": "Nama Pengguna",
      "email": "email@example.com",
      "password": "password",
      "image": "url_gambar_profil"
    }
    </pre>
    <p>Request harus berupa metode HTTP PUT dan berisi data pengguna yang ingin diperbarui.</p>

    <h2>Response</h2>
    <h3>/login/success</h3>
    <p>Response jika pengguna berhasil diautentikasi:</p>
    <pre>
    {
      "success": true,
      "message": "user berhasil diautentikasi",
      "user": {
        "_id": "user_id",
        "googleId": "google_id",
        "displayName": "Nama Pengguna",
        "email": "email@example.com",
        "image": "url_gambar_profil"
      }
    }
    </pre>
    <p>Response jika pengguna belum diautentikasi:</p>
    <pre>
    {
      "success": false,
      "message": "user belum melakukan autentikasi"
    }
    </pre>

    <h2>Konfigurasi CORS</h2>
    <p>API ini telah diatur untuk menerima permintaan dari semua origin (*). Mendukung metode HTTP GET, POST, PUT, DELETE, dan mengirim kredensial.</p>

    <h2>Autentikasi</h2>
    <p>Autentikasi dilakukan menggunakan Google OAuth2. Client ID dan Client Secret diambil dari variabel lingkungan (<strong>CLIENT_ID</strong> dan <strong>CLIENT_SECRET</strong>).</p>

    <h2>Session Management</h2>
    <p>Sesi pengguna dikelola menggunakan express-session dengan konfigurasi sebagai berikut:</p>
    <pre>
    app.use(
      session({
        secret: 'secret234563',
        resave: false,
        saveUninitialized: true,
      })
    );
    </pre>

    <h2>Database</h2>
    <p>Pengguna yang berhasil diautentikasi akan disimpan dalam database MongoDB dengan schema sebagai berikut:</p>
    <pre>
    const userSchema = new mongoose.Schema({
      googleId: String,
      displayName: String,
      email: String,
      image: String,
      password: String,
    });
    </pre>

    <h2>Run Server</h2>
    <p>Server berjalan pada port yang ditentukan dalam variabel lingkungan (<strong>PORT</strong>) atau default ke <strong>6005</strong>:</p>
    <pre>
    app.listen(PORT, () => {
      console.log(\`Server is running on port \${PORT}\`);
    });
    </pre>
  `);
});

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  expressListRoutes(app);
});
