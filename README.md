# JudgeME!

> "Your stats don't lie, but they do make me laugh."

**JudgeME** is a ruthlessly honest AI application that analyzes your public profiles-**GitHub, Chess.com, and LeetCode**-and uses Google's Gemini AI to generate a brutal, personalized roast based on your data.

## Features

- **Multi-Platform Analysis**:
  - **GitHub**: Judges your commit history, top languages, and follower count.
  - **Chess.com**: Roasts your Blitz/Rapid ratings and puzzle scores.
  - **LeetCode**: Mocks your acceptance rate, "Easy" problem merchant status, and ranking.
- **AI-Powered Roasts**: Uses **Google Gemini 2.5 Flash** to generate unique, context-aware insults.
- **Secure Auth**: GitHub OAuth integration with Passport.js and JWT session handling.

---

## Tech Stack

### **Frontend**

[![Frontend](https://skillicons.dev/icons?i=html,css,js,react,tailwind,vite)](https://skillicons.dev)

- **Axios** (API Requests)

### **Backend**

[![Backend](https://skillicons.dev/icons?i=nodejs,express,)](https://skillicons.dev)

- **Passport.js** (GitHub OAuth Strategy)
- **Google Gemini API** (AI Logic)
- **JSON Web Tokens (JWT)** (Authentication)

---

## Environment Variables

Create a `.env` file in both the `backend` and `frontend` directories.

### **Backend (.env)**

Location: `JudgeME/backend/.env`

```env
PORT=<port>
CLIENT_URL=<frontend_url>
SERVER_URL=<backend_url>
JWT_SECRET=your_super_secret_jwt_key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### **Frontend (.env)**

Location: `JudgeME/frontend/.env`

```env
VITE_SERVER_URL=backend_url
```

## API Endpoints

| Method | Endpoint      | Description                           |
| ------ | ------------- | ------------------------------------- |
| GET    | /auth/github  | Initiates GitHub OAuth login          |
| GET    | /api/github   | Fetches GitHub data & generates roast |
| POST   | /api/chess    | Fetches Chess.com stats & roast       |
| POST   | /api/leetcode | Fetches LeetCode stats & roast        |

> Was a fun side-project to do over the weekend -Hawcker
