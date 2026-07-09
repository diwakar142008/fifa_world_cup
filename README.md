# StadiumMind AI — The Generative AI OS for FIFA World Cup 2026

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 16)                      │
│  Landing → Login → Dashboard → Operations → Maps → Chat    │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/WebSocket
┌──────────────────────▼──────────────────────────────────────┐
│                 API Proxy (next.config.ts)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Backend (FastAPI + Python 3.11)                  │
│                                                              │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐    │
│  │ Auth    │  │ AI       │  │ RAG     │  │ Security │    │
│  │ JWT     │  │ OpenAI   │  │ KB      │  │ Rate     │    │
│  │ bcrypt  │  │ LangChain│  │ Vector  │  │ Limit    │    │
│  └─────────┘  └──────────┘  └─────────┘  └──────────┘    │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐    │
│  │ Routes  │  │ Database │  │ WebSock │  │ Mock     │    │
│  │ REST    │  │ Postgres │  │ Live    │  │ Data     │    │
│  └─────────┘  └──────────┘  └─────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- OpenAI API Key (optional — app runs without it)

### Frontend

```bash
cd stadium-mind-ai
npm install
npm run dev
```

### Backend

```bash
cd stadium-mind-ai/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Configure your environment
uvicorn app.main:app --reload --port 8000
```

### Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...           # Real AI responses (optional, falls back gracefully)

# Security
JWT_SECRET_KEY=change-this-in-production  # Strong random string in production
CORS_ORIGINS=["http://localhost:3000"]

# Database (optional — mock data used by default)
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/stadiummind
USE_MOCK_DATA=true

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000  # Uses Next.js proxy by default
```

## Key Features

### ✅ Real Generative AI

- OpenAI GPT-4.1/GPT-5 integration
- Streaming responses
- Conversation memory (per-session)
- RAG with knowledge base
- Fallback when API key not configured

### ✅ Multi-Agent System

- 12 specialized AI agent descriptions
- Agent coordination framework
- Simulation engine for "what-if" scenarios

### ✅ Authentication & Security

- JWT tokens with expiration
- bcrypt password hashing
- Rate limiting (100 req/min per IP)
- Security headers (HSTS, XSS, CSP)
- Restricted CORS

### ✅ Interactive Stadium Map

- Leaflet with CartoDB dark tiles
- Zone coloring by crowd level
- Clickable POIs and sections
- Layer toggles and search

### ✅ AI Operations Dashboard

- Real-time KPIs
- AI-generated summaries
- Trend charts (Recharts)
- Domain health monitoring

### ✅ Simulation Engine

- 8 scenario presets
- Impact analysis across 6 dimensions
- Recommended actions
- Alternative strategies

## API Endpoints

| Method | Path                         | Description            |
| ------ | ---------------------------- | ---------------------- |
| POST   | /api/v1/auth/login           | Login with real JWT    |
| POST   | /api/v1/auth/logout          | Logout                 |
| GET    | /api/v1/auth/me              | Get current user       |
| POST   | /api/v1/ai/chat              | AI chat with RAG       |
| GET    | /api/v1/ai/summary           | AI stadium summary     |
| GET    | /api/v1/ai/predictions       | AI crowd predictions   |
| POST   | /api/v1/simulation/run       | Run what-if simulation |
| GET    | /api/v1/operations/dashboard | Full dashboard data    |

## Tech Stack

- **Frontend:** Next.js 16, React 19, Framer Motion, Tailwind CSS 4, Recharts, Leaflet
- **Backend:** FastAPI, Pydantic, SQLAlchemy 2.0, Alembic
- **AI:** OpenAI API, LangChain, RAG with keyword retrieval
- **Auth:** python-jose (JWT), bcrypt, HTTP Bearer
- **Security:** Rate limiting, CORS, security headers
- **Testing:** pytest (planned), Vitest (planned)

## Development

```bash
# Frontend lint
npm run lint

# Backend (with live reload)
uvicorn app.main:app --reload

# Build for production
npm run build
npm start
```

## License

MIT — Built for FIFA World Cup 2026 GenAI Hackathon
