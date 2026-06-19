# Baby Math Cognitive Training System

Adaptive math learning app for young children. AI-generated problems, adaptive difficulty, parent dashboard.

## Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Express + TypeScript + MongoDB (Mongoose)
- **AI Providers**: OpenAI API, Opencode CLI (fallback)
- **Infrastructure**: Docker Compose (MongoDB + Backend)

## Quick Start

### Local Development (no Docker)

```bash
# Start MongoDB (required)
docker compose up -d mongodb

# Backend
cd backend
cp .env.example .env    # Edit OPENAI_API_KEY if desired
npm install
npm run dev             # Starts on :4000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev             # Starts on :3000, proxies /api to :4000
```

### Docker (all services)

```bash
docker compose up --build
# Backend: http://localhost:4000
# Health:   http://localhost:4000/health
```

## Running Tests

```bash
# Backend tests
cd backend
npm test                # vitest run

# Frontend tests
cd frontend
npm test                # vitest run
```

## API Endpoints

See [docs/api.md](docs/api.md) for full API documentation with example payloads.

## Project Structure

```
nala-guru/
├── backend/
│   ├── src/
│   │   ├── routes/         # Express route handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── services/       # Business logic (AI, calibration, performance)
│   │   └── __tests__/      # Backend tests
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   └── __tests__/      # Frontend tests
│   └── package.json
├── docker-compose.yml
└── README.md
```
