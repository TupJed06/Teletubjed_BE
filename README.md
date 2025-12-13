
# 🌟 Teletubjed_BE

> **A backend REST API for the Teletubjed application — handles authentication, data operations, and business logic.**

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge&logo=javascript)

## 📖 About The Project

Describe here what *Teletubjed_BE* does (e.g., serves API for the Teletubjed app with features such as history CRUD, focus CRUD, etc.)

---

## 📂 Project Structure

```text
.
├── config/               # Configuration files (DB, environment, logging)
├── controllers/          # API controller logic
├── models/               # Database models/schemas
├── routes/               # Express routing definitions
├── utills/               # Utility functions
├── .gitignore
├── package.json
├── server.js             # Entry point
└── vercel.json           # Deployment config


---

## 💻 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/TupJed06/Teletubjed_BE.git
cd Teletubjed_BE
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file with:

```
# Example
PORT=...
DB_URI=...
JWT_SECRET=...
```

### 4. Run the Server

```bash
npm start
```

---

## 🚀 API Endpoints

| Method | Endpoint | Description            |
| ------ | -------- | ---------------------- |
|  GET    | `/`      | Detail of project |
|  -   | `/history/` |history CRUD             |
| -     | `/focus/` | focus CRUD             |


---

## 👨‍💻 Contributors

* Jedsada Meesuk
* Patcharapon Srisuwan
* Patthadon Phengpinij
* Warapong Thongkhundam

---

## 📜 Deploy Link
Back End : [Deployment](teletubjed-be.vercel.app)


