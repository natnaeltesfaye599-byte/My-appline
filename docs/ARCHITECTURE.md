# MyUpline Architecture

## Application Shape

- `app/[locale]`: localized public marketing website.
- `app/[locale]/dashboard/[role]`: role-based dashboard shell for member, team leader, trainer, admin, and super admin.
- `app/api/*`: REST API route handlers.
- `components/*`: reusable UI and product surfaces.
- `lib/*`: auth, i18n, demo data, Prisma client, and API response helpers.
- `prisma/schema.prisma`: PostgreSQL data model.

## Backend Modules

- Authentication and RBAC
  - Registration
  - Login
  - Forgot password
  - Reset password
  - Email verification
  - Profile setup
  - User role administration
- Member profiles and activity tracking
- Teams and leadership assignment
- Recruitment leads, referral links, and referral codes
- LMS courses, lessons, quizzes, enrollments, and certificates
- Membership plans, manual payment proof, renewals, and expiration tracking
- Notifications, announcements, and messaging
- Reporting and analytics
- CMS content for pages, news, FAQs, and announcements

## Production Hardening Checklist

- Add real email provider for password resets, announcements, and notifications.
- Store refresh tokens in httpOnly cookies and rotate them on use.
- Add account lockout and rate limits for login, register, forgot password, and reset password endpoints.
- Add object storage for videos, PDFs, payment proof files, and certificates.
- Add job queue for certificate generation, renewal reminders, and analytics aggregation.
- Add database indexes after real query patterns are known.
- Add row-level organization scoping to every service query.
- Add integration tests for auth, RBAC, subscriptions, referrals, and LMS completion flows.
