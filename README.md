<h1 align="center">
  Crowdfunding Backend
</h1>

<div align="center">

  [![wakatime](https://wakatime.com/badge/user/018e8ea9-cdd5-49cd-bdc1-0e0377e41ae9/project/47e6aea3-2a39-4c5e-9a4a-53ba17e30535.svg)](https://wakatime.com/badge/user/018e8ea9-cdd5-49cd-bdc1-0e0377e41ae9/project/47e6aea3-2a39-4c5e-9a4a-53ba17e30535)

</div>

<a name="top"></a>

<br/>

This repository contains the backend code for a crowdfunding platform specifically designed to support fundraising efforts for **Palestine**. It provides a comprehensive set of APIs for user registration, login, Google OAuth2 authentication, session management, and integration with Midtrans for handling donations. The platform aims to facilitate secure and efficient fundraising and donor management.
**#freepalestine**

## Features

- **User Authentication:** Supports registration, login with email/password, and Google OAuth2 authentication.
- **Password Encryption:** User passwords are securely hashed using bcrypt.js.
- **Session Management:** Utilizes express-session for managing user sessions.
- **Google OAuth2 Integration:** Allows users to authenticate using Google OAuth2.
- **JWT Authentication:** Provides JSON Web Token (JWT) authentication for secure communication.
- **Rate Limiting:** Includes rate limiting to prevent abuse of endpoints.
- **Error Handling:** Proper error handling for various scenarios.
- **CORS Configuration:** Supports Cross-Origin Resource Sharing (CORS) for frontend integration.

## Start Project

> [!IMPORTANT]
> Before starting, make sure you have Node.js and npm installed on your machine.

1. Clone the repository

```
git clone https://github.com/SideeID/Crowdfunding-Backend
```

2. Open Folder

```
cd Crowdfunding-Backend
```

3. Install Dependecies

```
npm install
```

4. Setting Up Environment

```
cp .env.example .env
```

5. Run Project

```
npm run start:dev
```

> [!TIP]
> For linting the code, use the following commands:

Linting

```bash
  npm run lint
```

Linting dan otomatis fix

```bash
  npm run lint:fix
```

> [!NOTE]
> For automatic testing, ensure you have newman installed:

Automatic testing

```bash
  npm install newman --global
  npm run test
```

## Deployment

The backend is deployed on Vercel and can be accessed at [https://crowdfunding-backend-drab.vercel.app/](https://crowdfunding-backend-drab.vercel.app/).

## API Documentation

> Postman API Documentation [click here](https://documenter.getpostman.com/view/35134769/2sA3XQh2H4)

## Endpoints

> [!WARNING]
> Some endpoints require authentication and proper permissions.

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
| /donations/notification   | POST        | Menangani notifikasi pembayaran dari Midtrans.  |

## Technologies Used

- Node.js
- Express.js
- Exprress Validator
- Newman
- MongoDB
- Passport.js
- OAuth2
- Bcrypt.js
- JSON Web Tokens (JWT)
- Midtrans

## Authors

- [@Side ID](https://github.com/SideeID)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/SideeID/Crowdfunding-Backend/blob/main/LICENSE.md) file for details.
