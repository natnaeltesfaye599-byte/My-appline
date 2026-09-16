# MyUpline REST API

Base URL: `/api`

Authentication: JWT bearer token.

Roles: `SUPER_ADMIN`, `ADMIN`, `TRAINER`, `TEAM_LEADER`, `MEMBER`.

## Auth

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Register a new member account. |
| `POST` | `/auth/login` | Validate credentials and issue a JWT access token. |
| `POST` | `/auth/forgot-password` | Start password reset workflow. |
| `POST` | `/auth/reset-password` | Reset password using a valid reset token. |
| `POST` | `/auth/verify-email` | Verify email using a valid verification token. |
| `GET` | `/auth/me` | Return the authenticated user from a bearer token. |
| `POST` | `/auth/profile` | Complete or update member profile setup. |

## RBAC

| Method | Path | Roles | Purpose |
| --- | --- | --- | --- |
| `GET` | `/admin/users` | `SUPER_ADMIN`, `ADMIN` | List users in the current organization. |
| `PATCH` | `/admin/users` | `SUPER_ADMIN` | Change a user's role. |

Supported roles:

- `SUPER_ADMIN`
- `ADMIN`
- `TEAM_LEADER`
- `TRAINER`
- `MEMBER`

## Core Modules

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/members` | List member profiles with pagination. |
| `POST` | `/members` | Create member profile and team assignment. |
| `GET` | `/referrals` | List referral links, codes, leads, and analytics. |
| `POST` | `/referrals` | Create a lead from a member referral. |
| `GET` | `/courses` | List LMS courses, lessons, and completion metadata. |
| `POST` | `/courses` | Create a course draft for trainer/admin review. |
| `GET` | `/subscriptions` | List subscriptions and renewal status. |
| `POST` | `/subscriptions` | Submit manual payment proof for verification. |
| `GET` | `/reports?type=membership` | Generate membership, recruitment, LMS, or subscription report. |
| `GET` | `/cms` | List CMS pages, news, FAQs, and announcements. |
| `POST` | `/cms` | Create localized content in English or Amharic. |

## Production Notes

- Replace demo responses with Prisma service calls.
- Enforce RBAC per handler using `verifyAccessToken` and `hasRole`.
- Store refresh tokens in httpOnly cookies and rotate them.
- Connect SMTP or transactional email for verification and reset links.
- Add file storage for payment proofs, PDFs, course videos, and certificate exports.
- Add audit logging around role changes, manual payment verification, CMS publish actions, and subscription renewals.
