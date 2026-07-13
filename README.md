# StadiumMind AI

**The Generative AI Operating System for FIFA World Cup 2026 Stadiums**

[![CI/CD](https://github.com/your-org/stadium-mind-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/stadium-mind-ai/actions/workflows/ci.yml)

## Overview

StadiumMind AI is a production-grade, enterprise platform that combines multi-agent AI orchestration, real-time digital twin technology, predictive analytics, and operational intelligence for stadium management at the FIFA World Cup 2026.

### Key Capabilities

- **12 Specialized AI Agents** — Navigation, Crowd Management, Emergency Response, Medical, Security, Sustainability, Transportation, Volunteer Coordination, Vendor Management, Operations, Accessibility, and Coordinator
- **Real-Time Digital Twin** — Live virtual replica of every stadium, updated every 5 seconds from IoT, CCTV, GPS, and sensor networks
- **Predictive Analytics** — AI predicts congestion, demand, and incidents 10-30 minutes before they occur
- **Multi-Agent Orchestration** — Central coordinator agent generates unified responses from all specialized agents
- **Simulation Engine** — "What-if" scenario testing for gate closures, weather events, evacuations, and more
- **Multi-Lingual AI** — Real-time translation across 11 languages
- **Dark Mode & Accessibility** — WCAG 2.1 AA compliant with full dark mode support

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js 15)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐ │
│  │ Dashboard│ │    Map   │ │Simulation│ │ AI Chat / Insights │ │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/WS
┌──────────────────────────▼──────────────────────────────────────┐
│                    Backend (FastAPI / Python)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐ │
│  │  Routes  │ │Middleware│ │ Services │ │  WebSocket Manager│ │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────────────────┐ │
│  │  Models  │ │  Cache   │ │   AI Orchestration (OpenAI/    │ │
│  │ (SQLAlch)│ │  (Redis) │ │   Anthropic/Gemini Fallback)  │ │
│  └──────────┘ └──────────┘ └────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Backend Architecture

```
backend/
├── app/
│   ├── api/routes/       # FastAPI route handlers (9 modules)
│   ├── middleware/        # Security, CORS, Rate Limiting, CSRF, Validation
│   ├── models/            # SQLAlchemy ORM models (10 modules)
│   ├── schemas/           # Pydantic request/response validation
│   ├── services/          # Business logic (13 services)
│   ├── websocket/         # Real-time WebSocket manager
│   ├── mock_data/         # Development/demo data generator
│   ├── config.py          # Centralized settings via Pydantic
│   ├── database.py        # Async SQLAlchemy engine & sessions
│   └── main.py            # Application entry point
├── tests/                 # pytest test suite (11 test modules)
├── Dockerfile             # Multi-stage Docker build
└── requirements.txt       # Python dependencies
```

### Frontend Architecture

```
src/
├── app/
│   ├── layout.tsx         # Root layout with metadata, fonts, accessibility
│   ├── page.tsx           # Landing page with hero, agents, features
│   ├── globals.css        # Global styles, CSS variables, Tailwind
│   ├── login/             # Authentication page
│   └── dashboard/         # Dashboard pages (operations, map, simulation, etc.)
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   ├── landing/           # Landing page components
│   └── map/               # Map visualization components
├── contexts/              # React contexts (Accessibility)
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions and API client
```

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- Redis (optional, for caching)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run with mock data (no database required)
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
# From project root
npm install
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Docker Setup

```bash
# Build and run all services
docker-compose up --build

# Or build individually
docker build -t stadiummind-backend ./backend
docker build -t stadiummind-frontend -f Dockerfile.frontend .
```

## Environment Variables

### Backend (`backend/.env`)

| Variable            | Default                    | Description                      |
| ------------------- | -------------------------- | -------------------------------- |
| `DEBUG`             | `false`                    | Enable debug mode                |
| `USE_MOCK_DATA`     | `true`                     | Use mock data (no DB required)   |
| `JWT_SECRET_KEY`    | `change-me-in-production`  | JWT signing secret               |
| `OPENAI_API_KEY`    | —                          | OpenAI API key for AI features   |
| `ANTHROPIC_API_KEY` | —                          | Anthropic API key (fallback)     |
| `GEMINI_API_KEY`    | —                          | Google Gemini API key (fallback) |
| `DATABASE_URL`      | `postgresql+asyncpg://...` | PostgreSQL connection string     |
| `REDIS_URL`         | `redis://localhost:6379/0` | Redis connection string          |

### Frontend

| Variable              | Default                  | Description     |
| --------------------- | ------------------------ | --------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000`  | Backend API URL |
| `NEXT_PUBLIC_WS_URL`  | `ws://localhost:8000/ws` | WebSocket URL   |

## API Documentation

### Authentication

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| POST   | `/api/v1/auth/login`   | Login with email/password |
| POST   | `/api/v1/auth/logout`  | Invalidate session        |
| GET    | `/api/v1/auth/me`      | Get current user          |
| POST   | `/api/v1/auth/refresh` | Refresh access token      |

### Stadium Operations

| Method | Endpoint                    | Description          |
| ------ | --------------------------- | -------------------- |
| GET    | `/api/v1/stadium`           | Get stadium status   |
| GET    | `/api/v1/stadium/zones`     | Get zone-level data  |
| GET    | `/api/v1/stadium/incidents` | Get active incidents |

### AI & Intelligence

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| POST   | `/api/v1/ai/chat`        | AI chat completion              |
| POST   | `/api/v1/ai/chat-stream` | Streaming AI chat (SSE)         |
| GET    | `/api/v1/ai/summary`     | AI-generated operations summary |
| GET    | `/api/v1/ai/predictions` | Crowd congestion predictions    |
| GET    | `/api/v1/ai/models`      | AI model status                 |
| GET    | `/api/v1/ai/knowledge`   | Knowledge base stats            |

### Operations Dashboard

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| GET    | `/api/v1/operations/dashboard` | Complete ops dashboard |

### Simulation

| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| POST   | `/api/v1/simulation/run`     | Run what-if simulation |
| GET    | `/api/v1/simulation/presets` | Get scenario presets   |

### WebSocket

| Endpoint              | Description              |
| --------------------- | ------------------------ |
| `ws://host/ws`        | Global real-time updates |
| `ws://host/ws/{room}` | Room-specific broadcasts |

### Health

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| GET    | `/health`           | Comprehensive health check |
| GET    | `/health/readiness` | Readiness probe            |
| GET    | `/health/liveness`  | Liveness probe             |

## Testing

### Backend Tests

```bash
cd backend
python -m pytest tests/ --verbose --cov=app --cov-report=term-missing
```

### Frontend Tests

```bash
npm test
```

### Docker Tests

```bash
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
```

## CI/CD

The project uses GitHub Actions for:

- **Backend**: Python 3.11 & 3.12 testing, linting, coverage
- **Frontend**: ESLint, TypeScript check, production build
- **Docker**: Multi-stage build verification
- **Security**: Trivy vulnerability scanning
- **Deployment**: Automated Render deployment

## Deployment

### Render

1. Fork this repository
2. Connect your Render account
3. Create a Web Service from the `backend/` directory
4. Create a Static Site from the root directory
5. Set environment variables in Render dashboard
6. Push to `main` branch to trigger auto-deploy

### Manual Deployment

```bash
# Build and run with Docker
docker-compose up --build -d

# Or deploy individually
docker build -t stadiummind-backend ./backend
docker run -d -p 8000:8000 stadiummind-backend

docker build -t stadiummind-frontend -f Dockerfile.frontend .
docker run -d -p 3000:3000 stadiummind-frontend
```

## Security

- JWT-based authentication with bcrypt password hashing
- CSRF protection via double-submit cookie pattern
- Rate limiting per IP address
- CORS with strict origin validation
- Security headers (HSTS, XSS Protection, CSP)
- Token blacklisting for logout
- Input validation on all API endpoints
- Audit logging for security events

## Performance

- Redis caching for API responses
- Async database sessions with connection pooling
- Lazy loading and code splitting (frontend)
- Image optimization via Next.js
- Tree-shaking via ES modules
- Multi-stage Docker builds for smaller images
- WebSocket compression for real-time data

## Accessibility

- WCAG 2.1 AA compliant
- Skip-to-content navigation
- Screen reader optimized
- Keyboard navigation support
- High contrast mode
- Reduced motion support
- Focus indicators
- Semantic HTML

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `cd backend && python -m pytest tests/`
5. Run linter: `cd backend && flake8 app tests`
6. Submit a pull request

## License

Proprietary - FIFA World Cup 2026

## Team

- **StadiumMind AI Team**
- For support: [stadium-mind.ai](https://stadium-mind.ai)
