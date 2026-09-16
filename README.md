# MyUpline

MyUpline is a membership management, recruitment, training, subscription, communication, and organizational growth platform.

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- ShadCN-style reusable components
- PostgreSQL with Prisma
- JWT authentication and RBAC
- English and Amharic localization

## Getting Started

```bash
npm.cmd install
copy .env.example .env
npm.cmd run dev
```

Open `http://localhost:3000`.

## Demo Routes

- `/en`
- `/am`
- `/en/auth/sign-up`
- `/en/auth/sign-in`
- `/en/auth/forgot-password`
- `/en/auth/reset-password`
- `/en/auth/verify-email`
- `/en/auth/profile-setup`
- `/en/dashboard/super-admin`
- `/en/dashboard/admin`
- `/en/dashboard/team-leader`
- `/en/dashboard/trainer`
- `/en/dashboard/member`

## Documentation

- API: `docs/API.md`
- Architecture: `docs/ARCHITECTURE.md`
- Database schema: `prisma/schema.prisma`

## Auth Notes

The authentication system is database-backed with Prisma/PostgreSQL. Run a migration before using the auth APIs against a real database:

```bash
npm.cmd run prisma:migrate
```

Email verification and password reset endpoints return development links when `NODE_ENV` is not `production`. Connect a transactional email provider before production launch.
