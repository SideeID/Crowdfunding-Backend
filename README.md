# Crowdfunding Backend
[![wakatime](https://wakatime.com/badge/user/018e8ea9-cdd5-49cd-bdc1-0e0377e41ae9/project/47e6aea3-2a39-4c5e-9a4a-53ba17e30535.svg)](https://wakatime.com/badge/user/018e8ea9-cdd5-49cd-bdc1-0e0377e41ae9/project/47e6aea3-2a39-4c5e-9a4a-53ba17e30535)

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

| Endpoint                  | HTTP Method | Description |
| ------------------------- | ----------- | ----------- |
| /users/register           | POST        | Mendaftarkan pengguna baru. |
| /users/login              | POST        | Login pengguna dengan email/kata sandi. |
| /users/:id                | PUT         | Memperbarui informasi pengguna berdasarkan ID (Middleware). |
| /users/:id                | GET         | Mendapatkan detail pengguna berdasarkan ID. |
| /users/profile            | GET         | Mendapatkan profile pengguna yang sedang login. |
| /users/:id                | DELETE      | Menghapus data user (Middleware). |
| /users                    | GET         | Mendapatkan semua record user. |
| /auth/google              | GET         | Memulai autentikasi Google OAuth2. |
| /auth/google/callback     | GET         | URL callback setelah autentikasi Google. |
| /auth/login/success       | GET         | Memeriksa status autentikasi pengguna. |
| /auth/logout              | GET         | Logout pengguna. |
| /fundraisers              | GET         | Mendapatkan semua data penggalangan. |
| /fundraisers/:id          | GET         | Mendapatkan data penggalangan berdasarkan ID. |
| /fundraisers              | POST        | Menambahkan data penggalangan dana (Middleware). |
| /fundraisers/:id          | PUT         | Memperbarui data penggalangan dana (Middleware). |
| /fundraisers/:id          | DELETE      | Menghapus data penggalangan dana (Middleware). |
| /donations                | POST        | Menambahkan data donasi. |

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Passport.js
- OAuth2
- Bcrypt.js
- JSON Web Tokens (JWT)
- Midtrans

## Usage

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up environment variables in a `.env` file.
4. Run the server using `npm start`.

## Contributors

- [Dimas Fajar](https://github.com/SideeID)
