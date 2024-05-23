# Crowdfunding Backend

This repository contains the backend code for a crowdfunding platform. It provides APIs for user registration, login, Google OAuth2 authentication, and session management.

## Features

- **User Authentication:** Supports registration, login with email/password, and Google OAuth2 authentication.
- **Password Encryption:** User passwords are securely hashed using bcrypt.js.
- **Session Management:** Utilizes express-session for managing user sessions.
- **Google OAuth2 Integration:** Allows users to authenticate using Google OAuth2.
- **JWT Authentication:** Provides JSON Web Token (JWT) authentication for secure communication.
- **Rate Limiting:** Includes rate limiting to prevent abuse of endpoints.
- **Error Handling:** Proper error handling for various scenarios.
- **CORS Configuration:** Supports Cross-Origin Resource Sharing (CORS) for frontend integration.

## Deployment

The backend is deployed on Vercel and can be accessed at [https://crowdfunding-backend-drab.vercel.app/](https://crowdfunding-backend-drab.vercel.app/).

## Endpoints

- `POST /users/register`: Mendaftarkan pengguna baru.
- `POST /users/login`: Login pengguna dengan email/kata sandi.
- `PUT /users/:id`: Memperbarui informasi pengguna berdasarkan ID (Middleware).
- `GET /users/:id`: Mendapatkan detail pengguna berdasarkan ID.
- `GET /users/profile`: Mendapatkan profile pengguna yang sedang login.
- `GET /auth/google`: Memulai autentikasi Google OAuth2.
- `GET /auth/google/callback`: URL callback setelah autentikasi Google.
- `GET /auth/login/success`: Memeriksa status autentikasi pengguna.
- `GET /auth/logout`: Logout pengguna.
- `GET /fundraisers`: Mendapatkan semua data penggalangan.
- `GET /fundraisers/:id`: Mendapatkan data penggalangan berdasarkan ID.
- `POST /fundraisers`: Menambahkan data penggalangan dana (Middleware).
- `PUT /fundraisers:id`: Memperbarui data penggalangan dana (Middleware).
- `DELETE /fundraisers/:id`: Menghapus data penggalangan dana (Middleware).


## Technologies Used

- Node.js
- Express.js
- MongoDB
- Passport.js
- OAuth2
- Bcrypt.js
- JSON Web Tokens (JWT)

## Usage

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables in a `.env` file.
4. Run the server using `npm start`.

## Contributors

- [Dimas Fajar](https://github.com/SideeID)
