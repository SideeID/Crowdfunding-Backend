require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-google-oauth2').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Userdb = require('../../src/model/userSchema');
require('../../src/db/mongo');

const app = express();
const PORT = process.env.PORT || 6005;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const { JWT_SECRET } = process.env;

const MAX_LOGIN_ATTEMPTS = 5;

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

passport.use(
  new OAuth2Strategy(
    {
      clientID: clientId,
      clientSecret,
      callbackURL:
        'https://crowdfunding-backend-drab.vercel.app/auth/google/callback',
      scope: ['email', 'profile'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Userdb.findOne({ googleId: profile.id });
        if (!user) {
          user = new Userdb({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Userdb.findById(id);
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
});

app.get('/', (req, res) => {
  res.send(`
    <h1>API PENGGALANGAN DANA</h1>
    <p>Berikut adalah dokumentasi sederhana untuk API yang telah dibuat:</p>
    <h2>Endpoint</h2>
    <ul>
      <li><strong>GET /</strong>: Menampilkan dokumentasi API.</li>
      <li><strong>POST /register</strong>: Mendaftarkan pengguna baru.</li>
      <li><strong>GET /auth/google</strong>: Memulai proses autentikasi menggunakan Google OAuth2.</li>
      <li><strong>GET /auth/google/callback</strong>: Callback URL setelah autentikasi Google berhasil atau gagal.</li>
      <li><strong>GET /login/success</strong>: Mengecek status autentikasi pengguna dan mengembalikan informasi pengguna yang telah diautentikasi.</li>
      <li><strong>GET /logout</strong>: Mengeluarkan pengguna dari sesi dan mengarahkan ke halaman utama.</li>
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

app.post('/register', async (req, res) => {
  const { displayName, email, password } = req.body;
  if (!displayName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Harap isi semua bidang coy!!!' });
  }

  try {
    let user = await Userdb.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Waduh email sudah terdaftar nampaknya',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new Userdb({ displayName, email, password: hashedPassword });
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: 'Registrasi berhasil', user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Harap isi semua bidang coy!!!' });
  }

  try {
    const user = await Userdb.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Waduh mail tidak ditemukan nih!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.loginAttempts = req.session.loginAttempts
        ? req.session.loginAttempts + 1
        : 1;
      if (req.session.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        return res.status(401).json({
          success: false,
          attempts: req.session.loginAttempts,
          message:
            'Masukin password yang bener dong! gitu aja ga bisa, lihat tu tetangga sebelah udah kawin semua, lu masih aja ga bisa login, yang bener aja!',
        });
      }
      return res
        .status(400)
        .json({ success: false, message: 'Password salah' });
    }

    delete req.session.loginAttempts;
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
});

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'https://your-frontend-domain.vercel.app/dashboard',
    failureRedirect: 'https://your-frontend-domain.vercel.app/login',
  }),
);

app.get('/login/success', async (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: 'user berhasil diautentikasi',
      user: req.user,
    });
  }
  return res
    .status(401)
    .json({ success: false, message: 'user belum melakukan autentikasi' });
});

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.redirect('https://your-frontend-domain.vercel.app');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
