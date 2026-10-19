# ZYVEN Testing Documentation

## 1. Test Suite Structure
- **Unit & Integration Tests**: Vitest (`npm run test`)
- **Type Checking**: TypeScript strict mode (`npm run typecheck`)
- **Linting**: ESLint (`npm run lint`)
- **End-to-End Test Matrix**:
  - `Student Login -> View Task -> Submit Proof -> Ambassador Review -> Atomic Points Award`
  - `Ambassador Task Studio -> Draft -> Admin Approval -> Live in Student Feed`
  - `Admin Login -> Same login screen -> Server resolves role -> /admin`
  - `IDOR Protection -> Accessing other users' submissions is blocked`

## 2. Running Automated Tests
```bash
# Run unit & schema tests
npm run test

# Run type validation
npm run typecheck

# Run production build
npm run build
```
