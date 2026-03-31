# UniDECK — Sistema Municipal de Gestão Documental e Protocolo Eletrônico

UniDECK is a comprehensive **Municipal Document Management and Electronic Protocol System** designed for Brazilian city halls. It digitalizes, organizes, routes, and tracks documents and administrative processes, replacing paper-based workflows with a secure, auditable digital platform.

---

## Features (MVP — Phase 1)

| Module | Description |
|---|---|
| 🔐 Auth & Profiles | JWT login, 9 role types, role-based access control |
| 📋 Electronic Protocol | Auto-numbered protocols (internal & external), priority, due dates |
| 📁 Document Management | File upload (PDF, images), versioning, search |
| 🔄 Sector Routing | Forward/dispatch/return documents between departments |
| 📊 Movement History | Full immutable audit trail of every document action |
| 🏢 Sector Management | Organs, secretariats, and departments CRUD |
| 👥 User Management | Staff and citizen profiles, sector assignment |
| 📈 Reports | Dashboard stats, top sectors, overdue protocols |
| 🔍 Search | Search by number, subject, requester name, CPF/CNPJ |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 · TypeScript · Tailwind CSS |
| Backend | NestJS · TypeScript · Passport JWT |
| Database | PostgreSQL · TypeORM |
| File Storage | Multer (disk) — S3-compatible in production |
| API Docs | Swagger (`/api/docs`) |
| Containers | Docker · Docker Compose |

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or Docker)

### Quick Start with Docker

```bash
docker compose up -d
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Swagger Docs**: http://localhost:3001/api/docs

### Local Development

**1. Start PostgreSQL** (or use Docker):
```bash
docker compose up postgres -d
```

**2. Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials
npm install
npm run start:dev
```

**3. Frontend:**
```bash
cd frontend
# Edit .env.local if needed
npm install
npm run dev
```

---

## Project Structure

```
UniDECK/
├── backend/                    # NestJS API
│   └── src/
│       ├── modules/
│       │   ├── auth/           # JWT authentication
│       │   ├── users/          # User management
│       │   ├── sectors/        # Department/sector management
│       │   ├── protocols/      # Electronic protocols
│       │   ├── documents/      # Document storage
│       │   ├── movements/      # Document routing (tramitação)
│       │   ├── reports/        # Analytics & reports
│       │   └── audit/          # Audit logs
│       └── common/             # Guards, decorators, enums
├── frontend/                   # Next.js UI
│   └── src/
│       ├── app/                # Pages (App Router)
│       │   ├── login/
│       │   ├── dashboard/
│       │   ├── protocols/
│       │   ├── sectors/
│       │   ├── users/
│       │   └── reports/
│       ├── components/         # Reusable UI components
│       ├── lib/                # API client, auth utilities
│       └── types/              # TypeScript interfaces
├── docker-compose.yml
└── README.md
```

---

## User Roles

| Role | Description |
|---|---|
| `admin` | Full system access |
| `secretary_manager` | Manages a secretariat |
| `protocol` | Opens and routes protocols |
| `internal_user` | Regular staff member |
| `controller` | Financial control |
| `legal` | Legal department |
| `hr` | Human resources |
| `citizen` | External citizen user |
| `auditor` | Read-only audit access |

---

## Protocol Number Format

Protocols are automatically numbered:
```
2026/INT/000001  — internal protocol
2026/EXT/000002  — external (citizen) protocol
```

---

## API Endpoints (Summary)

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/protocols` | List protocols (search, filter, paginate) |
| POST | `/api/protocols` | Create protocol |
| GET | `/api/protocols/:id` | Get protocol detail |
| PATCH | `/api/protocols/:id` | Update protocol |
| POST | `/api/protocols/:id/attachments` | Upload attachment |
| GET | `/api/movements/protocol/:id` | Get movement history |
| POST | `/api/movements` | Add movement (dispatch/forward/etc.) |
| GET | `/api/sectors` | List sectors |
| POST | `/api/sectors` | Create sector |
| GET | `/api/users` | List users |
| POST | `/api/users` | Create user |
| GET | `/api/reports/dashboard` | Dashboard stats |
| GET | `/api/reports/top-sectors` | Top sectors by demand |
| GET | `/api/reports/overdue` | Overdue protocols |

Full Swagger documentation is available at `/api/docs`.

---

## Roadmap

### Phase 2
- [ ] Electronic signature (with signature queue)
- [ ] Digital administrative processes (processo administrativo)
- [ ] Document templates (ofícios, memorandos, despachos)
- [ ] Advanced management panel

### Phase 3
- [ ] Citizen portal (external protocol tracking)
- [ ] Email / WhatsApp notifications
- [ ] ICP-Brasil digital certificate integration
- [ ] Mobile app / PWA
- [ ] OCR integration for scanned documents
- [ ] Portal da Transparência integration

---

## Security & Compliance

- LGPD-aware confidentiality levels (public / internal / restricted / confidential)
- JWT authentication with configurable expiry
- Role-based access control on all endpoints
- Soft-delete only (no physical record removal)
- Full audit log for all actions
- Bcrypt password hashing

---

## License

UNLICENSED — proprietary municipal software.
